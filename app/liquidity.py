from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Dict, List, Tuple


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

    def update(self, side: str, raw_lines: List[Tuple[float, float, int]], min_m: float, max_lines: int) -> List[LiquidityLine]:
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
                old.qty = qty
                old.liquidity_m = liquidity_m
                old.levels = levels
                old.last_seen = now
                line = old
            else:
                line = LiquidityLine(
                    side=side,
                    price=float(price),
                    qty=float(qty),
                    liquidity_m=float(liquidity_m),
                    levels=int(levels),
                    first_seen=now,
                    last_seen=now,
                    previous_liquidity_m=0.0,
                )
                self.lines[key] = line
            output.append(line)

        stale_cutoff = now - 20
        for key in list(self.lines.keys()):
            if self.lines[key].last_seen < stale_cutoff:
                del self.lines[key]

        output.sort(key=lambda l: l.liquidity_m, reverse=True)
        return output[:max_lines]


def bucket_orderbook(book: Dict[str, Dict[float, float]], bucket: float) -> Tuple[List[Tuple[float, float, int]], List[Tuple[float, float, int]]]:
    bucket = max(float(bucket), 0.01)

    def floor_bucket(price: float) -> float:
        return round((price // bucket) * bucket, 8)

    buckets = {"bid": {}, "ask": {}}
    counts = {"bid": {}, "ask": {}}

    for side in ("bid", "ask"):
        for price, qty in book.get(side, {}).items():
            if qty <= 0:
                continue
            b = floor_bucket(price)
            buckets[side][b] = buckets[side].get(b, 0.0) + qty
            counts[side][b] = counts[side].get(b, 0) + 1

    bid_lines = [(price, qty, counts["bid"].get(price, 0)) for price, qty in buckets["bid"].items()]
    ask_lines = [(price, qty, counts["ask"].get(price, 0)) for price, qty in buckets["ask"].items()]

    bid_lines.sort(key=lambda x: (x[0] * x[1]), reverse=True)
    ask_lines.sort(key=lambda x: (x[0] * x[1]), reverse=True)

    return bid_lines, ask_lines


def line_to_dict(line: LiquidityLine) -> dict:
    return {
        "side": line.side,
        "price": line.price,
        "qty": line.qty,
        "liquidity_m": line.liquidity_m,
        "levels": line.levels,
        "age_seconds": line.age_seconds,
        "behavior": line.behavior,
    }
