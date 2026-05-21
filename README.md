# WhaleX Chart Platform v2.10 — Full Height Chart Fix

## Why this build exists

The previous build rendered the chart only in the upper half of the page. The issue was CSS/grid sizing: the chart shell had `height:auto` with absolutely positioned chart content, so it did not stretch to the full remaining workspace height.

## Fixed

- Chart now uses full available workspace height
- Chart grid rows changed to `minmax(0, 1fr)`
- Workspace and chart area use stable full-height CSS grid
- Chart shell now stretches with `height: calc(100% - 12px)`
- Resize logic now reads `clientWidth/clientHeight`
- ResizeObserver watches the chart shell and chart area
- `chart.resize(width, height, true)` retained
- TV on-chart logo remains hidden
- WhaleX branding remains visible

## Kept

- Chart move/pan mode by default
- Edit drawings mode
- Horizontal line / Trendline / Ray / Rectangle / Fib / RR
- OKX candle fallback
- Bybit live liquidity
- Shortcuts:
  - R / F = reset-fit
  - E = edit drawings
  - Esc = move mode
  - M = maximize
  - Delete = delete selected
  - Ctrl/Cmd+Z = undo

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.10.0`.
