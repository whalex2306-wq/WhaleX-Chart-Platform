# WhaleX Chart Platform v3.4 — TV Indicator Settings Upgrade

## Main fix

The indicator settings were still too shallow, especially Volume.

v3.4 expands settings for every indicator currently added so the workflow is closer to TradingView's Inputs / Style / Visibility model.

## Volume upgraded

Inputs:
- Show volume
- Show Volume MA
- MA type: SMA / EMA / SMMA/RMA / WMA / VWMA
- MA length, default 20

Style:
- Up color
- Down color
- Opacity
- Volume MA color
- Volume MA width

Visibility:
- Visible on/off

## RSI upgraded

Inputs:
- RSI length
- Source
- Upper / Middle / Lower levels
- Show smoothing MA
- MA type: SMA / EMA / SMMA/RMA / WMA / VWMA
- MA length
- Bollinger Bands toggle
- BB StdDev

Style:
- RSI color
- MA color
- Level colors

Visibility:
- Visible on/off

## VWAP upgraded

Inputs:
- Source
- Anchor period: Session / Week / Month
- Offset
- Band calculation: Standard Deviation / Percentage
- Band 1/2/3 toggles and multipliers

Style:
- VWAP color
- VWAP width
- Band color
- Band width

Visibility:
- Visible on/off

## Moving Average upgraded

Inputs:
- Type: EMA / SMA / SMMA/RMA / WMA / VWMA
- Length, default 9
- Source
- Offset

Style:
- Color
- Width

Visibility:
- Visible on/off

## Kept

- TradingView-style indicator search/list
- Chart legend for added indicators
- Per-indicator settings button
- Show/hide/remove from legend
- Static cache busting:
  - app.js?v=3.4.0
  - styles.css?v=3.4.0

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:

Manual Deploy -> Clear build cache & deploy.

Then hard refresh:
- Mac: Cmd + Shift + R
- Windows: Ctrl + F5

Check `/health`; it must show version `3.4.0`.
