from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
import math, time

LEVERAGE_WEIGHTS = [
    (5, 0.08),
    (10, 0.16),
    (25, 0.30),
    (50, 0.28),
    (100, 0.18),
]

RANGES = {
    "24H": 24,
    "7D": 24 * 7,
    "30D": 24 * 30,
}

@dataclass
class EstimatedCluster:
    side: str
    price: float
    estimated_m: float
    distance_pct: float
    leverage_hint: str
    strength: str
    confidence: float
    range_key: str
    sources: int

def _candle_price(c: dict) -> float:
    return (float(c.get("high", 0)) + float(c.get("low", 0)) + float(c.get("close", 0))) / 3.0

def _round_bucket(price: float, mid: float) -> float:
    if mid <= 0:
        return round(price, 2)
    # BTC-like: around 0.10% bucket, rounded to a clean step.
    raw = max(1.0, mid * 0.001)
    if raw >= 100:
        step = 100.0
    elif raw >= 50:
        step = 50.0
    elif raw >= 10:
        step = 10.0
    elif raw >= 1:
        step = 1.0
    else:
        step = 0.1
    return round(round(price / step) * step, 8)

def _strength(v: float) -> str:
    if v >= 80:
        return "Strong"
    if v >= 30:
        return "Medium"
    return "Weak"

def _confidence(v: float, sources: int, hours_loaded: float, range_hours: float) -> float:
    data_score = min(1.0, hours_loaded / max(1.0, range_hours))
    source_score = min(1.0, sources / 12.0)
    value_score = min(1.0, math.log10(max(1.0, v)) / 2.2)
    return round(max(0.05, min(0.95, 0.35 * data_score + 0.35 * source_score + 0.30 * value_score)), 2)

