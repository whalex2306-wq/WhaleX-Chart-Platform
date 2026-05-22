# WhaleX Chart Platform v3.7 — Indicator Scale / Auto / Scroll

## Main fix

Added TradingView-style indicator panel controls for the bottom indicator panes.

## Added to indicator panels

### 1. Right-side scale

Volume and RSI panels now have their own right-side scale area.

- Top / middle / bottom scale labels
- Latest-value badge
- Separate scaling from main price chart

### 2. Auto adjust

Each indicator panel now has:

- `A` button = Auto scale / Auto adjust
- `↺` button = Reset scale

Double-clicking the right-side panel scale also resets to auto.

### 3. Manual vertical scale

Inside Volume or RSI panel:

- Mouse wheel = zoom indicator scale
- Right-side scale drag = scroll/shift indicator values vertically
- Auto button turns active when panel is back in auto scale

### 4. Panel scroll

Inside Volume or RSI panel:

- Shift + mouse wheel = horizontal chart scroll
- Touchpad horizontal wheel = horizontal chart scroll

This keeps indicator panels synced with the candle chart visible range.

### 5. Multiple indicators

Volume and RSI remain in separate stacked panels and now both have their own scale controls.

## Kept from v3.6

- Volume panel
- Volume MA visible inside panel
- RSI panel
- Partial Volume MA for long lengths like SMA 500
- Indicator manager with Inputs / Style / Visibility
- MA / VWAP / RSI / Volume settings
- WhaleX Liquidity / Orderflow placeholders

## Test flow

1. Add Volume
2. Enable Volume MA 500
3. Use mouse wheel inside Volume panel to zoom scale
4. Drag the Volume panel right-side scale vertically
5. Click `A` to auto-adjust
6. Add RSI also
7. Repeat scale tests inside RSI panel
8. Use Shift + mouse wheel inside panel to scroll horizontally

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:

Manual Deploy -> Clear build cache & deploy.

Then hard refresh:
- Mac: Cmd + Shift + R
- Windows: Ctrl + F5

Check `/health`; it must show version `3.7.0`.
