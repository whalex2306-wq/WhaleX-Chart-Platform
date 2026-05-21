# WhaleX Chart Platform v2.9 — Syntax Recovery + Resize Fix

## Why this build exists

v2.8 had a JavaScript syntax issue in `app.js` around the safe fit/reset functions: `Unexpected token catch`. This stopped the front-end script, so the chart stayed blank even though the page loaded.

## Fixed

- Removed the broken extra `catch` blocks
- JavaScript syntax validated with `node --check`
- Kept the v2.8 chart resize engine fix
- Kept `chart.resize(width, height, true)`
- Kept safe resize + fit cycles
- Kept TV on-chart logo hidden
- Kept WhaleX branding visible

## Shortcuts

- R = reset chart view
- F = fit/reset chart
- M = maximize
- E = edit drawings
- Esc = chart move mode
- Delete = delete selected drawing
- Ctrl/Cmd+Z = undo

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.9.0`.
