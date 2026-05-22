# WhaleX Chart Platform v2.22 — Forced RR One-Click

## Main fix

Long Position / Short Position is now forced to plot on the first pointer click.

This does not wait for the old multi-click drawing flow.

## Behavior

### Long Position
- Select Long Position
- Click once on chart
- Entry is placed exactly where clicked
- Target auto-created above Entry
- Stop auto-created below Entry
- Default RR = 1:1
- User can drag Entry / Target / Stop

### Short Position
- Select Short Position
- Click once on chart
- Entry is placed exactly where clicked
- Target auto-created below Entry
- Stop auto-created above Entry
- Default RR = 1:1
- User can drag Entry / Target / Stop

## Technical fix

- Long/Short now plot on `pointerdown` using capture mode
- A fallback click handler is also kept
- Old multi-click pending flow is bypassed for Long/Short
- Added robust chart coordinate fallback so clicking near future/blank chart area still creates the tool

## Kept

- Drag-any-tool behavior
- TV-style left toolbar flyout
- Draggable floating toolbar
- Tool templates
- Fib point A to Point B
- Full-height chart
- TV on-chart logo hidden
- WhaleX branding visible

## Test

1. Click RR/Forecasting icon.
2. Select Long Position.
3. Click once on the chart.
4. The position box must appear immediately.
5. Repeat with Short Position.

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.22.0`.
