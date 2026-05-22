# WhaleX Chart Platform v3.9 — Estimated Liquidation Map v1

## Why this build

We cannot fully replicate Coinglass without their liquidation-map data, but this starts the WhaleX own estimated model.

Target accuracy:
- Initial: around 2.5 / 5
- After comparing with Coinglass screenshots and tuning: maybe 3.5 / 5

## Data used

The model estimates liquidation clusters using:

- recent candles
- volume distribution
- Bybit funding rate when available
- Bybit open interest value when available
- leverage assumptions: 5x / 10x / 25x / 50x / 100x

## Output

New layer:

- Estimated Long Liquidations below current price
- Estimated Short Liquidations above current price

Ranges:

- 24H
- 7D
- 30D

Each estimated line includes:

- price
- estimated liquidity value
- range
- leverage hint
- distance %
- confidence score

## UI

Chart Settings now includes:

- Show estimated liquidation map
- Estimated liquidation range: 24H / 7D / 30D
- Auto-fit estimated liquidation levels

## Important

This is not Coinglass data.

It is a WhaleX estimated model. Later, when budget allows, we can add CoinGlass/Hyblock API and compare/merge with this model.

## Validation

- main.py: PASS Spreadsheet runtime warmup failed during python startup
Traceback (most recent call last):
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/patches/warm_spreadsheet_runtime_on_startup.py", line 26, in warm_spreadsheet_runtime_on_startup
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 785, in warm_spreadsheet_runtime
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 720, in _warm_feature_flow
- liquidity.py: PASS Spreadsheet runtime warmup failed during python startup
Traceback (most recent call last):
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/patches/warm_spreadsheet_runtime_on_startup.py", line 26, in warm_spreadsheet_runtime_on_startup
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 785, in warm_spreadsheet_runtime
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 720, in _warm_feature_flow
- bybit_market.py: PASS Spreadsheet runtime warmup failed during python startup
Traceback (most recent call last):
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/patches/warm_spreadsheet_runtime_on_startup.py", line 26, in warm_spreadsheet_runtime_on_startup
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 785, in warm_spreadsheet_runtime
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 720, in _warm_feature_flow
- estimated_liquidation.py: PASS Spreadsheet runtime warmup failed during python startup
Traceback (most recent call last):
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/patches/warm_spreadsheet_runtime_on_startup.py", line 26, in warm_spreadsheet_runtime_on_startup
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 785, in warm_spreadsheet_runtime
  File "/tmp/tmp.9eeVjt35CN/artifact_tool_v2-2.7.5/artifact_tool/spreadsheet_warmup.py", line 720, in _warm_feature_flow
- app.js: PASS 

## Deploy

Upload all files over the existing GitHub repo, commit, then Render:

Manual Deploy -> Clear build cache & deploy.

Then hard refresh:
- Mac: Cmd + Shift + R
- Windows: Ctrl + F5

Check `/health`; it must show version `3.9.0`.

## Test

1. Open Settings.
2. Turn ON `Show estimated liquidation map`.
3. Select 24H.
4. Check orange SHORT LIQ levels above price.
5. Check cyan LONG LIQ levels below price.
6. Switch 7D and 30D and compare with Coinglass manually.
