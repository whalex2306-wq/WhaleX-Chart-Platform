
from pathlib import Path
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from .bybit_market import BybitMarketStream

APP_DIR = Path(__file__).resolve().parent
STATIC_DIR = APP_DIR / "static"

app = FastAPI(title="WhaleX Chart Platform", version="2.8.0")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
async def index():
    return FileResponse(STATIC_DIR / "index.html")

@app.get("/health")
async def health():
    return {"ok": True, "service": "whalex-chart-platform", "version": "2.8.0"}

@app.websocket("/ws/chart")
async def ws_chart(
    websocket: WebSocket,
    symbol: str = Query("BTCUSDT"),
    interval: str = Query("15"),
    bucket: float = Query(100.0),
    min_m: float = Query(5.0),
    max_lines: int = Query(10),
    publish_ms: int = Query(750),
):
    await websocket.accept()
    stream = BybitMarketStream(symbol=symbol, interval=interval, bucket=bucket, min_m=min_m, max_lines=max_lines, publish_ms=publish_ms)
    try:
        async for event in stream.stream():
            await websocket.send_json(event)
    except WebSocketDisconnect:
        return
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except Exception:
            pass
