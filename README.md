# WhaleX Chart Platform v2.7 — Chart Render + Fit Fix

## Why this build exists

v2.6 removed the on-chart TV logo, but on some browser/session sizes the chart could render only at the top strip or look blank because the chart was initialized before the final container size was stable.

## Fixed

- Robust chart resize after layout loads
- ResizeObserver added for chart container
- Safe delayed resize + fit after candle history loads
- Reset view shortcut added:
  - R = reset chart view
  - F = fit/reset chart
- Chart container height/width made deterministic
- Canvas overlay remains pass-through in normal chart move mode
- TV on-chart logo remains hidden
- WhaleX branding remains visible

## Kept from v2.6

- Chart pan/drag works by default
- Hand = move mode
- Arrow = edit drawings
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
  - F = fit/reset
  - R = reset view
- OKX candle fallback
- Bybit live liquidity
- WhaleX logo/watermark

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.7.0`.
