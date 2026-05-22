# WhaleX Chart Platform v2.17 — Drawing Behavior Polish

## Main goal

Polish the drawing workflow before moving to indicators/orderflow.

## Added / improved

### Selection behavior
- Floating selected-object toolbar now follows the selected drawing instead of staying fixed.
- Double-click any drawing in Edit mode to open its Settings.
- Better selected drawing bounds handling.
- Drag cursor feedback while moving/editing drawings.

### Settings behavior
- Settings now apply live as you change inputs.
- Color, width, style, labels, Fib levels, RR labels update without repeatedly pressing Apply.
- Apply button remains available as a manual confirmation option.

### Risk/Reward polish
- RR labels now show Long/Short mode in the Entry label.
- TP/SL/RR labels are cleaner.

### Kept from v2.16
- Fib plots only from Point A to Point B by default.
- No “TV Defaults” button.
- Tool templates remain available.
- Full Fib level list remains available.
- Tool plotting fix remains.
- Full-height chart remains stable.
- TV on-chart logo remains hidden.
- WhaleX branding remains visible.
- OKX candle fallback and Bybit live liquidity remain.

## Suggested test flow

1. Draw Fib.
2. Press E.
3. Click Fib.
4. Double-click Fib or click Settings.
5. Change color/levels/labels.
6. Confirm changes apply live.
7. Save as template and set default.

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.17.0`.
