# WhaleX Chart Platform v3.6 — Indicator Validation Fix

## What I checked

I reviewed the current indicator code flow and updated the parts that were still not behaving close enough to TradingView's indicator workflow.

## Fixed / Updated

### 1. Volume placement

Volume now renders in a dedicated bottom panel, not on the main price scale.

This prevents:
- candles getting compressed
- volume hiding price
- volume overlapping RSI badly

### 2. Multiple indicator placement

Volume and RSI use a dynamic stacked panel system.

If one indicator panel is active:
- price chart reserves smaller bottom space

If two panels are active:
- price chart reserves more bottom space
- Volume and RSI stack separately

### 3. Volume MA visibility

Volume MA is now drawn directly in the Volume panel.

Fixed:
- SMA/EMA/SMMA-RMA/WMA/VWMA line not visible
- large MA values like 500 not showing clearly

Added:
- partial MA option for Volume MA
- hint if MA length is larger than loaded candle history

### 4. More candle history

Default candle history request increased from 500 to 1000 where supported, so longer MA lengths like 500 have a better chance to plot.

### 5. RSI panel

RSI now uses the new stacked panel canvas, not the old overlay panel.

Added hints if RSI does not have enough candles to calculate.

### 6. Chart visible-range redraw

Indicator panels redraw when the visible chart range changes, so panning/zooming should keep panels aligned better.

## Still not claiming

This is closer, but I am still not claiming it is 100% TradingView identical.

Remaining TV-level refinements:
- draggable/resizable indicator panes
- exact TradingView pane scale labels on right side
- exact VWAP band/fill style
- exact RSI style/fill options
- exact Volume scale UX

## Validation checklist after deploy

1. Add Volume
2. Open Volume settings
3. Enable Volume MA
4. Try SMA 20
5. Try SMA 500
6. Add RSI also
7. Confirm Volume and RSI appear in separate panels
8. Remove RSI
9. Confirm Volume panel stays clean
10. Add MA overlay and VWAP, confirm they stay on price chart

## Syntax check

JavaScript syntax check: PASS



## Health check

Backend version patched: True

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:

Manual Deploy -> Clear build cache & deploy.

Then hard refresh:
- Mac: Cmd + Shift + R
- Windows: Ctrl + F5

Check `/health`; it must show version `3.6.0`.
