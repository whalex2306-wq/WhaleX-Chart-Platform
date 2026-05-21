# WhaleX Chart Platform v2.8 — Chart Resize Engine Fix

## Why this build exists

v2.7 still showed a blank/shifted chart in some browser sessions. The issue is the chart canvas size was not being updated correctly because the app used `applyOptions({width,height})` for resizing. Lightweight Charts needs `chart.resize(width, height)` for reliable canvas resizing.

## Fixed

- Replaced chart dimension updates with `chart.resize(width, height, true)`
- Kept fallback to `applyOptions` only if resize is unavailable
- Added stronger safe resize + fit cycles
- Added visible logical range fallback after candle history loads
- Improved deterministic chart/canvas minimum height
- Kept TV on-chart logo hidden
- Kept WhaleX branding visible

## Shortcuts

- R = reset chart view
- F = fit/reset
- M = maximize
- E = edit drawings
- Esc = chart move mode
- Delete = delete selected drawing
- Ctrl/Cmd+Z = undo

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.8.0`.
