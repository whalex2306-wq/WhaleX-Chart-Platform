# WhaleX Chart Platform v2.2 — TradingView UI + Real Drawing Overlay Tools

## Main change

The left info/settings panel has been removed. Best liquidity settings are hardcoded:

- Bucket: 100
- Minimum liquidity: 5M
- Max lines: 10
- Update speed: 750ms

## Added / improved

- TradingView-style top toolbar
- TradingView-style left drawing toolbar
- Chart type selector:
  - Candles
  - Heikin Ashi
  - Bars
  - Line
  - Area
- Real canvas overlay drawing tools:
  - Horizontal line
  - Trendline
  - Ray
  - Rectangle zone
  - Fib retracement
  - Risk/Reward box
- Drawings follow chart pan/zoom much better than v2 price-line-only tools
- Drawings save in browser localStorage per symbol
- Maximize mode hides right panel and bottom liquidity table
- WhaleX logo + watermark retained
- Existing OKX candle fallback retained
- Existing Bybit live liquidity retained

## Deploy

Upload this full project over your existing `WhaleX-Chart-Platform` GitHub repo, commit, then Render → Manual Deploy → Deploy latest commit.
