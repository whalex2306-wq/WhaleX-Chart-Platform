# WhaleX Chart Platform v2.5 — Chart Move Fix

## Why this build exists

In v2.4 the canvas drawing layer was always capturing mouse events, so the chart could feel fixed and dragging/panning stopped working.

## Fixed

- Chart pan/drag works again by default
- Canvas overlay is pass-through in normal chart move mode
- Drawing overlay only captures mouse when:
  - a drawing tool is active, or
  - Select/Edit mode is active
- Added separate tools:
  - Hand = Chart move / pan mode
  - Arrow = Select / edit drawing mode
- Added shortcut:
  - E = Select/Edit drawings
  - Esc = back to chart move mode

## Kept from v2.4

- Compact TradingView-style workflow
- Max mode
- Right panel hidden by default
- Bottom table hidden by default
- Drawing object tree
- Lock / hide / clone / delete
- OKX candle fallback
- Bybit live liquidity lines
- WhaleX logo/watermark

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.5.0`.
