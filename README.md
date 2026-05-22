# WhaleX Chart Platform v3.3 — TV-Style Indicator Manager

## Main fix

The previous indicator panel looked poor and behaved like one big settings form.

v3.3 changes the workflow to be closer to TradingView:

1. Indicators button opens a compact search/list window.
2. User adds indicators from the list.
3. Added indicators appear as a small chart legend.
4. Each added indicator has:
   - show/hide
   - settings
   - remove
5. Settings open separately with tabs:
   - Inputs
   - Style
   - Visibility

## Indicator library

Current active indicators:

- Moving Average
- VWAP
- Volume
- RSI
- WhaleX Liquidity Lines
- WhaleX Orderflow Foundation placeholder

## Moving Average settings

Inputs:
- Type: EMA / SMA / WMA
- Length, default 9
- Source: close/open/high/low/HL2/HLC3/OHLC4

Style:
- Color
- Line width

Visibility:
- Visible on/off

## VWAP settings

Inputs:
- Source
- Anchor placeholder

Style:
- Color
- Line width

Visibility:
- Visible on/off

## RSI settings

Inputs:
- Length
- Source
- Upper / Middle / Lower levels

Style:
- Color

Visibility:
- Visible on/off

## Volume

Volume is now on a separate hidden price scale so it should not destroy the main price scale.

## Cache

Static files are cache-busted:
- app.js?v=3.3.0
- styles.css?v=3.3.0

## Syntax check

JavaScript syntax check: PASS

Stale old indicator toast present: False



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:

Manual Deploy -> Clear build cache & deploy.

Then hard refresh:
- Mac: Cmd + Shift + R
- Windows: Ctrl + F5

Check `/health`; it must show version `3.3.0`.
