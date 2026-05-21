# WhaleX Chart Platform v2.6 — WhaleX Brand / No On-Chart TV Logo

## Main change

- Disabled the on-chart TradingView attribution logo from the Lightweight Charts renderer using `layout.attributionLogo = false`.
- Added a small attribution note inside settings/about text instead of showing the TV mark on the chart.
- Kept WhaleX logo/watermark as the visible chart branding.

## Important

This is for Lightweight Charts only. TradingView Advanced Charts free usage requires TradingView attribution to remain visible unless a separate license allows otherwise.

## Kept from v2.5

- Chart pan/drag works by default
- Separate move mode and edit mode
- Drawing tools:
  - Horizontal line
  - Trendline
  - Ray
  - Rectangle
  - Fib
  - Risk/Reward
- Shortcuts:
  - E = edit drawings
  - Esc = move mode
  - Delete = delete selected drawing
  - Ctrl/Cmd+Z = undo
  - M = maximize
  - F = fit chart
- OKX candle fallback
- Bybit live liquidity
- WhaleX chart UI and watermark

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.6.0`.
