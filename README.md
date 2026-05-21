# WhaleX Chart Platform MVP v1

First standalone WhaleX chart platform build.

## Included
- Live Bybit USDT perpetual candles
- Live Bybit order-book liquidity lines
- Exact price-level plotting on our own chart
- Liquidity age/persistence
- Behavior tags: New, Holding, Building, Fading, Persistent
- Bid/ask liquidity tables

## Run locally
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./run.sh
```
Open http://127.0.0.1:8000

## Deploy on Render
Upload to GitHub, then Render → New Web Service → Runtime Docker → Deploy.

## Important
This MVP does not run Pine Script. WhaleX indicators must be rebuilt natively over time: Orderflow zones, OI Delta, POC/LVN, TOP/BOTTOM signals, trendlines and Fib tools.
