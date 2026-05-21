# WhaleX Chart Platform v2.11 — Flex Layout Fix

## Why this build exists

The previous versions still showed the chart only in the top part of the screen. The root cause was CSS grid row sizing fighting the chart library resize timing.

## Fixed properly

- Replaced the chart workspace sizing with a flex layout override
- Chart area now fills the complete available screen height
- Chart shell is `flex: 1` and takes remaining height
- Chart/canvas are absolute full-size inside the shell
- Resize logic now reads the final chart shell bounding box
- Added repeated reset/resize after page load
- JavaScript syntax validated

## Kept

- TV on-chart logo hidden
- WhaleX branding visible
- Chart move/pan mode by default
- Edit drawings mode
- Liquidity lines
- OKX candle fallback
- Bybit live liquidity
- Drawing tools

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.11.0`.
