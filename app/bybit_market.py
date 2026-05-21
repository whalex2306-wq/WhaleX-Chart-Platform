
from __future__ import annotations
import asyncio, json, time
from typing import AsyncGenerator, Dict, Optional
import websockets
from .candle_history import fetch_candles_with_fallback
from .liquidity import LiquidityMemory, bucket_orderbook, line_to_dict

BYBIT_WS = "wss://stream.bybit.com/v5/public/linear"
INTERVAL_MAP = {"1":"1","3":"3","5":"5","15":"15","30":"30","60":"60","120":"120","240":"240","D":"D"}

class BybitMarketStream:
    def __init__(self, symbol="BTCUSDT", interval="15", bucket=100.0, min_m=5.0, max_lines=10, depth=200, publish_ms=750):
        self.symbol = symbol.upper().strip()
        self.interval = INTERVAL_MAP.get(str(interval), "15")
        self.bucket = max(float(bucket), 0.01)
        self.min_m = max(float(min_m), 0.0)
        self.max_lines = max(1, min(int(max_lines), 50))
        self.depth = depth if depth in (50, 200, 500) else 200
        self.publish_ms = max(250, int(publish_ms))
        self.book: Dict[str, Dict[float, float]] = {"bid": {}, "ask": {}}
        self.bid_memory = LiquidityMemory()
        self.ask_memory = LiquidityMemory()
        self.best_bid: Optional[float] = None
        self.best_ask: Optional[float] = None
        self.history_source = "loading"

    async def fetch_initial_candles(self, limit=500):
        return await fetch_candles_with_fallback(self.symbol, self.interval, limit)

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
        bid_lines = self.bid_memory.update("bid", bid_raw, self.min_m, self.max_lines)
        ask_lines = self.ask_memory.update("ask", ask_raw, self.min_m, self.max_lines)
        mid = (self.best_bid + self.best_ask) / 2.0 if self.best_bid is not None and self.best_ask is not None else None
        return {
            "type": "liquidity",
            "exchange": "Bybit order book",
            "history_source": self.history_source,
            "symbol": self.symbol,
            "ready": bool(self.book["bid"] and self.book["ask"]),
            "ts": int(time.time() * 1000),
            "mid": mid,
            "best_bid": self.best_bid,
            "best_ask": self.best_ask,
            "bid_lines": [line_to_dict(x) for x in bid_lines],
            "ask_lines": [line_to_dict(x) for x in ask_lines],
        }

    async def stream(self) -> AsyncGenerator[dict, None]:
        try:
            candles, source, warning = await self.fetch_initial_candles()
            self.history_source = source
            yield {"type": "candles", "symbol": self.symbol, "interval": self.interval, "history_source": source, "warning": warning, "candles": candles}
        except Exception as e:
            yield {"type": "status", "status": "history unavailable", "error": str(e)}

        sub = {"op": "subscribe", "args": [f"kline.{self.interval}.{self.symbol}", f"orderbook.{self.depth}.{self.symbol}"]}
        while True:
            try:
                async with websockets.connect(BYBIT_WS, ping_interval=20, ping_timeout=20, close_timeout=5) as ws:
                    await ws.send(json.dumps(sub))
                    yield {"type": "status", "status": "connected", "exchange": "Bybit order book", "symbol": self.symbol, "history_source": self.history_source}
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
                                yield {"type": "candle", "symbol": self.symbol, "interval": self.interval, "history_source": self.history_source, "candle": candle}
                        elif topic.startswith("orderbook."):
                            self.apply_orderbook(msg)
                            now = time.time() * 1000.0
                            if now - last_publish >= self.publish_ms:
                                last_publish = now
                                yield self.build_liquidity_payload()
            except asyncio.CancelledError:
                raise
            except Exception as e:
                yield {"type": "status", "status": "reconnecting", "error": str(e), "exchange": "Bybit order book", "history_source": self.history_source}
                await asyncio.sleep(3)
