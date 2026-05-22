# WhaleX Chart Platform v2.18 — Draggable Toolbar + Templates

## Main goal

Make the selected-drawing toolbar work more like TradingView.

## Added

### Draggable floating toolbar

- Toolbar now has a drag handle: `⋮⋮`
- Drag the toolbar anywhere over the chart
- Position is saved per symbol in browser localStorage
- Toolbar no longer stays force-fixed near the object once dragged

### Toolbar actions for all tools

Available for Fib, Trendline, Ray, H-Line, Rectangle and RR:

- Settings
- Templates
- Style
- Width
- Lock / unlock
- Hide / show
- Clone
- Delete
- Move mode

### Quick Style popover

From the toolbar:

- Color
- Width
- Line style
- Labels on/off
- More settings

### Quick Template popover

From the toolbar:

- Save current style as template
- Apply saved template
- Set template as default
- Delete template

This works per tool type:
- Fib templates
- TL templates
- Ray templates
- H-Line templates
- Rectangle templates
- RR templates

## Kept

- v2.17 drawing behavior polish
- v2.16 Fib point A to B behavior
- Tool templates from settings panel
- Full-height stable chart
- TV on-chart logo hidden
- WhaleX branding visible
- OKX candle fallback
- Bybit live liquidity

## Suggested test flow

1. Draw Fib.
2. Press E and select Fib.
3. Drag the floating toolbar using the `⋮⋮` handle.
4. Click Templates from the toolbar.
5. Save current Fib as a template.
6. Set it as default.
7. Draw a new Fib and confirm it uses the saved default.

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.18.0`.
