# WhaleX Chart Platform v2.13 — Tool Plot Activation Fix

## Why this build exists

v2.12 added drawing settings, but tool plotting could fail because the drawing canvas layer was not reliably switching mouse/pointer mode.

## Fixed

- Added clear app modes:
  - Move mode
  - Edit mode
  - Draw mode
- Drawing canvas is active only in Draw/Edit mode
- Normal chart pan/move stays active in Move mode
- Clicking a tool now shows a clear tooltip:
  - Drawing: fib (2 clicks)
  - Drawing: trend (2 clicks)
  - Drawing: hline (1 click)
  - Drawing: rr (3 clicks)
- After drawing completes, it automatically switches to Edit mode
- Added clearer toast messages while selecting points
- Kept v2.12 tool settings panel

## Tool click counts

- H-Line: 1 click
- Trendline: 2 clicks
- Ray: 2 clicks
- Rectangle: 2 clicks
- Fib: 2 clicks
- RR: 3 clicks

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.13.0`.
