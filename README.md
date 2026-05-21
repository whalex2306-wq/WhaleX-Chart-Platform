# WhaleX Chart Platform v2.12 — TV-Style Tool Settings Engine

## Main goal

Start matching the TradingView-style workflow for drawing tool settings, without copying TradingView private code or branding.

## Added in v2.12

### Selected-object toolbar
- Delete
- Lock / unlock
- Hide / show
- Clone
- Settings

### Settings modal
Tabs:
- Style
- Text / Labels
- Coordinates

### Fib settings
- Level controls
- Enable/disable individual levels
- Level values
- Level labels
- Level colors
- Line color
- Line width
- Line style
- Background fill
- Fill opacity
- Extend lines
- Label side
- Show/hide labels

### Trendline / Ray settings
- Color
- Width
- Style: solid / dashed / dotted
- Extend left
- Extend right
- Show labels

### Horizontal line settings
- Color
- Width
- Style
- Show labels / price

### Rectangle settings
- Border color
- Fill color
- Fill opacity
- Width
- Style

### Risk/Reward settings
- Long / short mode placeholder
- Profit color
- Loss color
- Fill opacity
- Show RR
- Account size
- Risk %

## Kept stable from v2.11

- Full-height chart layout
- TV on-chart logo hidden
- WhaleX branding
- Chart move/pan by default
- Edit drawings mode
- OKX candle fallback
- Bybit live liquidity lines

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.12.0`.
