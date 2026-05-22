from __future__ import annotations
import time
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional

@dataclass
class LiquidityLine:
    side: str
    price: float
    qty: float
    liquidity_m: float
    levels: int
    first_seen: float
    last_seen: float
    previous_liquidity_m: float = 0.0
    distance_pct: float = 0.0
    zone: str = "near"
    strength: str = "Weak"
    rank_score: float = 0.0

    @property
    def age_seconds(self) -> int:
        return max(0, int(time.time() - self.first_seen))

    @property
    def behavior(self) -> str:
        age = self.age_seconds
        if age < 20:
            return "New"
        if self.previous_liquidity_m <= 0:
            return "Holding"
        change_pct = ((self.liquidity_m - self.previous_liquidity_m) / self.previous_liquidity_m) * 100.0
        if change_pct >= 15:
            return "Building"
        if change_pct <= -15:
            return "Fading"
        if age >= 180:
            return "Persistent"
        return "Holding"

class LiquidityMemory:
    def __init__(self) -> None:
        self.lines: Dict[Tuple[str, float], LiquidityLine] = {}

    def _enrich(self, line: LiquidityLine, mid: Optional[float]) -> LiquidityLine:
        if mid and mid > 0:
            line.distance_pct = abs(line.price - mid) / mid * 100.0
        else:
            line.distance_pct = 0.0

        if line.distance_pct < 0.35:
            line.zone = "near"
        elif line.distance_pct < 1.25:
            line.zone = "mid"
        elif line.distance_pct < 4.0:
            line.zone = "far"
        else:
            line.zone = "extreme"

        if line.liquidity_m >= 50:
            line.strength = "Strong"
        elif line.liquidity_m >= 20:
            line.strength = "Medium"
        else:
            line.strength = "Weak"

        age_boost = min(line.age_seconds, 600) / 600.0
        distance_boost = min(line.distance_pct, 6.0) / 6.0
        strength_mult = 1.5 if line.strength == "Strong" else 1.15 if line.strength == "Medium" else 1.0
        line.rank_score = line.liquidity_m * strength_mult * (1.0 + distance_boost * 0.35 + age_boost * 0.15)
        return line

    def _select_balanced(self, lines: List[LiquidityLine], max_lines: int) -> List[LiquidityLine]:
        max_lines = max(1, int(max_lines))
        selected: Dict[Tuple[str, float], LiquidityLine] = {}

        def add_many(rows: List[LiquidityLine], limit: int):
            for line in rows:
                if len(selected) >= max_lines:
                    return
                selected[(line.side, line.price)] = line
                if len(selected) >= max_lines:
                    return

        strongest = sorted(lines, key=lambda x: (x.liquidity_m, x.rank_score), reverse=True)
        near = sorted([x for x in lines if x.zone == "near"], key=lambda x: x.liquidity_m, reverse=True)
        mid = sorted([x for x in lines if x.zone == "mid"], key=lambda x: x.rank_score, reverse=True)
        far = sorted([x for x in lines if x.zone in ("far", "extreme")], key=lambda x: (x.rank_score, x.distance_pct), reverse=True)

        # Balanced selection: don't let only near levels consume the whole list.
        add_many(strongest, max(4, max_lines // 3))
        add_many(far, max(6, max_lines // 2))
        add_many(mid, max(4, max_lines // 3))
        add_many(near, max_lines)
        add_many(strongest, max_lines)

        out = list(selected.values())
        # For bids show higher prices first; for asks show lower prices first. This makes the table/chart easier.
        if out and out[0].side == "bid":
            out.sort(key=lambda x: (-x.price, -x.liquidity_m))
        else:
            out.sort(key=lambda x: (x.price, -x.liquidity_m))
        return out[:max_lines]

    def update(
        self,
        side: str,
        raw_lines: List[Tuple[float, float, int]],
        min_m: float,
        max_lines: int,
        mid: Optional[float] = None,
        stale_seconds: int = 120
    ) -> List[LiquidityLine]:
        now = time.time()
        output: List[LiquidityLine] = []

        for price, qty, levels in raw_lines:
            liquidity_m = (price * qty) / 1_000_000.0
            if liquidity_m < min_m:
                continue

            key = (side, float(price))
            if key in self.lines:
                old = self.lines[key]
                old.previous_liquidity_m = old.liquidity_m
                old.qty = float(qty)
                old.liquidity_m = float(liquidity_m)
                old.levels = int(levels)
                old.last_seen = now
                line = old
            else:
                line = LiquidityLine(side, float(price), float(qty), float(liquidity_m), int(levels), now, now)
                self.lines[key] = line

            output.append(self._enrich(line, mid))

        stale_cutoff = now - max(20, int(stale_seconds))
        for key in list(self.lines.keys()):
            if self.lines[key].last_seen < stale_cutoff:
                del self.lines[key]

        # Keep memory lines that are still recent, so far levels don't vanish on a short feed gap.
        for line in self.lines.values():
            if line.side == side and line.last_seen >= stale_cutoff and line.liquidity_m >= min_m:
                enriched = self._enrich(line, mid)
                if enriched not in output:
                    output.append(enriched)

        return self._select_balanced(output, max_lines)

def bucket_orderbook(book: Dict[str, Dict[float, float]], bucket: float):
    bucket = max(float(bucket), 0.01)

    def bucket_price(price: float, side: str) -> float:
        # Bids should group downward, asks should group upward so lines sit outside/at liquidity.
        if side == "ask":
            return round(((price + bucket - 1e-9) // bucket) * bucket, 8)
        return round((price // bucket) * bucket, 8)

    buckets = {"bid": {}, "ask": {}}
    counts = {"bid": {}, "ask": {}}

    for side in ("bid", "ask"):
        for price, qty in book.get(side, {}).items():
            if qty <= 0:
                continue
            b = bucket_price(float(price), side)
            buckets[side][b] = buckets[side].get(b, 0.0) + float(qty)
            counts[side][b] = counts[side].get(b, 0) + 1

    bids = [(p, q, counts["bid"].get(p, 0)) for p, q in buckets["bid"].items()]
    asks = [(p, q, counts["ask"].get(p, 0)) for p, q in buckets["ask"].items()]
    bids.sort(key=lambda x: x[0] * x[1], reverse=True)
    asks.sort(key=lambda x: x[0] * x[1], reverse=True)
    return bids, asks

def split_far(lines: List[LiquidityLine]) -> List[LiquidityLine]:
    return [x for x in lines if x.zone in ("far", "extreme")]

def line_to_dict(line: LiquidityLine) -> dict:
    return {
        "side": line.side,
        "price": line.price,
        "qty": line.qty,
        "liquidity_m": line.liquidity_m,
        "levels": line.levels,
        "age_seconds": line.age_seconds,
        "behavior": line.behavior,
        "distance_pct": line.distance_pct,
        "zone": line.zone,
        "strength": line.strength,
        "rank_score": line.rank_score,
    }
