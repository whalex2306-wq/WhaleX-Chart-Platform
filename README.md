# WhaleX Chart Platform MVP v1.1

This version fixes missing candle history on Render by adding a fallback candle-history source.

## What changed

- Bybit REST candle history first.
- If Bybit REST is blocked with 403, fallback to OKX swap candle history.
- Live Bybit WebSocket candles/order book continue running.
- Dashboard shows candle source and liquidity source.
- Liquidity lines still come from Bybit order book.

## Deploy

Upload this full project over your existing `WhaleX-Chart-Platform` GitHub repo, commit, then Render → Manual Deploy → Deploy latest commit.
