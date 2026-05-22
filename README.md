# WhaleX Chart Platform v3.2 — Indicator Menu Cache/Event Fix

## Main fix

The Indicators button was still showing the old toast message:

`Indicator menu comes after drawing tools are stable`

That means either:
- old `app.js` was still cached in browser, or
- the indicator click event was not replaced correctly.

## Fixed in v3.2

- Removed the old toast handler completely
- Added `openIndicatorModal()` hard binding
- Added direct fallback click listener on `#indicatorBtn`
- Added cache-busting:
  - `app.js?v=3.2.0`
  - `styles.css?v=3.2.0`
- Added console stamp:
  - `WhaleX Chart Platform JS v3.2.0 loaded`
- Guaranteed Indicator modal exists in `index.html`

## Indicator menu remains TradingView-style configurable

Moving Average:
- Show / hide
- Type: EMA / SMA / WMA
- Length default 9, editable
- Source
- Color
- Width
- Add/delete MA rows

VWAP:
- Show / hide
- Source
- Color
- Width

RSI:
- Show / hide
- Length
- Source
- 70 / 50 / 30 editable levels
- Color

WhaleX:
- Show/hide liquidity lines
- Orderflow foundation placeholder

## Syntax check

JavaScript syntax check: PASS

Stale old toast string present: False



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:

Manual Deploy -> Clear build cache & deploy.

Then hard refresh the browser:
- Mac: Cmd + Shift + R
- Windows: Ctrl + F5

Check `/health`; it must show version `3.2.0`.
