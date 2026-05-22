
from __future__ import annotations
import asyncio, json, time
from typing import AsyncGenerator, Dict, Optional
import websockets
import httpx
from .candle_history import fetch_candles_with_fallback
from .liquidity import LiquidityMemory, bucket_orderbook, line_to_dict, split_far
from .estimated_liquidation import EstimatedLiquidationModel

BYBIT_WS = "wss://stream.bybit.com/v5/public/linear"
INTERVAL_MAP = {"1":"1","3":"3","5":"5","15":"15","30":"30","60":"60","120":"120","240":"240","D":"D"}

class BybitMarketStream:
    def __init__(self, symbol="BTCUSDT", interval="15", bucket=100.0, min_m=5.0, max_lines=10, depth=200, publish_ms=750):
        self.symbol = symbol.upper().strip()
        self.interval = INTERVAL_MAP.get(str(interval), "15")
        self.bucket = max(float(bucket), 0.01)
        self.min_m = max(float(min_m), 0.0)
        self.max_lines = max(1, min(int(max_lines), 50))
        self.depth = depth if depth in (50, 200, 500) else 500
        self.deep_snapshot_ms = 8000
        self.last_deep_snapshot = 0.0
        self.deep_levels = {"bid": 0, "ask": 0}
        self.deep_status = "ws-depth"
        self.publish_ms = max(250, int(publish_ms))
        self.book: Dict[str, Dict[float, float]] = {"bid": {}, "ask": {}}
        self.bid_memory = LiquidityMemory()
        self.ask_memory = LiquidityMemory()
        self.best_bid: Optional[float] = None
        self.best_ask: Optional[float] = None
        self.history_source = "loading"
        self.candles = []
        self.est_liq_model = EstimatedLiquidationModel()
        self.funding_rate = None
        self.oi_value_m = None
        self.derivative_status = "derivatives loading"
        self.last_derivative_snapshot = 0.0

    async def refresh_deep_snapshot(self) -> bool:
        """
        Bybit WebSocket depth is live but not always enough for far levels.
        This REST snapshot tries to load the deepest available order book and merges it
        into the live book. If 1000 is not accepted by the exchange, fallback to 500.
        """
        now_ms = time.time() * 1000.0
        if now_ms - self.last_deep_snapshot < self.deep_snapshot_ms:
            return False

        self.last_deep_snapshot = now_ms
        limits = (1000, 500)
        last_error = None

        for limit in limits:
            try:
                url = "https://api.bybit.com/v5/market/orderbook"
                params = {"category": "linear", "symbol": self.symbol, "limit": limit}
                async with httpx.AsyncClient(timeout=6.0) as client:
                    r = await client.get(url, params=params)
                    r.raise_for_status()
                    payload = r.json()

                result = payload.get("result") or {}
                bids = result.get("b") or []
                asks = result.get("a") or []
                if not bids and not asks:
                    continue

                for price_s, qty_s in bids:
                    price, qty = float(price_s), float(qty_s)
                    if qty > 0:
                        self.book["bid"][price] = qty
                for price_s, qty_s in asks:
                    price, qty = float(price_s), float(qty_s)
                    if qty > 0:
                        self.book["ask"][price] = qty

                self.best_bid = max(self.book["bid"].keys()) if self.book["bid"] else self.best_bid
                self.best_ask = min(self.book["ask"].keys()) if self.book["ask"] else self.best_ask
                self.deep_levels = {"bid": len(bids), "ask": len(asks)}
                self.deep_status = f"REST depth {limit}"
                return True
            except Exception as e:
                last_error = str(e)
                continue

        self.deep_status = f"WS depth only" + (f" · REST failed: {last_error[:80]}" if last_error else "")
        return False

    async def fetch_initial_candles(self, limit=1000):
        candles, source, warning = await fetch_candles_with_fallback(self.symbol, self.interval, limit)
        self.candles = list(candles or [])
        return candles, source, warning

    async def refresh_derivatives_context(self) -> bool:
        now_ms = time.time() * 1000.0
        if now_ms - self.last_derivative_snapshot < 30_000:
            return False

        self.last_derivative_snapshot = now_ms
        try:
            url = "https://api.bybit.com/v5/market/tickers"
            params = {"category": "linear", "symbol": self.symbol}
            async with httpx.AsyncClient(timeout=6.0) as client:
                r = await client.get(url, params=params)
                r.raise_for_status()
                payload = r.json()

            rows = (payload.get("result") or {}).get("list") or []
            if not rows:
                self.derivative_status = "derivatives unavailable"
                return False

            row = rows[0]
            try:
                self.funding_rate = float(row.get("fundingRate") or 0.0)
            except Exception:
                self.funding_rate = None

            oi_val = row.get("openInterestValue")
            if oi_val is None:
                # fallback: openInterest * last price
                try:
                    oi_val = float(row.get("openInterest") or 0.0) * float(row.get("lastPrice") or 0.0)
                except Exception:
                    oi_val = None

            try:
                self.oi_value_m = float(oi_val) / 1_000_000.0 if oi_val is not None else None
            except Exception:
                self.oi_value_m = None

            self.derivative_status = "Bybit funding + OI"
            return True
        except Exception as e:
            self.derivative_status = f"derivatives unavailable: {str(e)[:70]}"
            return False

    def apply_candle_to_memory(self, candle: dict):
        if not candle:
            return
        if self.candles and int(self.candles[-1].get("time", 0)) == int(candle.get("time", 0)):
            self.candles[-1] = candle
        else:
            self.candles.append(candle)
            if len(self.candles) > 3000:
                self.candles = self.candles[-3000:]

    def apply_orderbook(self, msg: dict):
        data = msg.get("data", {}) or {}
        if msg.get("type") == "snapshot":
            self.book["bid"].clear()
            self.book["ask"].clear()

        for price_s, qty_s in data.get("b", []) or []:
            price, qty = float(price_s), float(qty_s)
            if qty <= 0:
                self.book["bid"].pop(price, None)
            else:
                self.book["bid"][price] = qty

        for price_s, qty_s in data.get("a", []) or []:
            price, qty = float(price_s), float(qty_s)
            if qty <= 0:
                self.book["ask"].pop(price, None)
            else:
                self.book["ask"][price] = qty

        self.best_bid = max(self.book["bid"].keys()) if self.book["bid"] else None
        self.best_ask = min(self.book["ask"].keys()) if self.book["ask"] else None

    def update_candle(self, msg: dict):
        arr = msg.get("data", []) or []
        if not arr:
            return None
        k = arr[0]
        try:
            return {
                "time": int(int(k["start"]) / 1000),
                "open": float(k["open"]),
                "high": float(k["high"]),
                "low": float(k["low"]),
                "close": float(k["close"]),
                "volume": float(k.get("volume", 0)),
                "confirm": bool(k.get("confirm", False)),
            }
        except Exception:
            return None

    def build_liquidity_payload(self):
        bid_raw, ask_raw = bucket_orderbook(self.book, self.bucket)
        mid = (self.best_bid + self.best_ask) / 2.0 if self.best_bid is not None and self.best_ask is not None else None

        bid_lines = self.bid_memory.update("bid", bid_raw, self.min_m, self.max_lines, mid=mid, stale_seconds=150)
        ask_lines = self.ask_memory.update("ask", ask_raw, self.min_m, self.max_lines, mid=mid, stale_seconds=150)

        far_bids = split_far(bid_lines)
        far_asks = split_far(ask_lines)

        return {
            "type": "liquidity",
            "exchange": f"Bybit order book · {self.deep_status}",
            "history_source": self.history_source,
            "symbol": self.symbol,
            "ready": bool(self.book["bid"] and self.book["ask"]),
            "ts": int(time.time() * 1000),
            "mid": mid,
            "best_bid": self.best_bid,
            "best_ask": self.best_ask,
            "bucket": self.bucket,
            "min_m": self.min_m,
            "max_lines": self.max_lines,
            "book_levels": {"bid": len(self.book["bid"]), "ask": len(self.book["ask"])},
            "deep_levels": self.deep_levels,
            "far_counts": {"bid": len(far_bids), "ask": len(far_asks)},
            "bid_lines": [line_to_dict(x) for x in bid_lines],
            "ask_lines": [line_to_dict(x) for x in ask_lines],
            "far_bid_lines": [line_to_dict(x) for x in far_bids],
            "far_ask_lines": [line_to_dict(x) for x in far_asks],
            "estimated_liquidation": self.est_liq_model.build(
                self.candles,
                mid,
                funding_rate=self.funding_rate,
                oi_value_m=self.oi_value_m,
            ),
            "derivative_status": self.derivative_status,
        }

    async def stream(self) -> AsyncGenerator[dict, None]:
        try:
            candles, source, warning = await self.fetch_initial_candles()
            self.history_source = source
            await self.refresh_derivatives_context()
            yield {"type": "candles", "symbol": self.symbol, "interval": self.interval, "history_source": source, "warning": warning, "candles": candles}
        except Exception as e:
            yield {"type": "status", "status": "history unavailable", "error": str(e)}

        sub = {"op": "subscribe", "args": [f"kline.{self.interval}.{self.symbol}", f"orderbook.{self.depth}.{self.symbol}"]}
        while True:
            try:
                async with websockets.connect(BYBIT_WS, ping_interval=20, ping_timeout=20, close_timeout=5) as ws:
                    await ws.send(json.dumps(sub))
                    yield {"type": "status", "status": "connected", "exchange": "Bybit order book", "symbol": self.symbol, "history_source": self.history_source}
                    await self.refresh_deep_snapshot()
                    await self.refresh_derivatives_context()
                    yield self.build_liquidity_payload()
                    last_publish = 0.0
                    async for raw in ws:
                        try:
                            msg = json.loads(raw)
                        except Exception:
                            continue
                        topic = msg.get("topic", "")
                        if topic.startswith("kline."):
                            candle = self.update_candle(msg)
                            if candle:
                                self.apply_candle_to_memory(candle)
                                yield {"type": "candle", "symbol": self.symbol, "interval": self.interval, "history_source": self.history_source, "candle": candle}
                        elif topic.startswith("orderbook."):
                            self.apply_orderbook(msg)
                            now = time.time() * 1000.0
                            if now - self.last_deep_snapshot >= self.deep_snapshot_ms:
                                await self.refresh_deep_snapshot()
                            if now - self.last_derivative_snapshot >= 30_000:
                                await self.refresh_derivatives_context()
                            if now - last_publish >= self.publish_ms:
                                last_publish = now
                                yield self.build_liquidity_payload()
            except asyncio.CancelledError:
                raise
            except Exception as e:
                yield {"type": "status", "status": "reconnecting", "error": str(e), "exchange": "Bybit order book", "history_source": self.history_source}
                await asyncio.sleep(3)
