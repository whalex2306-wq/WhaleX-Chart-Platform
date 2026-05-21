from __future__ import annotations

from typing import List, Tuple
import httpx

BYBIT_REST = "https://api.bybit.com"
OKX_REST = "https://www.okx.com"

OKX_INTERVALS = {
    "1": "1m", "3": "3m", "5": "5m", "15": "15m", "30": "30m",
    "60": "1H", "120": "2H", "240": "4H", "D": "1D",
}


def symbol_to_okx_swap(symbol: str) -> str:
    s = symbol.upper().strip()
    if s.endswith("USDT"):
        return f"{s[:-4]}-USDT-SWAP"
    return s if "-" in s else "BTC-USDT-SWAP"


async def fetch_bybit_candles(symbol: str, interval: str, limit: int = 500) -> Tuple[List[dict], str]:
    params = {"category": "linear", "symbol": symbol.upper().strip(), "interval": str(interval), "limit": str(limit)}
    async with httpx.AsyncClient(timeout=15.0, headers={"User-Agent": "WhaleX/1.1"}) as client:
        r = await client.get(f"{BYBIT_REST}/v5/market/kline", params=params)
        r.raise_for_status()
        data = r.json()
    candles = []
    for row in data.get("result", {}).get("list", []) or []:
        try:
            candles.append({"time": int(int(row[0]) / 1000), "open": float(row[1]), "high": float(row[2]), "low": float(row[3]), "close": float(row[4]), "volume": float(row[5])})
        except Exception:
            pass
    candles.sort(key=lambda x: x["time"])
    return candles, "Bybit candles"


async def fetch_okx_candles(symbol: str, interval: str, limit: int = 300) -> Tuple[List[dict], str]:
    inst_id = symbol_to_okx_swap(symbol)
    params = {"instId": inst_id, "bar": OKX_INTERVALS.get(str(interval), "1m"), "limit": str(min(max(limit, 1), 300))}
    async with httpx.AsyncClient(timeout=15.0, headers={"User-Agent": "WhaleX/1.1"}) as client:
        r = await client.get(f"{OKX_REST}/api/v5/market/candles", params=params)
        r.raise_for_status()
        data = r.json()
    candles = []
    for row in data.get("data", []) or []:
        try:
            candles.append({"time": int(int(row[0]) / 1000), "open": float(row[1]), "high": float(row[2]), "low": float(row[3]), "close": float(row[4]), "volume": float(row[5])})
        except Exception:
            pass
    candles.sort(key=lambda x: x["time"])
    return candles, f"OKX fallback candles ({inst_id})"


async def fetch_candles_with_fallback(symbol: str, interval: str, limit: int = 500) -> Tuple[List[dict], str, str | None]:
    errors = []
    try:
        candles, source = await fetch_bybit_candles(symbol, interval, limit)
        if candles:
            return candles, source, None
    except Exception as e:
        errors.append(f"Bybit history blocked/unavailable: {e}")
    try:
        candles, source = await fetch_okx_candles(symbol, interval, min(limit, 300))
        if candles:
            return candles, source, " | ".join(errors) if errors else None
    except Exception as e:
        errors.append(f"OKX fallback unavailable: {e}")
    return [], "none", " | ".join(errors) if errors else "No candle history returned"
