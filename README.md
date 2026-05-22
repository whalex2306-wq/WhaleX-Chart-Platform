# WhaleX Chart Platform v2.20 — RR 1:1 + Drag All Tools

## Main goal

Fix the Long/Short position tool behavior and make every plotted tool draggable like TradingView.

## Long / Short position behavior

### Long Position

- 1st click = Entry
- 2nd click = Target
- Stop is auto-created below Entry at equal distance
- Default RR = 1:1
- User can drag Entry / Target / Stop after placement

### Short Position

- 1st click = Entry
- 2nd click = Target
- Stop is auto-created above Entry at equal distance
- Default RR = 1:1
- User can drag Entry / Target / Stop after placement

## Drag behavior

In Edit mode:

- Click/drag anchors to resize/edit
- Click/drag the body of the plotted object to move the full tool
- Works for:
  - Fib
  - Trendline
  - Ray
  - Horizontal Line
  - Rectangle
  - Long Position
  - Short Position

## Kept

- v2.19 TV-style left toolbar flyout
- v2.18 draggable floating toolbar
- Quick style/template popovers
- Tool templates for all tools
- v2.16 Fib point A to Point B behavior
- Full-height stable chart
- TV on-chart logo hidden
- WhaleX branding visible
- OKX candle fallback
- Bybit live liquidity

## Test flow

1. Click RR/Forecasting icon on the left toolbar.
2. Select Long Position.
3. Click Entry, then Target.
4. Confirm Stop appears automatically at 1:1.
5. Press E and drag Entry / Target / Stop.
6. Drag the body of the position box to move the full tool.

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.20.0`.

## Syntax check

JavaScript syntax check: PASS