class EstimatedLiquidationModel:
    """
    WhaleX Estimated Liquidation Map v1.

    This is NOT Coinglass data. It estimates liquidation clusters using:
    - recent candle price/volume distribution
    - open interest value when available
    - funding bias
    - leverage assumption weights
    """

    def __init__(self) -> None:
        self.updated_ms = 0

    def build(
        self,
        candles: List[dict],
        mid: Optional[float],
        funding_rate: Optional[float] = None,
        oi_value_m: Optional[float] = None,
    ) -> dict:
        now = int(time.time())
        mid = float(mid or 0)
        if not candles or mid <= 0:
            return {
                "source": "WhaleX estimated model v1",
                "ready": False,
                "reason": "missing candles or mid price",
                "ranges": {},
            }

        rows = [c for c in candles if c.get("time") and c.get("close")]
        rows.sort(key=lambda x: int(x["time"]))
        if not rows:
            return {"source": "WhaleX estimated model v1", "ready": False, "reason": "no candle rows", "ranges": {}}

        latest_t = int(rows[-1]["time"])
        earliest_t = int(rows[0]["time"])
        hours_loaded = max(0.01, (latest_t - earliest_t) / 3600.0)

        # OI value can be unavailable. Fallback to volume-derived proxy.
        total_usd_vol_m = sum((_candle_price(c) * float(c.get("volume", 0) or 0)) for c in rows) / 1_000_000.0
        oi_proxy_m = float(oi_value_m or 0)
        if oi_proxy_m <= 0:
            # Keep proxy conservative, otherwise lines become fantasy-sized.
            oi_proxy_m = max(50.0, min(2500.0, total_usd_vol_m * 0.08))

        funding = float(funding_rate or 0.0)
        # Positive funding normally means long crowding; negative means short crowding.
        funding_bias = max(-0.35, min(0.35, funding * 1500.0))
        long_bias = 1.0 + max(0.0, funding_bias)
        short_bias = 1.0 + max(0.0, -funding_bias)

        ranges: Dict[str, dict] = {}
        for range_key, range_hours in RANGES.items():
            cutoff = latest_t - int(range_hours * 3600)
            window = [c for c in rows if int(c["time"]) >= cutoff]
            if not window:
                window = rows

            long_map: Dict[float, dict] = {}
            short_map: Dict[float, dict] = {}
            window_vol = sum(float(c.get("volume", 0) or 0) for c in window) or 1.0

            # Estimate how much OI to distribute into this range.
            # Shorter ranges are more immediate; longer ranges are broader but diluted.
            range_factor = 0.44 if range_key == "24H" else 0.74 if range_key == "7D" else 1.0
            distributable_m = oi_proxy_m * range_factor

            for c in window:
                entry = _candle_price(c)
                if entry <= 0:
                    continue

                vol = float(c.get("volume", 0) or 0)
                vol_share = vol / window_vol

                age_h = max(0.0, (latest_t - int(c["time"])) / 3600.0)
                decay = math.exp(-age_h / max(6.0, range_hours * 0.55))

                body = abs(float(c.get("close", 0)) - float(c.get("open", 0)))
                rng = max(0.0001, float(c.get("high", 0)) - float(c.get("low", 0)))
                impulse = 0.75 + min(0.65, body / rng)

                green = float(c.get("close", 0)) >= float(c.get("open", 0))
                # Green candles imply more late longs that can be liquidated below.
                # Red candles imply more late shorts that can be liquidated above.
                candle_long_bias = 1.16 if green else 0.92
                candle_short_bias = 1.16 if not green else 0.92

                base_m = distributable_m * vol_share * decay * impulse

                for lev, lev_w in LEVERAGE_WEIGHTS:
                    # Simplified liquidation distance.
                    # 0.90/leverage keeps levels a little inside theoretical max-loss zone.
                    liq_long = entry * (1.0 - 0.90 / lev)
                    liq_short = entry * (1.0 + 0.90 / lev)

                    long_weight = base_m * lev_w * long_bias * candle_long_bias
                    short_weight = base_m * lev_w * short_bias * candle_short_bias

                    # Only keep levels on the correct side of current price.
                    if liq_long < mid:
                        b = _round_bucket(liq_long, mid)
                        row = long_map.setdefault(b, {"estimated_m": 0.0, "sources": 0, "lev": {}})
                        row["estimated_m"] += long_weight
                        row["sources"] += 1
                        row["lev"][lev] = row["lev"].get(lev, 0.0) + long_weight

                    if liq_short > mid:
                        b = _round_bucket(liq_short, mid)
                        row = short_map.setdefault(b, {"estimated_m": 0.0, "sources": 0, "lev": {}})
                        row["estimated_m"] += short_weight
                        row["sources"] += 1
                        row["lev"][lev] = row["lev"].get(lev, 0.0) + short_weight

            def convert(side: str, mp: Dict[float, dict]) -> List[dict]:
                out: List[EstimatedCluster] = []
                for price, data in mp.items():
                    est = float(data["estimated_m"])
                    if est <= 1.0:
                        continue
                    dist = abs(price - mid) / mid * 100.0
                    if dist > 30:
                        continue
                    lev_items = sorted(data["lev"].items(), key=lambda x: x[1], reverse=True)
                    lev_hint = f"{lev_items[0][0]}x" if lev_items else "mixed"
                    conf = _confidence(est, int(data["sources"]), min(hours_loaded, range_hours), range_hours)
                    out.append(EstimatedCluster(
                        side=side,
                        price=float(price),
                        estimated_m=round(est, 2),
                        distance_pct=round(dist, 2),
                        leverage_hint=lev_hint,
                        strength=_strength(est),
                        confidence=conf,
                        range_key=range_key,
                        sources=int(data["sources"]),
                    ))

                out.sort(key=lambda x: (x.estimated_m * (1 + min(x.distance_pct, 12) / 20.0), x.confidence), reverse=True)
                return [x.__dict__ for x in out[:16]]

            ranges[range_key] = {
                "range_hours": range_hours,
                "hours_loaded": round(min(hours_loaded, range_hours), 2),
                "long_liq": convert("long_liq", long_map),   # below price
                "short_liq": convert("short_liq", short_map), # above price
            }

        return {
            "source": "WhaleX estimated model v1",
            "ready": True,
            "updated_ms": int(time.time() * 1000),
            "mid": mid,
            "funding_rate": funding,
            "oi_value_m": round(oi_proxy_m, 2),
            "oi_source": "Bybit ticker openInterestValue" if oi_value_m else "volume proxy",
            "model_accuracy_target": "2.5/5 initial; tune against Coinglass screenshots",
            "ranges": ranges,
        }
