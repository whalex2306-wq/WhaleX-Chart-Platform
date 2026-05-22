# WhaleX Chart Platform v2.15 — Tool Templates

## Main goal

Allow users to save their own templates for each drawing tool, like a TradingView-style workflow.

## Added

### Per-tool templates

Templates are saved separately for each tool:

- Fib
- Trendline
- Ray
- Horizontal Line
- Rectangle
- Risk/Reward

### Template actions

Inside Drawing Settings:

- Save Current
- Apply Template
- Set Default
- Delete Template

### Default templates

If a user sets a template as default for a tool:

- New Fib drawings use default Fib template
- New TL drawings use default TL template
- New RR drawings use default RR template
- etc.

### Storage

Templates are saved in browser localStorage, so they survive refresh on the same browser/device.

## Kept

- v2.14 TV-style Fib full settings
- v2.13 tool plotting activation fix
- Full-height stable chart
- TV on-chart logo hidden
- WhaleX branding visible
- OKX candle fallback
- Bybit live liquidity

## Syntax check

JavaScript syntax check: PASS



## Deploy

Upload all files over the existing GitHub repo, commit, then Render:
Manual Deploy -> Clear build cache & deploy.

Check `/health`; it must show version `2.15.0`.
