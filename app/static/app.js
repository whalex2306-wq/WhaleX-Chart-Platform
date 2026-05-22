console.log("WhaleX Chart Platform JS v3.4.0 loaded");

const HARD = { bucket: 100, minM: 5, maxLines: 10, publishMs: 750 };

const els = {
  shell: document.getElementById("shell"),
  workspace: document.getElementById("workspace") || document.querySelector(".workspace"),
  chartArea: document.getElementById("chartArea") || document.querySelector(".chart-area"),
  symbol: document.getElementById("symbol"),
  statusDot: document.getElementById("statusDot"),
  chartType: document.getElementById("chartType"),
  indicatorBtn: document.getElementById("indicatorBtn"),
  alertBtn: document.getElementById("alertBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  closeSettings: document.getElementById("closeSettings"),
  showBids: document.getElementById("showBids"),
  showAsks: document.getElementById("showAsks"),
  showWatermark: document.getElementById("showWatermark"),
  showBottomPanel: document.getElementById("showBottomPanel"),
  showRightPanel: document.getElementById("showRightPanel"),
  showTitleRow: document.getElementById("showTitleRow"),
  watermark: document.getElementById("watermark"),
  bottomPanel: document.getElementById("bottomPanel"),
  rightPanel: document.getElementById("rightPanel"),
  connectBtn: document.getElementById("connectBtn"),
  fitBtn: document.getElementById("fitBtn"),
  maxBtn: document.getElementById("maxBtn"),
  panelBtn: document.getElementById("panelBtn"),
  cursorBtn: document.getElementById("cursorBtn"),
  editBtn: document.getElementById("editBtn"),
  hlineBtn: document.getElementById("hlineBtn"),
  trendBtn: document.getElementById("trendBtn"),
  rayBtn: document.getElementById("rayBtn"),
  rectBtn: document.getElementById("rectBtn"),
  fibBtn: document.getElementById("fibBtn"),
  rrBtn: document.getElementById("rrBtn"),
  leftToolFlyout: document.getElementById("leftToolFlyout"),
  longPosBtn: document.getElementById("longPosBtn"),
  shortPosBtn: document.getElementById("shortPosBtn"),
  undoBtn: document.getElementById("undoBtn"),
  deleteBtn: document.getElementById("deleteBtn"),
  titleRow: document.getElementById("titleRow"),
  status: document.getElementById("status"),
  historySource: document.getElementById("historySource"),
  liqSource: document.getElementById("liqSource"),
  mid: document.getElementById("mid"),
  bestBid: document.getElementById("bestBid"),
  bestAsk: document.getElementById("bestAsk"),
  title: document.getElementById("title"),
  subtitle: document.getElementById("subtitle"),
  bidRows: document.getElementById("bidRows"),
  askRows: document.getElementById("askRows"),
  objectTree: document.getElementById("objectTree"),
  oVal: document.getElementById("oVal"),
  hVal: document.getElementById("hVal"),
  lVal: document.getElementById("lVal"),
  cVal: document.getElementById("cVal"),
  vVal: document.getElementById("vVal"),
  toast: document.getElementById("toast"),
  indicatorModal: document.getElementById("indicatorModal"),
  closeIndicatorModal: document.getElementById("closeIndicatorModal"),
  applyIndicatorsBtn: document.getElementById("applyIndicatorsBtn"),
  clearIndicatorsBtn: document.getElementById("clearIndicatorsBtn"),
  maRows: document.getElementById("maRows"),
  addMARowBtn: document.getElementById("addMARowBtn"),
  vwapToggle: document.getElementById("vwapToggle"),
  vwapSource: document.getElementById("vwapSource"),
  vwapColor: document.getElementById("vwapColor"),
  vwapWidth: document.getElementById("vwapWidth"),
  vwapAnchor: document.getElementById("vwapAnchor"),
  volumeToggle: document.getElementById("volumeToggle"),
  rsiToggle: document.getElementById("rsiToggle"),
  rsiLength: document.getElementById("rsiLength"),
  rsiUpper: document.getElementById("rsiUpper"),
  rsiMiddle: document.getElementById("rsiMiddle"),
  rsiLower: document.getElementById("rsiLower"),
  rsiColor: document.getElementById("rsiColor"),
  rsiSource: document.getElementById("rsiSource"),
  whaleLiquidityToggle: document.getElementById("whaleLiquidityToggle"),
  orderflowPlaceholderToggle: document.getElementById("orderflowPlaceholderToggle"),
  toolTip: document.getElementById("toolTip"),
  selectionToolbar: document.getElementById("selectionToolbar"),
  selDelete: document.getElementById("selDelete"),
  selLock: document.getElementById("selLock"),
  selHide: document.getElementById("selHide"),
  selClone: document.getElementById("selClone"),
  selMoveMode: document.getElementById("selMoveMode"),
  selSettings: document.getElementById("selSettings"),
  toolbarDragHandle: document.getElementById("toolbarDragHandle"),
  selTemplate: document.getElementById("selTemplate"),
  selStyle: document.getElementById("selStyle"),
  selLineWidth: document.getElementById("selLineWidth"),
  drawingSettingsModal: document.getElementById("drawingSettingsModal"),
  closeDrawingSettings: document.getElementById("closeDrawingSettings"),
  drawingSettingsTitle: document.getElementById("drawingSettingsTitle"),
  settingsBody: document.getElementById("settingsBody"),
  applyDrawingSettings: document.getElementById("applyDrawingSettings"),
  resetDrawingSettings: document.getElementById("resetDrawingSettings"),
  addFibLevel: document.getElementById("addFibLevel"),
  templateName: document.getElementById("templateName"),
  templateSelect: document.getElementById("templateSelect"),
  saveTemplateBtn: document.getElementById("saveTemplateBtn"),
  applyTemplateBtn: document.getElementById("applyTemplateBtn"),
  setDefaultTemplateBtn: document.getElementById("setDefaultTemplateBtn"),
  deleteTemplateBtn: document.getElementById("deleteTemplateBtn"),
  templateNote: document.getElementById("templateNote")
};


const toolbarStylePopover = document.createElement("div");
toolbarStylePopover.id = "toolbarStylePopover";
toolbarStylePopover.className = "toolbar-popover hidden";
toolbarStylePopover.innerHTML = `
  <h4>Style</h4>
  <div class="row"><span>Color</span><input id="quickColor" type="color" /></div>
  <div class="row"><span>Width</span><input id="quickWidth" type="number" min="1" max="8" /></div>
  <div class="row"><span>Style</span><select id="quickLineStyle"><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select></div>
  <div class="row"><span>Labels</span><input id="quickLabels" type="checkbox" /></div>
  <button id="quickOpenSettings">More settings</button>
`;
document.body.appendChild(toolbarStylePopover);

const toolbarTemplatePopover = document.createElement("div");
toolbarTemplatePopover.id = "toolbarTemplatePopover";
toolbarTemplatePopover.className = "toolbar-popover hidden";
toolbarTemplatePopover.innerHTML = `
  <h4>Templates</h4>
  <div class="row"><span>Name</span><input id="quickTemplateName" type="text" placeholder="Template name" /></div>
  <div class="row"><span>Saved</span><select id="quickTemplateSelect"></select></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
    <button id="quickSaveTemplate">Save</button>
    <button id="quickApplyTemplate">Apply</button>
    <button id="quickDefaultTemplate">Default</button>
    <button id="quickDeleteTemplate" style="background:#ef4444">Delete</button>
  </div>
`;
document.body.appendChild(toolbarTemplatePopover);


const chartEl = document.getElementById("chart");
const shellEl = document.getElementById("chartShell");
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");


const rsiPanel = document.createElement("div");
rsiPanel.id = "rsiPanel";
rsiPanel.className = "rsi-panel hidden";
rsiPanel.innerHTML = `<div class="rsi-title">RSI 14</div><canvas id="rsiCanvas"></canvas>`;
shellEl.appendChild(rsiPanel);
const rsiCanvas = document.getElementById("rsiCanvas");
const rsiCtx = rsiCanvas.getContext("2d");

const orderflowTag = document.createElement("div");
orderflowTag.id = "orderflowTag";
orderflowTag.className = "orderflow-tag hidden";
orderflowTag.textContent = "WhaleX Orderflow Foundation: POC/LVN engine next";
shellEl.appendChild(orderflowTag);

const indicatorLegend = document.createElement("div");
indicatorLegend.id = "indicatorLegend";
indicatorLegend.className = "indicator-legend";
shellEl.appendChild(indicatorLegend);


const chart = LightweightCharts.createChart(chartEl, {
  layout: {
    background: { color: "#070b12" },
    textColor: "#aab7c8",
    fontFamily: "Inter, system-ui, sans-serif",
    attributionLogo: false
  },
  grid: {
    vertLines: { color: "rgba(255,255,255,0.05)" },
    horzLines: { color: "rgba(255,255,255,0.06)" }
  },
  rightPriceScale: {
    borderColor: "rgba(255,255,255,0.12)",
    scaleMargins: { top: 0.08, bottom: 0.08 }
  },
  timeScale: {
    borderColor: "rgba(255,255,255,0.12)",
    timeVisible: true,
    secondsVisible: false
  },
  crosshair: { mode: LightweightCharts.CrosshairMode.Normal }
});

let mainSeries = null;
let seriesType = "candles";
let ws = null;
let priceLines = [];
let lastLiquidity = null;
let rawCandles = [];
let renderedCandles = [];
let candlesByTime = new Map();
let activeTool = "cursor";
let pendingPoints = [];
let hoverPoint = null;
let drawings = [];
let selectedId = null;
let dragMode = null;
let dragStart = null;
let lastAlertKeys = new Set();
let indicatorSeries = {};
let volumeSeries = null;
let indicatorSettings = {
  ma: [
    { enabled:false, type:"EMA", length:9, source:"close", color:"#38bdf8", width:2 }
  ],
  vwap:{ enabled:false, source:"hlc3", color:"#eab308", width:2, anchor:"session" },
  volume:false,
  rsi:{ enabled:false, length:14, source:"close", upper:70, middle:50, lower:30, color:"#d6a93d" },
  whaleLiquidity:true,
  orderflowFoundation:false
};
let activeSettingsTab = "style";

function interval() {
  return document.querySelector("#tfbar button.active")?.dataset.tf || "15";
}

function storageKey() {
  return `whalex_drawings_v222_${(els.symbol.value || "BTCUSDT").trim().toUpperCase()}_${interval()}`;
}

function wsUrl() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  const p = new URLSearchParams({
    symbol: (els.symbol.value || "BTCUSDT").trim().toUpperCase(),
    interval: interval(),
    bucket: HARD.bucket,
    min_m: HARD.minM,
    max_lines: HARD.maxLines,
    publish_ms: HARD.publishMs
  });
  return `${proto}//${location.host}/ws/chart?${p.toString()}`;
}

function fmtPrice(v) {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "—";
  return Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function fmtM(v) {
  return `${Number(v || 0).toFixed(2)}M`;
}

function fmtAge(s) {
  s = Math.max(0, Math.floor(Number(s || 0)));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60), r = s % 60;
  if (m < 60) return `${m}m ${r}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function toast(m) {
  els.toast.textContent = m;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 3400);
}

function safeResize() {
  resizeChart();
  setTimeout(drawRSI, 50);
  requestAnimationFrame(() => { resizeChart(); drawOverlay(); });
  setTimeout(() => { resizeChart(); drawOverlay(); }, 80);
  setTimeout(() => { resizeChart(); drawOverlay(); }, 260);
  setTimeout(() => { resizeChart(); drawOverlay(); }, 900);
}

function safeFit() {
  safeResize();
  try { chart.timeScale().fitContent(); } catch (e) {}
  setTimeout(() => { safeResize(); try { chart.timeScale().fitContent(); } catch (e) {} }, 200);
}

function resetChartView() {
  safeResize();
  try { chart.priceScale("right").applyOptions({ autoScale: true }); } catch (e) {}
  try { chart.timeScale().fitContent(); } catch (e) {}
  setTimeout(() => { safeResize(); try { chart.timeScale().fitContent(); } catch (e) {} }, 250);
  toast("Chart view reset");
}

function resizeChart() {
  const rect = shellEl.getBoundingClientRect();
  const width = Math.max(500, Math.floor(rect.width || window.innerWidth - 60));
  const height = Math.max(500, Math.floor(rect.height || window.innerHeight - 90));
  try { chart.resize(width, height, true); }
  catch (e) { try { chart.applyOptions({ width, height }); } catch (_) {} }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawOverlay();
}

function makeSeries(type) {
  if (mainSeries) {
    try { chart.removeSeries(mainSeries); } catch (e) {}
  }
  seriesType = type;
  if (type === "line") {
    mainSeries = chart.addLineSeries({ color: "#d6a93d", lineWidth: 2 });
  } else if (type === "area") {
    mainSeries = chart.addAreaSeries({
      topColor: "rgba(214,169,61,.32)",
      bottomColor: "rgba(214,169,61,.02)",
      lineColor: "#d6a93d",
      lineWidth: 2
    });
  } else if (type === "bars") {
    mainSeries = chart.addBarSeries({ upColor: "#22c55e", downColor: "#ef4444" });
  } else {
    mainSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444"
    });
  }
  redrawMainSeries();
  redrawLiquidity();
  drawOverlay();
}

function computeHA(data) {
  let po = null, pc = null;
  return data.map(c => {
    const close = (c.open + c.high + c.low + c.close) / 4;
    const open = po === null ? (c.open + c.close) / 2 : (po + pc) / 2;
    const high = Math.max(c.high, open, close);
    const low = Math.min(c.low, open, close);
    po = open; pc = close;
    return { ...c, open, high, low, close };
  });
}

function getRenderedCandles() {
  return seriesType === "heikin" ? computeHA(rawCandles) : rawCandles;
}

function seriesData(data) {
  if (seriesType === "line" || seriesType === "area") {
    return data.map(c => ({ time: c.time, value: c.close }));
  }
  return data.map(c => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close }));
}

function redrawMainSeries() {
  if (!mainSeries || !rawCandles.length) return;
  renderedCandles = getRenderedCandles();
  mainSeries.setData(seriesData(renderedCandles));
  candlesByTime = new Map(renderedCandles.map(c => [String(c.time), c]));
  redrawIndicators();
  drawOverlay();
}

function updateOneCandle(c) {
  const i = rawCandles.findIndex(x => x.time === c.time);
  if (i >= 0) rawCandles[i] = c;
  else rawCandles.push(c);
  rawCandles.sort((a, b) => a.time - b.time);
  renderedCandles = getRenderedCandles();
  const rc = renderedCandles.find(x => x.time === c.time) || c;
  candlesByTime.set(String(rc.time), rc);
  if (mainSeries) mainSeries.update(seriesData([rc])[0]);
  redrawIndicators();
  drawOverlay();
}

function clearLiquidityLines() {
  for (const pl of priceLines) {
    try { mainSeries.removePriceLine(pl); } catch (e) {}
  }
  priceLines = [];
}

function addLiquidityLine(line) {
  const isBid = line.side === "bid";
  const color = isBid ? "#22c55e" : "#ef4444";
  const label = `${isBid ? "BID" : "ASK"} ${fmtPrice(line.price)} | ${fmtM(line.liquidity_m)} | ${fmtAge(line.age_seconds)} | ${line.behavior}`;
  priceLines.push(mainSeries.createPriceLine({
    price: Number(line.price),
    color,
    lineWidth: line.age_seconds >= 180 ? 3 : 2,
    lineStyle: line.age_seconds >= 180 ? LightweightCharts.LineStyle.Solid : LightweightCharts.LineStyle.Dashed,
    axisLabelVisible: true,
    title: label
  }));
}

function redrawLiquidity() {
  if (!lastLiquidity || !mainSeries) return;
  clearLiquidityLines();
  if (els.showBids?.checked) for (const l of lastLiquidity.bid_lines || []) addLiquidityLine(l);
  if (els.showAsks?.checked) for (const l of lastLiquidity.ask_lines || []) addLiquidityLine(l);
}

function updateLiquidity(p) {
  lastLiquidity = p;
  redrawLiquidity();
  if (els.mid) els.mid.textContent = fmtPrice(p.mid);
  if (els.bestBid) els.bestBid.textContent = fmtPrice(p.best_bid);
  if (els.bestAsk) els.bestAsk.textContent = fmtPrice(p.best_ask);
  if (els.liqSource) els.liqSource.textContent = "Liquidity: " + (p.exchange || "Bybit");
  if (p.history_source && els.historySource) els.historySource.textContent = "Candles: " + p.history_source;
  renderRows(els.bidRows, p.bid_lines || [], "bid");
  renderRows(els.askRows, p.ask_lines || [], "ask");
  checkLiquidityAlerts(p);
}

function checkLiquidityAlerts(p) {
  const lines = [...(p.bid_lines || []), ...(p.ask_lines || [])]
    .filter(x => x.age_seconds >= 180 || ["Building", "Fading"].includes(x.behavior));
  for (const l of lines) {
    const k = `${l.side}_${l.price}_${l.behavior}`;
    if (!lastAlertKeys.has(k)) {
      lastAlertKeys.add(k);
      toast(`${l.side.toUpperCase()} ${fmtPrice(l.price)} ${fmtM(l.liquidity_m)} · ${l.behavior}`);
    }
  }
  if (lastAlertKeys.size > 100) lastAlertKeys = new Set([...lastAlertKeys].slice(-50));
}

function renderRows(tbody, rows, side) {
  if (!tbody) return;
  tbody.innerHTML = "";
  for (const l of rows) {
    const tr = document.createElement("tr");
    const klass = side === "bid" ? "bidText" : "askText";
    tr.innerHTML = `<td class="${klass}">${fmtPrice(l.price)}</td><td>${fmtM(l.liquidity_m)}</td><td>${fmtAge(l.age_seconds)}</td><td>${l.behavior || "—"}</td>`;
    tbody.appendChild(tr);
  }
}

/* ---------- Drawing defaults/settings ---------- */

function tvFibLevels() {
  const base = [
    ["#9ca3af", -1, "-1"],
    ["#60a5fa", -0.618, "-0.618"],
    ["#38bdf8", -0.382, "-0.382"],
    ["#22d3ee", -0.236, "-0.236"],
    ["#ffffff", 0, "0"],
    ["#22c55e", 0.236, "0.236"],
    ["#84cc16", 0.382, "0.382"],
    ["#eab308", 0.5, "0.5"],
    ["#f97316", 0.618, "0.618"],
    ["#fb7185", 0.65, "0.65"],
    ["#ec4899", 0.707, "0.707"],
    ["#a855f7", 0.786, "0.786"],
    ["#ef4444", 1, "1"],
    ["#f97316", 1.272, "1.272"],
    ["#eab308", 1.414, "1.414"],
    ["#22c55e", 1.618, "1.618"],
    ["#38bdf8", 2, "2"],
    ["#60a5fa", 2.618, "2.618"],
    ["#818cf8", 3.618, "3.618"],
    ["#c084fc", 4.236, "4.236"]
  ];
  return base.map(([color,value,label]) => ({
    on: [0,0.236,0.382,0.5,0.618,0.786,1,1.618].includes(value),
    value,
    label,
    color,
    width: 1,
    lineStyle: "solid"
  }));
}

function defaultStyle(type) {
  const common = {
    color: type === "fib" ? "#a78bfa" : type === "rect" ? "#f59e0b" : type === "rr" ? "#22c55e" : "#38bdf8",
    width: 2,
    lineStyle: "solid",
    showLabels: true,
    showPrice: true,
    showValue: true,
    textColor: "#ffffff",
    fontSize: 12
  };
  if (type === "hline") return { ...common, extendLeft: true, extendRight: true, axisLabel: true };
  if (type === "trend") return { ...common, extendLeft: false, extendRight: false, showMiddle: false };
  if (type === "ray") return { ...common, extendLeft: false, extendRight: true, showMiddle: false };
  if (type === "rect") return { ...common, fillColor: "#f59e0b", fillOpacity: 14, borderColor: "#f59e0b" };
  if (type === "fib") return {
    ...common,
    color: "#a78bfa",
    textColor: "#ffffff",
    background: true,
    fillOpacity: 6,
    extendLines: false,
    extendLeft: false,
    extendRight: false,
    fibSpanMode: "pointToPoint",
    labelSide: "right",
    reverse: false,
    showLevelValue: true,
    showLevelPrice: true,
    showLevelLabel: true,
    showLevelColorLabels: true,
    showBackgroundZones: true,
    levels: tvFibLevels()
  };
  if (type === "rr") return {
    ...common,
    mode: "long",
    profitColor: "#22c55e",
    lossColor: "#ef4444",
    fillOpacity: 16,
    showRR: true,
    showPrices: true,
    showRiskPercent: false,
    accountSize: 10000,
    riskPercent: 1
  };
  return common;
}

function normalizeDrawing(d) {
  if (!d.settings) d.settings = defaultStyle(d.type);
  else d.settings = { ...defaultStyle(d.type), ...d.settings };
  if (d.type === "fib") {
    const def = defaultStyle("fib").levels;
    if (!Array.isArray(d.settings.levels)) d.settings.levels = def;

    // v2.16: default/migrate Fib to point A → point B, not full-screen.
    if (d.settings.fibSpanMode === undefined) {
      d.settings.fibSpanMode = "pointToPoint";
      d.settings.extendLines = false;
      d.settings.extendLeft = false;
      d.settings.extendRight = false;
    }

    d.settings.levels = d.settings.levels.map((l, i) => ({
      on: l.on !== false,
      value: Number(l.value ?? def[i]?.value ?? 0),
      label: String(l.label ?? def[i]?.label ?? l.value ?? ""),
      color: l.color || def[i]?.color || d.settings.color || "#a78bfa",
      width: Number(l.width || 1),
      lineStyle: l.lineStyle || "solid"
    }));
  }
  if (d.hidden === undefined) d.hidden = false;
  if (d.locked === undefined) d.locked = false;
  return d;
}

function allDrawingsNormalized() {
  drawings = drawings.map(normalizeDrawing);
}

function dashFor(style) {
  if (style === "dotted") return [2, 4];
  if (style === "dashed") return [7, 5];
  return [];
}

function colorWithOpacity(hex, opacityPct) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(100, opacityPct)) / 100})`;
}

/* ---------- Drawing coordinates ---------- */

function pToX(p) { return chart.timeScale().timeToCoordinate(p.time); }
function pToY(p) { return mainSeries?.priceToCoordinate(p.price); }
function xToTime(x) { return chart.timeScale().coordinateToTime(x); }
function yToPrice(y) { return mainSeries?.coordinateToPrice(y); }

function intervalSecondsValue() {
  const tf = interval();
  const n = parseInt(tf, 10);
  if (tf === "1D" || tf === "D") return 86400;
  if (tf === "1W" || tf === "W") return 604800;
  if (Number.isFinite(n)) return n * 60;
  return 60;
}

function fallbackTimeFromX(x) {
  let t = xToTime(x);
  if (t !== null && t !== undefined) return t;

  try {
    const logical = chart.timeScale().coordinateToLogical(x);
    if (logical !== null && logical !== undefined && rawCandles.length) {
      const idx = Math.round(logical);
      const sec = intervalSecondsValue();

      if (idx >= 0 && idx < rawCandles.length) return rawCandles[idx].time;

      const lastIdx = rawCandles.length - 1;
      const lastTime = rawCandles[lastIdx].time;
      return lastTime + Math.round(idx - lastIdx) * sec;
    }
  } catch(e) {}

  return rawCandles.length ? rawCandles[rawCandles.length - 1].time : Math.floor(Date.now() / 1000);
}

function fallbackPriceFromY(y) {
  let price = yToPrice(y);
  if (Number.isFinite(price)) return price;

  const last = rawCandles.length ? rawCandles[rawCandles.length - 1] : null;
  if (last && Number.isFinite(last.close)) return last.close;
  if (lastLiquidity && Number.isFinite(lastLiquidity.mid)) return lastLiquidity.mid;
  return 0;
}

function xyToPoint(e) {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const time = fallbackTimeFromX(x);
  const price = fallbackPriceFromY(y);
  if (time === null || time === undefined || !Number.isFinite(price)) return null;
  return { time, price, x, y };
}

function pointToXY(p) {
  return { x: pToX(p), y: pToY(p) };
}

function dist(a,b,c,d) {
  return Math.hypot(a-c, b-d);
}

function neededPoints(t) {
  return t === "hline" ? 1 : t === "rr" ? 3 : (t === "longpos" || t === "shortpos") ? 1 : 2;
}

function setTool(t) {
  activeTool = t;
  pendingPoints = [];
  hoverPoint = null;
  dragMode = null;

  const buttons = [els.cursorBtn, els.editBtn, els.hlineBtn, els.trendBtn, els.rayBtn, els.rectBtn, els.fibBtn, els.rrBtn].filter(Boolean);
  buttons.forEach(b => b.classList.remove("active"));

  const map = {
    cursor: els.cursorBtn,
    edit: els.editBtn,
    hline: els.hlineBtn,
    trend: els.trendBtn,
    ray: els.rayBtn,
    rect: els.rectBtn,
    fib: els.fibBtn,
    rr: els.rrBtn,
    longpos: els.rrBtn,
    shortpos: els.rrBtn
  };
  (map[t] || els.cursorBtn)?.classList.add("active");
  els.longPosBtn?.classList.toggle("active", t === "longpos");
  els.shortPosBtn?.classList.toggle("active", t === "shortpos");

  const isDraw = !["cursor", "edit"].includes(t);
  document.body.classList.toggle("mode-move", t === "cursor");
  document.body.classList.toggle("mode-edit", t === "edit");
  document.body.classList.toggle("mode-draw", isDraw);

  shellEl.classList.toggle("drawing-active", isDraw);
  shellEl.classList.toggle("edit-active", t === "edit");
  shellEl.classList.toggle("select-mode", t === "edit");

  if (els.toolTip) {
    const label = t === "cursor" ? "Move / Pan" : t === "edit" ? "Select / Edit" : `Drawing: ${t === "longpos" ? "Long Position ONE CLICK 1:1" : t === "shortpos" ? "Short Position ONE CLICK 1:1" : t} (${neededPoints(t)} click${neededPoints(t) > 1 ? "s" : ""})`;
    els.toolTip.textContent = label;
  }

  toast(t === "cursor" ? "Move mode" : t === "edit" ? "Edit mode" : `${t.toUpperCase()} drawing mode`);
  drawOverlay();
}

/* ---------- Drawing persistence / object tree ---------- */

function saveDrawings() {
  allDrawingsNormalized();
  localStorage.setItem(storageKey(), JSON.stringify(drawings));
  renderObjectTree();
}

function loadDrawings() {
  try { drawings = JSON.parse(localStorage.getItem(storageKey()) || "[]"); }
  catch (e) { drawings = []; }
  allDrawingsNormalized();
  selectedId = null;
  renderObjectTree();
  drawOverlay();
}

function objectName(d) {
  return (d.type === "rr" ? ((d.settings?.mode === "short" ? "Short Position" : "Long Position")) : ({ hline:"Horizontal Line", trend:"Trendline", ray:"Ray", rect:"Rectangle", fib:"Fib Retracement" }[d.type] || d.type)) + " #" + String(d.id).slice(-4);
}

function renderObjectTree() {
  if (!els.objectTree) return;
  els.objectTree.innerHTML = "";
  if (!drawings.length) {
    els.objectTree.innerHTML = '<div class="object-item">No drawings</div>';
    updateSelectionToolbar();
    return;
  }
  drawings.forEach(d => {
    normalizeDrawing(d);
    const div = document.createElement("div");
    div.className = "object-item" + (d.id === selectedId ? " active" : "");
    const lockTxt = d.locked ? "Unlock" : "Lock";
    const hideTxt = d.hidden ? "Show" : "Hide";
    div.innerHTML = `<span>${objectName(d)}</span><span class="chips"><button class="lock" data-act="lock">${lockTxt}</button><button class="hide" data-act="hide">${hideTxt}</button><button data-act="settings">⚙</button><button data-act="del">Del</button></span>`;
    div.onclick = (e) => {
      const act = e.target?.dataset?.act;
      if (act) {
        if (act === "del") deleteDrawing(d.id);
        if (act === "lock") toggleLock(d.id);
        if (act === "hide") toggleHide(d.id);
        if (act === "settings") { selectedId = d.id; openDrawingSettings(); }
        return;
      }
      selectedId = d.id;
      setTool("edit");
      drawOverlay();
      renderObjectTree();
    };
    els.objectTree.appendChild(div);
  });
  updateSelectionToolbar();
}

function selectedDrawing() {
  return drawings.find(x => x.id === selectedId);
}


let toolbarPinned = false;
let toolbarDrag = null;

function toolbarPositionKey() {
  return `whalex_toolbar_pos_v218_${(els.symbol.value || "BTCUSDT").trim().toUpperCase()}`;
}

function saveToolbarPosition() {
  if (!els.selectionToolbar) return;
  localStorage.setItem(toolbarPositionKey(), JSON.stringify({
    left: parseFloat(els.selectionToolbar.style.left || "64"),
    top: parseFloat(els.selectionToolbar.style.top || "12")
  }));
}

function loadToolbarPosition() {
  try { return JSON.parse(localStorage.getItem(toolbarPositionKey()) || "null"); }
  catch (e) { return null; }
}

function placeToolbar(x,y) {
  if (!els.selectionToolbar) return;
  const maxX = Math.max(10, (canvas.clientWidth || window.innerWidth) - 460);
  const maxY = Math.max(10, (canvas.clientHeight || window.innerHeight) - 70);
  els.selectionToolbar.style.left = `${Math.max(10, Math.min(maxX, x))}px`;
  els.selectionToolbar.style.top = `${Math.max(10, Math.min(maxY, y))}px`;
}

function hideToolbarPopovers() {
  toolbarStylePopover.classList.add("hidden");
  toolbarTemplatePopover.classList.add("hidden");
}

function positionPopover(pop, anchorBtn) {
  const chartRect = shellEl.getBoundingClientRect();
  const btnRect = anchorBtn.getBoundingClientRect();
  pop.style.left = `${Math.min(window.innerWidth - 250, btnRect.left)}px`;
  pop.style.top = `${Math.min(window.innerHeight - 220, btnRect.bottom + 8)}px`;
}

function refreshToolbarTemplateSelect() {
  const d = selectedDrawing();
  const sel = document.getElementById("quickTemplateSelect");
  if (!d || !sel) return;
  const templates = loadTemplates(d.type);
  const def = getDefaultTemplateName(d.type);
  const names = Object.keys(templates).sort();
  sel.innerHTML = `<option value="">${names.length ? "Select template" : "No templates"}</option>`;
  names.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name === def ? `${name} ★ Default` : name;
    sel.appendChild(opt);
  });
}

function openToolbarTemplates() {
  const d = selectedDrawing();
  if (!d) { toast("Select a drawing first"); return; }
  hideToolbarPopovers();
  refreshToolbarTemplateSelect();
  document.getElementById("quickTemplateName").value = "";
  toolbarTemplatePopover.classList.remove("hidden");
  positionPopover(toolbarTemplatePopover, els.selTemplate);
}

function openToolbarStyle() {
  const d = selectedDrawing();
  if (!d) { toast("Select a drawing first"); return; }
  normalizeDrawing(d);
  hideToolbarPopovers();
  document.getElementById("quickColor").value = d.settings.color || "#38bdf8";
  document.getElementById("quickWidth").value = d.settings.width || 2;
  document.getElementById("quickLineStyle").value = d.settings.lineStyle || "solid";
  document.getElementById("quickLabels").checked = d.settings.showLabels !== false;
  toolbarStylePopover.classList.remove("hidden");
  positionPopover(toolbarStylePopover, els.selStyle);
}

function applyQuickStyle() {
  const d = selectedDrawing();
  if (!d) return;
  normalizeDrawing(d);
  d.settings.color = document.getElementById("quickColor").value;
  d.settings.width = Number(document.getElementById("quickWidth").value || 2);
  d.settings.lineStyle = document.getElementById("quickLineStyle").value;
  d.settings.showLabels = document.getElementById("quickLabels").checked;
  if (d.type === "fib") {
    d.settings.levels = (d.settings.levels || []).map(l => ({...l, color: l.color || d.settings.color}));
  }
  if (d.type === "rect") {
    d.settings.borderColor = d.settings.color;
  }
  saveDrawings();
  drawOverlay();
}

function saveTemplateFromToolbar() {
  const d = selectedDrawing();
  if (!d) return;
  normalizeDrawing(d);
  const name = (document.getElementById("quickTemplateName").value || "").trim();
  if (!name) { toast("Enter template name"); return; }
  const templates = loadTemplates(d.type);
  templates[name] = cloneSettings(d.settings);
  saveTemplates(d.type, templates);
  refreshToolbarTemplateSelect();
  document.getElementById("quickTemplateSelect").value = name;
  toast(`${d.type.toUpperCase()} template saved`);
}

function applyTemplateFromToolbar() {
  const d = selectedDrawing();
  if (!d) return;
  const name = document.getElementById("quickTemplateSelect").value;
  if (!name) { toast("Select template"); return; }
  const templates = loadTemplates(d.type);
  if (!templates[name]) { toast("Template not found"); return; }
  d.settings = { ...defaultStyle(d.type), ...cloneSettings(templates[name]) };
  if (d.type === "fib" && templates[name].levels) d.settings.levels = cloneSettings(templates[name].levels);
  normalizeDrawing(d);
  saveDrawings();
  drawOverlay();
  toast(`${name} applied`);
}

function setDefaultTemplateFromToolbar() {
  const d = selectedDrawing();
  if (!d) return;
  const name = document.getElementById("quickTemplateSelect").value;
  if (!name) { toast("Select template"); return; }
  setDefaultTemplateName(d.type, name);
  refreshToolbarTemplateSelect();
  toast(`${name} set default for ${d.type.toUpperCase()}`);
}

function deleteTemplateFromToolbar() {
  const d = selectedDrawing();
  if (!d) return;
  const name = document.getElementById("quickTemplateSelect").value;
  if (!name) { toast("Select template"); return; }
  const templates = loadTemplates(d.type);
  delete templates[name];
  saveTemplates(d.type, templates);
  if (getDefaultTemplateName(d.type) === name) setDefaultTemplateName(d.type, "");
  refreshToolbarTemplateSelect();
  toast(`${name} deleted`);
}


function drawingScreenBounds(d) {
  if (!d || !Array.isArray(d.points) || !d.points.length) return null;
  const pts = d.points.map(pointToXY).filter(p => p.x != null && p.y != null);
  if (!pts.length) return null;

  if (d.type === "fib") {
    const x1 = pToX(d.points[0]), x2 = pToX(d.points[1]);
    if (x1 != null && x2 != null) {
      const low = Math.min(d.points[0].price, d.points[1].price);
      const high = Math.max(d.points[0].price, d.points[1].price);
      const y1 = pToY({ price: low });
      const y2 = pToY({ price: high });
      if (y1 != null && y2 != null) pts.push({ x: Math.min(x1,x2), y: Math.min(y1,y2) }, { x: Math.max(x1,x2), y: Math.max(y1,y2) });
    }
  }

  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
}

function updateSelectionToolbar() {
  if (!els.selectionToolbar) return;
  const d = selectedDrawing();
  els.selectionToolbar.classList.toggle("hidden", !d);
  if (d) {
    if (els.selLock) els.selLock.textContent = d.locked ? "🔓" : "🔒";
    if (els.selHide) els.selHide.textContent = d.hidden ? "🙈" : "👁";
    if (els.selLineWidth) els.selLineWidth.textContent = `${d.settings?.width || 1}px`;

    if (toolbarPinned) return;

    const saved = loadToolbarPosition();
    if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
      placeToolbar(saved.left, saved.top);
      toolbarPinned = true;
      return;
    }

    const b = drawingScreenBounds(d);
    if (b) {
      placeToolbar(b.left + 8, Math.max(10, b.top - 44));
    }
  } else {
    hideToolbarPopovers();
  }
}

function positionAutoPoints(rawTool, entry) {
  const isShort = rawTool === "shortpos";

  // Use roughly 80px above/below entry so default box looks natural across zoom levels.
  // Fallback to 0.5% if coordinate conversion is not available.
  let targetPrice, stopPrice;
  const pxRisk = 80;

  if (entry.y !== undefined && Number.isFinite(entry.y)) {
    const above = yToPrice(entry.y - pxRisk);
    const below = yToPrice(entry.y + pxRisk);

    if (Number.isFinite(above) && Number.isFinite(below)) {
      if (isShort) {
        targetPrice = below;
        stopPrice = above;
      } else {
        targetPrice = above;
        stopPrice = below;
      }
    }
  }

  if (!Number.isFinite(targetPrice) || !Number.isFinite(stopPrice)) {
    const risk = Math.max(1, Math.abs(entry.price) * 0.005);
    if (isShort) {
      targetPrice = entry.price - risk;
      stopPrice = entry.price + risk;
    } else {
      targetPrice = entry.price + risk;
      stopPrice = entry.price - risk;
    }
  }

  // Same time anchor gives a clean vertical position tool, with box extending right by drawing logic.
  return [
    { time: entry.time, price: entry.price },
    { time: entry.time, price: targetPrice },
    { time: entry.time, price: stopPrice }
  ];
}

function addDrawing(points) {
  const rawTool = activeTool;
  const isPosition = rawTool === "longpos" || rawTool === "shortpos";
  const finalType = isPosition ? "rr" : rawTool;

  let finalPoints = [...points];

  // v2.21: one-click Long/Short position.
  // User clicks Entry only. Target and Stop are auto-created at default 1:1.
  if (isPosition && points.length >= 1) {
    finalPoints = positionAutoPoints(rawTool, points[0]);
  }

  let d = normalizeDrawing({
    id: Date.now() + Math.floor(Math.random() * 1000),
    type: finalType,
    points: finalPoints,
    locked: false,
    hidden: false
  });

  if (finalType === "rr") {
    d.settings.mode = rawTool === "shortpos" ? "short" : "long";
    d.settings.color = rawTool === "shortpos" ? "#ef4444" : "#22c55e";
  }

  d = applyDefaultTemplateToDrawing(d);

  // Keep selected Long/Short mode even after template is applied.
  if (finalType === "rr" && isPosition) {
    d.settings.mode = rawTool === "shortpos" ? "short" : "long";
  }

  drawings.push(d);
  selectedId = d.id;
  pendingPoints = [];
  hoverPoint = null;
  saveDrawings();
  drawOverlay();
}

function deleteDrawing(id = selectedId) {
  if (id == null) return;
  drawings = drawings.filter(d => d.id !== id);
  selectedId = null;
  saveDrawings();
  drawOverlay();
  toast("Drawing deleted");
}

function undo() {
  if (drawings.length) {
    drawings.pop();
    selectedId = null;
    saveDrawings();
    drawOverlay();
    toast("Undo");
  }
}

function toggleLock(id = selectedId) {
  const d = drawings.find(x => x.id === id);
  if (!d) return;
  d.locked = !d.locked;
  saveDrawings();
  drawOverlay();
  toast(d.locked ? "Drawing locked" : "Drawing unlocked");
}

function toggleHide(id = selectedId) {
  const d = drawings.find(x => x.id === id);
  if (!d) return;
  d.hidden = !d.hidden;
  if (d.hidden && selectedId === d.id) selectedId = null;
  saveDrawings();
  drawOverlay();
  toast(d.hidden ? "Drawing hidden" : "Drawing shown");
}

function cloneDrawing() {
  const d = selectedDrawing();
  if (!d) return;
  const c = JSON.parse(JSON.stringify(d));
  c.id = Date.now() + Math.floor(Math.random() * 1000);
  c.locked = false;
  c.hidden = false;
  c.points.forEach(p => p.price = Number(p.price) * 1.0003);
  drawings.push(c);
  selectedId = c.id;
  saveDrawings();
  drawOverlay();
  toast("Drawing cloned");
}

/* ---------- Hit testing / dragging ---------- */

function hitTest(x,y) {
  for (let i = drawings.length - 1; i >= 0; i--) {
    const d = normalizeDrawing(drawings[i]);
    if (d.hidden) continue;
    const hit = hitDrawing(d, x, y);
    if (hit) return { d, hit };
  }
  return null;
}

function hitDrawing(d,x,y) {
  const pts = d.points.map(pointToXY);
  for (let i=0; i<pts.length; i++) {
    if (pts[i].x != null && pts[i].y != null && dist(x,y,pts[i].x,pts[i].y) < 8) return { kind:"anchor", idx:i };
  }
  if (d.type === "hline") {
    const yy = pToY(d.points[0]);
    if (yy != null && Math.abs(y-yy) < 7) return { kind:"body" };
  }
  if (d.type === "trend" || d.type === "ray") {
    const a = pts[0], b = pts[1];
    if ([a.x,a.y,b.x,b.y].some(v => v == null)) return null;
    let x2 = b.x, y2 = b.y;
    if (d.type === "ray" || d.settings?.extendRight) {
      const dx = b.x-a.x, dy = b.y-a.y;
      if (Math.abs(dx) > 1) { x2 = canvas.clientWidth; y2 = a.y + dy*((x2-a.x)/dx); }
    }
    const L = dist(a.x,a.y,x2,y2);
    if (L < 1) return null;
    const t = ((x-a.x)*(x2-a.x)+(y-a.y)*(y2-a.y))/(L*L);
    if (t >= 0 && t <= 1) {
      const px = a.x+t*(x2-a.x), py = a.y+t*(y2-a.y);
      if (dist(x,y,px,py) < 7) return { kind:"body" };
    }
  }
  if (d.type === "rect" || d.type === "rr") {
    const xs = pts.map(p => p.x).filter(v => v != null), ys = pts.map(p => p.y).filter(v => v != null);
    const l = Math.min(...xs), r = Math.max(...xs) + (d.type === "rr" ? 80 : 0);
    const t = Math.min(...ys), b = Math.max(...ys);
    if (x>=l && x<=r && y>=t && y<=b) return { kind:"body" };
  }
  if (d.type === "fib") {
    const x1 = pToX(d.points[0]), x2 = pToX(d.points[1]);
    const left = Math.min(x1 ?? 0, x2 ?? 0);
    const right = Math.max(x1 ?? 0, x2 ?? 0);
    const low = Math.min(d.points[0].price, d.points[1].price);
    const high = Math.max(d.points[0].price, d.points[1].price);
    const yLow = pToY({ price: low });
    const yHigh = pToY({ price: high });

    // Move whole Fib by clicking inside its A-B box, not only exactly on a level line.
    if (x1 != null && x2 != null && yLow != null && yHigh != null) {
      const top = Math.min(yLow, yHigh);
      const bottom = Math.max(yLow, yHigh);
      if (x >= left - 8 && x <= right + 8 && y >= top - 8 && y <= bottom + 8) return { kind:"body" };
    }

    for (const lev of d.settings.levels.filter(l => l.on)) {
      const yy = pToY({ price: low + (high-low)*Number(lev.value) });
      if (yy != null && Math.abs(y-yy) < 8) return { kind:"body" };
    }
  }
  return null;
}

function moveDrawing(d,dx,dy) {
  for (const p of d.points) {
    const x = pToX(p), y = pToY(p);
    if (x == null || y == null) continue;
    const nt = xToTime(x+dx), np = yToPrice(y+dy);
    if (nt !== null && Number.isFinite(np)) { p.time = nt; p.price = np; }
  }
}

function setAnchor(d,idx,x,y) {
  const nt = xToTime(x), np = yToPrice(y);
  if (nt !== null && Number.isFinite(np)) { d.points[idx].time = nt; d.points[idx].price = np; }
}

/* ---------- Drawing render ---------- */

function drawLabel(text,x,y,bg="#111827", color="#fff") {
  if (!text) return;
  ctx.font = "12px Inter, Arial";
  const w = ctx.measureText(text).width + 12;
  ctx.fillStyle = bg;
  ctx.fillRect(x, y-15, w, 19);
  ctx.fillStyle = color;
  ctx.fillText(text, x+6, y-2);
}

function drawLine(x1,y1,x2,y2,color="#38bdf8",width=2,dash=[]) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  ctx.restore();
}

function anchor(x,y,sel=false) {
  ctx.save();
  ctx.fillStyle = sel ? "#fff" : "#111827";
  ctx.strokeStyle = sel ? "#f59e0b" : "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x,y,5,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function lineExtent(points, d) {
  const a = pointToXY(points[0]), b = pointToXY(points[1]);
  if ([a.x,a.y,b.x,b.y].some(v => v == null)) return null;
  let x1=a.x, y1=a.y, x2=b.x, y2=b.y;
  const dx=b.x-a.x, dy=b.y-a.y;
  if ((d.settings?.extendLeft) && Math.abs(dx)>1) {
    const xl = 0;
    const yl = a.y + dy*((xl-a.x)/dx);
    x1 = xl; y1 = yl;
  }
  if ((d.type === "ray" || d.settings?.extendRight) && Math.abs(dx)>1) {
    const xr = canvas.clientWidth;
    const yr = a.y + dy*((xr-a.x)/dx);
    x2 = xr; y2 = yr;
  }
  return { x1,y1,x2,y2, ax:a.x, ay:a.y, bx:b.x, by:b.y };
}

function drawH(d,sel=false) {
  const s = d.settings;
  const y = pToY(d.points[0]);
  if (y == null) return;
  drawLine(0,y,canvas.clientWidth,y,s.color,s.width,dashFor(s.lineStyle));
  if (s.showLabels) drawLabel(`H ${fmtPrice(d.points[0].price)}`,canvas.clientWidth-105,y,s.color);
  if (sel) anchor(canvas.clientWidth/2,y,true);
}

function drawTrendLike(d,sel=false) {
  const s = d.settings;
  const ex = lineExtent(d.points, d);
  if (!ex) return;
  drawLine(ex.x1,ex.y1,ex.x2,ex.y2,s.color,s.width,dashFor(s.lineStyle));
  if (s.showLabels) drawLabel(d.type === "ray" ? "Ray" : "TL", ex.x2-42, ex.y2, "#111827");
  if (sel) { anchor(ex.ax,ex.ay,true); anchor(ex.bx,ex.by,true); }
}

function drawRect(d,sel=false) {
  const s = d.settings;
  const a=pointToXY(d.points[0]), b=pointToXY(d.points[1]);
  if ([a.x,a.y,b.x,b.y].some(v => v == null)) return;
  const x=Math.min(a.x,b.x), y=Math.min(a.y,b.y), w=Math.abs(b.x-a.x), h=Math.abs(b.y-a.y);
  ctx.save();
  ctx.fillStyle = colorWithOpacity(s.fillColor, s.fillOpacity);
  ctx.strokeStyle = s.borderColor || s.color;
  ctx.lineWidth = s.width;
  ctx.setLineDash(dashFor(s.lineStyle));
  ctx.fillRect(x,y,w,h);
  ctx.strokeRect(x,y,w,h);
  ctx.restore();
  if (sel) { anchor(a.x,a.y,true); anchor(b.x,b.y,true); }
}

function drawFib(d,sel=false) {
  const s = d.settings;
  const a=d.points[0], b=d.points[1], x1=pToX(a), x2=pToX(b);
  if (x1 == null || x2 == null) return;

  let baseLow = Math.min(a.price,b.price);
  let baseHigh = Math.max(a.price,b.price);
  if (s.reverse) {
    const tmp = baseLow;
    baseLow = baseHigh;
    baseHigh = tmp;
  }
  const span = baseHigh - baseLow;

  const leftBase = Math.min(x1,x2);
  const rightBase = Math.max(x1,x2);

  // Default: plot only from point A to point B. Extend only when user enables it.
  const left = (s.extendLines && s.extendLeft) ? 0 : leftBase;
  const right = (s.extendLines && s.extendRight) ? canvas.clientWidth : rightBase;
  const activeLevels = (s.levels || []).filter(l => l.on).sort((a,b)=>Number(a.value)-Number(b.value));

  if (s.background && activeLevels.length > 1) {
    for (let i=0; i<activeLevels.length-1; i++) {
      const l1 = activeLevels[i], l2 = activeLevels[i+1];
      const y1 = pToY({ price: baseLow + span*Number(l1.value) });
      const y2 = pToY({ price: baseLow + span*Number(l2.value) });
      if (y1 != null && y2 != null) {
        ctx.fillStyle = colorWithOpacity(l2.color || s.color, s.fillOpacity || 6);
        ctx.fillRect(left, Math.min(y1,y2), right-left, Math.abs(y2-y1));
      }
    }
  }

  for (const lev of activeLevels) {
    const v = Number(lev.value);
    const price = baseLow + span*v;
    const y = pToY({ price });
    if (y == null) continue;
    const c = lev.color || s.color;
    drawLine(left,y,right,y,c,Number(lev.width || s.width || 1),dashFor(lev.lineStyle || s.lineStyle));

    if (s.showLabels) {
      const parts = [];
      if (s.showLevelLabel && lev.label) parts.push(lev.label);
      if (s.showLevelValue) parts.push(String(v));
      if (s.showLevelPrice) parts.push(fmtPrice(price));
      const text = parts.join("  ");
      const lx = s.labelSide === "left" ? left + 4 : right - Math.min(190, Math.max(120, text.length * 7));
      drawLabel(text,lx,y,s.showLevelColorLabels === false ? "#111827" : c,s.textColor || "#fff");
    }
  }

  if (sel) { anchor(pToX(a),pToY(a),true); anchor(pToX(b),pToY(b),true); }
}

function drawRR(d,sel=false) {
  const s = d.settings;
  const [entry,target,stop] = d.points;
  const xe=pToX(entry), xt=pToX(target), xs=pToX(stop), ye=pToY(entry), yt=pToY(target), ys=pToY(stop);
  if ([xe,xt,xs,ye,yt,ys].some(v => v == null)) return;

  const mode = s.mode === "short" ? "short" : "long";
  const profitColor=s.profitColor || "#22c55e", lossColor=s.lossColor || "#ef4444";
  const left=Math.min(xe,xt,xs);
  const right=Math.max(xe,xt,xs)+90;
  const w=right-left;

  ctx.save();
  ctx.fillStyle=colorWithOpacity(profitColor,s.fillOpacity);
  ctx.fillRect(left,Math.min(ye,yt),w,Math.abs(yt-ye));
  ctx.fillStyle=colorWithOpacity(lossColor,s.fillOpacity);
  ctx.fillRect(left,Math.min(ye,ys),w,Math.abs(ys-ye));

  ctx.lineWidth=s.width;
  ctx.setLineDash(dashFor(s.lineStyle));
  ctx.strokeStyle=profitColor;
  ctx.strokeRect(left,Math.min(ye,yt),w,Math.abs(yt-ye));
  ctx.strokeStyle=lossColor;
  ctx.strokeRect(left,Math.min(ye,ys),w,Math.abs(ys-ye));

  drawLine(left,ye,right,ye,"#f8fafc",1,[4,4]);
  drawLine(left,yt,right,yt,profitColor,1,[]);
  drawLine(left,ys,right,ys,lossColor,1,[]);
  ctx.restore();

  const risk=Math.abs(entry.price-stop.price);
  const reward=Math.abs(target.price-entry.price);
  const rr=risk>0?(reward/risk).toFixed(2):"—";
  const riskPct=s.showRiskPercent && s.accountSize ? ` | Risk ${s.riskPercent || 1}%` : "";

  if (s.showLabels) {
    drawLabel(`${mode.toUpperCase()} Entry ${fmtPrice(entry.price)}`,right-185,ye,"#111827");
    drawLabel(`Target ${fmtPrice(target.price)}${s.showRR ? " | RR "+rr : ""}`,right-190,yt,"#15803d");
    drawLabel(`Stop ${fmtPrice(stop.price)}${riskPct}`,right-150,ys,"#991b1b");
  }
  if (sel) {
    anchor(xe,ye,true);
    anchor(xt,yt,true);
    anchor(xs,ys,true);
  }
}

function drawOne(d,temp=false) {
  normalizeDrawing(d);
  if (d.hidden) return;
  const sel = !temp && d.id === selectedId;
  if (d.type === "hline") drawH(d,sel);
  if (d.type === "trend" || d.type === "ray") drawTrendLike(d,sel);
  if (d.type === "rect") drawRect(d,sel);
  if (d.type === "fib") drawFib(d,sel);
  if (d.type === "rr") drawRR(d,sel);
}

function drawOverlay() {
  ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
  drawings.forEach(d => drawOne(d));
  if (!["cursor","edit"].includes(activeTool) && pendingPoints.length && hoverPoint) {
    const temp = normalizeDrawing({ type: activeTool, points: [...pendingPoints,{time:hoverPoint.time,price:hoverPoint.price}], settings: defaultStyle(activeTool), hidden:false, locked:false });
    drawOne(temp,true);
  }
  updateSelectionToolbar();
}


/* ---------- Tool templates ---------- */

function templateStoreKey(toolType) {
  return `whalex_tool_templates_v215_${toolType}`;
}

function templateDefaultKey(toolType) {
  return `whalex_tool_default_template_v215_${toolType}`;
}

function loadTemplates(toolType) {
  try {
    return JSON.parse(localStorage.getItem(templateStoreKey(toolType)) || "{}");
  } catch (e) {
    return {};
  }
}

function saveTemplates(toolType, templates) {
  localStorage.setItem(templateStoreKey(toolType), JSON.stringify(templates || {}));
}

function cloneSettings(settings) {
  return JSON.parse(JSON.stringify(settings || {}));
}

function getDefaultTemplateName(toolType) {
  return localStorage.getItem(templateDefaultKey(toolType)) || "";
}

function setDefaultTemplateName(toolType, name) {
  if (name) localStorage.setItem(templateDefaultKey(toolType), name);
  else localStorage.removeItem(templateDefaultKey(toolType));
}

function applyDefaultTemplateToDrawing(d) {
  const templates = loadTemplates(d.type);
  const def = getDefaultTemplateName(d.type);
  if (def && templates[def]) {
    d.settings = { ...defaultStyle(d.type), ...cloneSettings(templates[def]) };
    if (d.type === "fib" && templates[def].levels) d.settings.levels = cloneSettings(templates[def].levels);
  }
  normalizeDrawing(d);
  return d;
}

function refreshTemplateSelect() {
  const d = selectedDrawing();
  if (!d || !els.templateSelect) return;

  const templates = loadTemplates(d.type);
  const names = Object.keys(templates).sort();
  const def = getDefaultTemplateName(d.type);

  els.templateSelect.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = names.length ? "Select template" : "No saved templates";
  els.templateSelect.appendChild(empty);

  names.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name === def ? `${name}  ★ Default` : name;
    els.templateSelect.appendChild(opt);
  });

  if (els.templateNote) {
    els.templateNote.textContent = `Saved templates for ${d.type.toUpperCase()}: ${names.length}${def ? ` · Default: ${def}` : ""}`;
  }
}

function saveCurrentAsTemplate() {
  const d = selectedDrawing();
  if (!d) { toast("Select a drawing first"); return; }
  applySettingsFromModal();
  normalizeDrawing(d);

  const name = (els.templateName?.value || "").trim();
  if (!name) { toast("Enter template name"); return; }

  const templates = loadTemplates(d.type);
  templates[name] = cloneSettings(d.settings);
  saveTemplates(d.type, templates);
  refreshTemplateSelect();
  if (els.templateSelect) els.templateSelect.value = name;
  toast(`${d.type.toUpperCase()} template saved`);
}

function applySelectedTemplate() {
  const d = selectedDrawing();
  if (!d) { toast("Select a drawing first"); return; }
  const name = els.templateSelect?.value;
  if (!name) { toast("Select a template"); return; }

  const templates = loadTemplates(d.type);
  if (!templates[name]) { toast("Template not found"); return; }

  d.settings = { ...defaultStyle(d.type), ...cloneSettings(templates[name]) };
  if (d.type === "fib" && templates[name].levels) d.settings.levels = cloneSettings(templates[name].levels);
  normalizeDrawing(d);
  saveDrawings();
  renderDrawingSettings();
  refreshTemplateSelect();
  drawOverlay();
  toast(`${name} applied`);
}

function setSelectedTemplateAsDefault() {
  const d = selectedDrawing();
  if (!d) { toast("Select a drawing first"); return; }
  const name = els.templateSelect?.value;
  if (!name) { toast("Select a template"); return; }
  setDefaultTemplateName(d.type, name);
  refreshTemplateSelect();
  toast(`${name} set as default for ${d.type.toUpperCase()}`);
}

function deleteSelectedTemplate() {
  const d = selectedDrawing();
  if (!d) { toast("Select a drawing first"); return; }
  const name = els.templateSelect?.value;
  if (!name) { toast("Select a template"); return; }

  const templates = loadTemplates(d.type);
  delete templates[name];
  saveTemplates(d.type, templates);

  if (getDefaultTemplateName(d.type) === name) setDefaultTemplateName(d.type, "");
  if (els.templateSelect) els.templateSelect.value = "";
  refreshTemplateSelect();
  toast(`${name} template deleted`);
}


/* ---------- Drawing settings modal ---------- */

function settingRow(label, html) {
  return `<div class="setting-row"><label>${label}</label><div>${html}</div></div>`;
}

function getSettingValue(path) {
  const d = selectedDrawing();
  if (!d) return "";
  return path.split(".").reduce((o,k) => o?.[k], d.settings);
}

function renderDrawingSettings() {
  const d = selectedDrawing();
  if (!d || !els.settingsBody) return;
  normalizeDrawing(d);
  const s = d.settings;
  els.drawingSettingsTitle.textContent = `${objectName(d)} Settings`;
  document.querySelector(".tool-settings-card")?.classList.toggle("fib-open", d.type === "fib");

  let html = "";

  if (activeSettingsTab === "style") {
    html += `<div class="setting-section-title">Line / Appearance</div>`;
    html += settingRow("Color", `<input data-set="color" type="color" value="${s.color || "#38bdf8"}">`);
    html += settingRow("Line width", `<input data-set="width" type="number" min="1" max="8" value="${s.width || 2}">`);
    html += settingRow("Line style", `<select data-set="lineStyle"><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select>`);

    if (["trend","ray","hline"].includes(d.type)) {
      html += settingRow("Extend left", `<input data-set="extendLeft" type="checkbox" ${s.extendLeft ? "checked" : ""}>`);
      html += settingRow("Extend right", `<input data-set="extendRight" type="checkbox" ${s.extendRight ? "checked" : ""}>`);
      html += settingRow("Show labels", `<input data-set="showLabels" type="checkbox" ${s.showLabels ? "checked" : ""}>`);
      html += settingRow("Show price", `<input data-set="showPrice" type="checkbox" ${s.showPrice ? "checked" : ""}>`);
    }

    if (d.type === "rect") {
      html += settingRow("Fill color", `<input data-set="fillColor" type="color" value="${s.fillColor || "#f59e0b"}">`);
      html += settingRow("Fill opacity", `<input data-set="fillOpacity" type="number" min="0" max="80" value="${s.fillOpacity ?? 14}">`);
      html += settingRow("Border color", `<input data-set="borderColor" type="color" value="${s.borderColor || s.color || "#f59e0b"}">`);
      html += settingRow("Show labels", `<input data-set="showLabels" type="checkbox" ${s.showLabels ? "checked" : ""}>`);
    }

    if (d.type === "fib") {
      html += `<div class="setting-section-title">Fib Global Options</div>`;
      html += settingRow("Text color", `<input data-set="textColor" type="color" value="${s.textColor || "#ffffff"}">`);
      html += settingRow("Font size", `<input data-set="fontSize" type="number" min="8" max="22" value="${s.fontSize || 12}">`);
      html += settingRow("Reverse Fib", `<input data-set="reverse" type="checkbox" ${s.reverse ? "checked" : ""}>`);
      html += settingRow("Background", `<input data-set="background" type="checkbox" ${s.background ? "checked" : ""}>`);
      html += settingRow("Fill opacity", `<input data-set="fillOpacity" type="number" min="0" max="50" value="${s.fillOpacity ?? 6}">`);
      html += settingRow("Extend beyond A-B", `<input data-set="extendLines" type="checkbox" ${s.extendLines ? "checked" : ""}>`);
      html += settingRow("Extend left", `<input data-set="extendLeft" type="checkbox" ${s.extendLeft ? "checked" : ""}>`);
      html += settingRow("Extend right", `<input data-set="extendRight" type="checkbox" ${s.extendRight ? "checked" : ""}>`);
      html += settingRow("Label side", `<select data-set="labelSide"><option value="right">Right</option><option value="left">Left</option></select>`);
      html += settingRow("Show labels", `<input data-set="showLabels" type="checkbox" ${s.showLabels ? "checked" : ""}>`);
      html += settingRow("Show level value", `<input data-set="showLevelValue" type="checkbox" ${s.showLevelValue ? "checked" : ""}>`);
      html += settingRow("Show price", `<input data-set="showLevelPrice" type="checkbox" ${s.showLevelPrice ? "checked" : ""}>`);
      html += settingRow("Show custom text", `<input data-set="showLevelLabel" type="checkbox" ${s.showLevelLabel ? "checked" : ""}>`);

      html += `<div class="setting-section-title">Fib Levels</div>`;
      html += `<div class="fib-level-grid">
        <div class="fib-level-head"><span>On</span><span>Value</span><span>Label</span><span>Color</span><span>Style</span><span>Width</span><span>Del</span></div>`;
      (s.levels || []).forEach((l, i) => {
        html += `<div class="fib-level-row">
          <input data-level="${i}" data-field="on" type="checkbox" ${l.on ? "checked" : ""}>
          <input data-level="${i}" data-field="value" type="number" step="0.001" value="${l.value}">
          <input data-level="${i}" data-field="label" type="text" value="${l.label}">
          <input data-level="${i}" data-field="color" type="color" value="${l.color || s.color || "#a78bfa"}">
          <select data-level="${i}" data-field="lineStyle">
            <option value="solid">Solid</option>
            <option value="dashed">Dash</option>
            <option value="dotted">Dot</option>
          </select>
          <input data-level="${i}" data-field="width" type="number" min="1" max="5" value="${l.width || 1}">
          <input data-level="${i}" data-field="delete" type="checkbox" title="Delete this level">
        </div>`;
      });
      html += `</div>`;
    }

    if (d.type === "rr") {
      html += settingRow("Position type", `<select data-set="mode"><option value="long">Long</option><option value="short">Short</option></select>`);
      html += settingRow("Profit color", `<input data-set="profitColor" type="color" value="${s.profitColor || "#22c55e"}">`);
      html += settingRow("Loss color", `<input data-set="lossColor" type="color" value="${s.lossColor || "#ef4444"}">`);
      html += settingRow("Fill opacity", `<input data-set="fillOpacity" type="number" min="0" max="60" value="${s.fillOpacity ?? 16}">`);
      html += settingRow("Show RR", `<input data-set="showRR" type="checkbox" ${s.showRR ? "checked" : ""}>`);
      html += settingRow("Show labels", `<input data-set="showLabels" type="checkbox" ${s.showLabels ? "checked" : ""}>`);
    }
  }

  if (activeSettingsTab === "text") {
    html += settingRow("Show labels", `<input data-set="showLabels" type="checkbox" ${s.showLabels ? "checked" : ""}>`);
    html += settingRow("Show price", `<input data-set="showPrice" type="checkbox" ${s.showPrice ? "checked" : ""}>`);
    html += settingRow("Show value", `<input data-set="showValue" type="checkbox" ${s.showValue ? "checked" : ""}>`);
    html += settingRow("Text color", `<input data-set="textColor" type="color" value="${s.textColor || "#ffffff"}">`);
    html += settingRow("Font size", `<input data-set="fontSize" type="number" min="8" max="22" value="${s.fontSize || 12}">`);
    if (d.type === "rr") {
      html += settingRow("Account size", `<input data-set="accountSize" type="number" value="${s.accountSize || 10000}">`);
      html += settingRow("Risk %", `<input data-set="riskPercent" type="number" step="0.1" value="${s.riskPercent || 1}">`);
    }
  }

  if (activeSettingsTab === "coords") {
    d.points.forEach((p, i) => {
      html += settingRow(`Point ${i+1} price`, `<input data-point="${i}" data-field="price" type="number" step="0.1" value="${Number(p.price).toFixed(2)}">`);
    });
  }

  els.settingsBody.innerHTML = html;

  els.settingsBody.querySelectorAll("select[data-set]").forEach(sel => {
    const val = s[sel.dataset.set];
    if (val !== undefined) sel.value = val;
  });
  els.settingsBody.querySelectorAll("select[data-level]").forEach(sel => {
    const idx = Number(sel.dataset.level);
    const field = sel.dataset.field;
    const val = s.levels?.[idx]?.[field];
    if (val !== undefined) sel.value = val;
  });

  bindLiveSettingsEvents();
}

function applySettingsFromModal() {
  const d = selectedDrawing();
  if (!d || !els.settingsBody) return;
  normalizeDrawing(d);

  els.settingsBody.querySelectorAll("[data-set]").forEach(input => {
    const key = input.dataset.set;
    if (input.type === "checkbox") d.settings[key] = input.checked;
    else if (input.type === "number") d.settings[key] = Number(input.value);
    else d.settings[key] = input.value;
  });

  const deleteLevels = new Set();
  els.settingsBody.querySelectorAll("[data-level]").forEach(input => {
    const idx = Number(input.dataset.level);
    const field = input.dataset.field;
    if (!d.settings.levels[idx]) return;
    if (field === "delete") {
      if (input.checked) deleteLevels.add(idx);
      return;
    }
    if (input.type === "checkbox") d.settings.levels[idx][field] = input.checked;
    else if (input.type === "number") d.settings.levels[idx][field] = Number(input.value);
    else d.settings.levels[idx][field] = input.value;
  });
  if (deleteLevels.size) {
    d.settings.levels = d.settings.levels.filter((_, i) => !deleteLevels.has(i));
  }

  els.settingsBody.querySelectorAll("[data-point]").forEach(input => {
    const idx = Number(input.dataset.point);
    const field = input.dataset.field;
    if (!d.points[idx]) return;
    if (field === "price") d.points[idx].price = Number(input.value);
  });

  saveDrawings();
  drawOverlay();
}

function bindLiveSettingsEvents() {
  if (!els.settingsBody) return;
  els.settingsBody.querySelectorAll("input, select").forEach(el => {
    const evt = (el.type === "text" || el.type === "number") ? "input" : "change";
    el.addEventListener(evt, () => {
      applySettingsFromModal();
      drawOverlay();
      renderObjectTree();
    });
  });
}

function openDrawingSettings() {
  hideToolbarPopovers();
  const d = selectedDrawing();
  if (!d) { toast("Select a drawing first"); return; }
  normalizeDrawing(d);
  activeSettingsTab = "style";
  document.querySelectorAll(".settings-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === activeSettingsTab));
  if (els.templateName) els.templateName.value = "";
  renderDrawingSettings();
  refreshTemplateSelect();
  els.drawingSettingsModal.classList.remove("hidden");
}

function resetSelectedDrawingSettings() {
  const d = selectedDrawing();
  if (!d) return;
  d.settings = defaultStyle(d.type);
  saveDrawings();
  renderDrawingSettings();
  refreshTemplateSelect();
  drawOverlay();
}

/* ---------- Canvas events ---------- */

let suppressNextPositionClick = false;

function isPositionTool(t = activeTool) {
  return t === "longpos" || t === "shortpos";
}

function placePositionOneClick(e) {
  if (!isPositionTool()) return false;

  const toolBefore = activeTool;
  const p = xyToPoint(e);
  if (!p) {
    toast("Chart not ready for position tool. Press R and try again.");
    return true;
  }

  addDrawing([{ time:p.time, price:p.price, x:p.x, y:p.y }]);
  setTool("edit");
  toast(`${toolBefore === "shortpos" ? "Short" : "Long"} Position plotted in one click at 1:1. Drag Entry/Target/Stop to adjust.`);
  suppressNextPositionClick = true;
  return true;
}

// v2.22: Force Long/Short to plot on pointerdown, not after a multi-click flow.
canvas.addEventListener("pointerdown", e => {
  if (isPositionTool()) {
    const done = placePositionOneClick(e);
    if (done) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}, true);


canvas.addEventListener("mousedown", e => {
  const p = xyToPoint(e);
  if (!p) return;
  if (activeTool === "edit") {
    const h = hitTest(p.x,p.y);
    if (h) {
      selectedId = h.d.id;
      if (h.d.locked) {
        toast("Drawing is locked");
        renderObjectTree();
        drawOverlay();
        return;
      }
      dragMode = { id:h.d.id, kind:h.hit.kind, idx:h.hit.idx };
      dragStart = { x:p.x, y:p.y, orig:JSON.parse(JSON.stringify(h.d.points)) };
      renderObjectTree();
      drawOverlay();
    } else {
      selectedId = null;
      renderObjectTree();
      drawOverlay();
    }
  }
});

canvas.addEventListener("mousemove", e => {
  const p = xyToPoint(e);
  if (!p) return;

  if (activeTool === "edit" && dragMode) {
    canvas.classList.add("dragging");
    const d = drawings.find(x => x.id === dragMode.id);
    if (!d) return;
    if (dragMode.kind === "anchor") setAnchor(d,dragMode.idx,p.x,p.y);
    else {
      d.points = JSON.parse(JSON.stringify(dragStart.orig));
      moveDrawing(d,p.x-dragStart.x,p.y-dragStart.y);
    }
    drawOverlay();
    return;
  }

  if (!["cursor","edit"].includes(activeTool)) {
    hoverPoint = p;
    drawOverlay();
  } else if (activeTool === "edit") {
    const h = hitTest(p.x,p.y);
    canvas.classList.toggle("anchor-hover", !!h && h.hit.kind === "anchor");
    canvas.classList.toggle("move-hover", !!h && h.hit.kind !== "anchor");
    canvas.style.cursor = h ? (h.hit.kind === "anchor" ? "grab" : "move") : "default";
  }
});

window.addEventListener("mouseup", () => {
  canvas.classList.remove("dragging", "anchor-hover", "move-hover");
  if (dragMode) {
    canvas.classList.remove("dragging");
    saveDrawings();
    dragMode = null;
    dragStart = null;
    toast("Drawing updated");
  }
});

canvas.addEventListener("click", e => {
  if (suppressNextPositionClick) {
    suppressNextPositionClick = false;
    return;
  }

  if (activeTool === "cursor" || activeTool === "edit") return;

  // Safety fallback: if pointerdown was blocked by browser, click still plots Long/Short immediately.
  if (isPositionTool()) {
    placePositionOneClick(e);
    return;
  }

  const p = xyToPoint(e);
  if (!p) {
    toast("Chart not ready for drawing. Press R, then try again.");
    return;
  }

  pendingPoints.push({ time:p.time, price:p.price, x:p.x, y:p.y });

  if (pendingPoints.length >= neededPoints(activeTool)) {
    addDrawing([...pendingPoints]);
    setTool("edit");
    toast("Drawing added. Drag anchors or open Settings.");
  } else {
    toast(`${activeTool.toUpperCase()}: click point ${pendingPoints.length + 1} of ${neededPoints(activeTool)}`);
  }
  drawOverlay();
});

canvas.addEventListener("mouseleave", () => {
  hoverPoint = null;
  canvas.classList.remove("anchor-hover", "move-hover");
  if (!dragMode) drawOverlay();
});


canvas.addEventListener("dblclick", e => {
  const p = xyToPoint(e);
  if (!p) return;
  const h = hitTest(p.x, p.y);
  if (h) {
    selectedId = h.d.id;
    setTool("edit");
    renderObjectTree();
    drawOverlay();
    openDrawingSettings();
  }
});



/* ---------- Indicator foundation ---------- */

const INDICATOR_LIBRARY = [
  { kind:"ma", group:"Technicals", tab:"technical", title:"Moving Average", sub:"EMA/SMA/WMA/SMMA/VWMA with editable length, source, offset", icon:"MA" },
  { kind:"vwap", group:"Technicals", tab:"technical", title:"VWAP", sub:"Session/Week/Month VWAP with optional bands", icon:"VW" },
  { kind:"volume", group:"Technicals", tab:"technical", title:"Volume", sub:"Histogram with Volume MA smoothing", icon:"VOL" },
  { kind:"rsi", group:"Technicals", tab:"technical", title:"Relative Strength Index", sub:"RSI with smoothing MA and editable bands", icon:"RSI" },
  { kind:"whaleLiquidity", group:"WhaleX", tab:"whalex", title:"WhaleX Liquidity Lines", sub:"Live order-book liquidity lines", icon:"WX" },
  { kind:"orderflowFoundation", group:"WhaleX", tab:"whalex", title:"WhaleX Orderflow Foundation", sub:"POC/LVN/HVN foundation placeholder", icon:"OF" }
];

let indicatorLibraryTab = "all";
let activeIndicatorTarget = null;
let activeIndicatorSettingsTab = "inputs";
let indicatorSettingsDraft = null;

function indicatorSettingsKey() {
  return "whalex_indicator_settings_v340";
}

function indicatorFavoritesKey() {
  return "whalex_indicator_favorites_v340";
}

function defaultIndicatorSettings() {
  return {
    ma: [],
    vwap:{
      enabled:false,
      visible:true,
      source:"hlc3",
      color:"#eab308",
      width:2,
      anchor:"session",
      offset:0,
      showBand1:false,
      showBand2:false,
      showBand3:false,
      bandMode:"stdev",
      band1Mult:1,
      band2Mult:2,
      band3Mult:3,
      bandColor:"#93c5fd",
      bandWidth:1
    },
    volume:{
      enabled:false,
      visible:true,
      upColor:"#22c55e",
      downColor:"#ef4444",
      opacity:28,
      showMA:false,
      maType:"SMA",
      maLength:20,
      maColor:"#f59e0b",
      maWidth:2
    },
    rsi:{
      enabled:false,
      visible:true,
      length:14,
      source:"close",
      upper:70,
      middle:50,
      lower:30,
      color:"#d6a93d",
      maType:"SMA",
      maLength:14,
      showMA:false,
      maColor:"#a78bfa",
      bbStdDev:2,
      showBB:false,
      upperColor:"#94a3b8",
      middleColor:"#64748b",
      lowerColor:"#94a3b8"
    },
    whaleLiquidity:true,
    orderflowFoundation:false
  };
}

function defaultMAConfig() {
  return {
    enabled:true,
    visible:true,
    type:"EMA",
    length:9,
    source:"close",
    color:["#38bdf8","#a78bfa","#f59e0b","#ef4444","#22c55e"][indicatorSettings.ma.length % 5],
    width:2,
    offset:0
  };
}

function normalizeIndicatorSettings(s) {
  const d = defaultIndicatorSettings();
  s = s || {};

  let volume = typeof s.volume === "boolean"
    ? { ...d.volume, enabled:s.volume }
    : { ...d.volume, ...(s.volume || {}) };

  return {
    ma: Array.isArray(s.ma) ? s.ma.map(x => ({
      enabled: x.enabled !== false,
      visible: x.visible !== false,
      type: x.type || "EMA",
      length: Math.max(1, Number(x.length || 9)),
      source: x.source || "close",
      color: x.color || "#38bdf8",
      width: Math.max(1, Number(x.width || 2)),
      offset: Number(x.offset || 0)
    })) : [],
    vwap: { ...d.vwap, ...(s.vwap || {}) },
    volume: {
      ...d.volume,
      ...volume,
      maLength: Math.max(1, Number(volume.maLength || 20)),
      maWidth: Math.max(1, Number(volume.maWidth || 2)),
      opacity: Math.max(5, Math.min(100, Number(volume.opacity || 28)))
    },
    rsi: {
      ...d.rsi,
      ...(s.rsi || {}),
      length: Math.max(1, Number((s.rsi || {}).length || 14)),
      maLength: Math.max(1, Number((s.rsi || {}).maLength || 14))
    },
    whaleLiquidity: s.whaleLiquidity !== false,
    orderflowFoundation: !!s.orderflowFoundation
  };
}

function loadIndicatorSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(indicatorSettingsKey()) || "null");
    indicatorSettings = normalizeIndicatorSettings(saved);
  } catch(e) {
    indicatorSettings = defaultIndicatorSettings();
  }
  updateIndicatorLegend();
}

function saveIndicatorSettings() {
  localStorage.setItem(indicatorSettingsKey(), JSON.stringify(indicatorSettings));
}

function getIndicatorFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem(indicatorFavoritesKey()) || "[]")); }
  catch(e) { return new Set(); }
}

function saveIndicatorFavorites(set) {
  localStorage.setItem(indicatorFavoritesKey(), JSON.stringify([...set]));
}

function openIndicatorModal() {
  loadIndicatorSettings();
  indicatorLibraryTab = "all";
  const search = document.getElementById("indicatorSearchInput");
  if (search) search.value = "";
  document.querySelectorAll(".tv-indicator-tab").forEach(b => b.classList.toggle("active", b.dataset.libraryTab === "all"));
  renderIndicatorLibrary();
  document.getElementById("indicatorModal")?.classList.remove("hidden");
  setTimeout(() => document.getElementById("indicatorSearchInput")?.focus(), 60);
}

function closeIndicatorModal() {
  document.getElementById("indicatorModal")?.classList.add("hidden");
}

function renderIndicatorLibrary() {
  const list = document.getElementById("indicatorLibraryList");
  if (!list) return;
  const q = (document.getElementById("indicatorSearchInput")?.value || "").toLowerCase().trim();
  const favs = getIndicatorFavorites();

  const items = INDICATOR_LIBRARY.filter(x => {
    if (indicatorLibraryTab === "favorites" && !favs.has(x.kind)) return false;
    if (indicatorLibraryTab !== "all" && indicatorLibraryTab !== "favorites" && x.tab !== indicatorLibraryTab) return false;
    if (q && !(x.title.toLowerCase().includes(q) || x.sub.toLowerCase().includes(q) || x.kind.toLowerCase().includes(q))) return false;
    return true;
  });

  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `<div class="tv-indicator-section-title">No indicators found</div>`;
    return;
  }

  let lastGroup = "";
  items.forEach(item => {
    if (item.group !== lastGroup) {
      const h = document.createElement("div");
      h.className = "tv-indicator-section-title";
      h.textContent = item.group;
      list.appendChild(h);
      lastGroup = item.group;
    }

    const btn = document.createElement("button");
    btn.className = "tv-indicator-item";
    btn.innerHTML = `
      <span class="tv-indicator-item-icon">${item.icon}</span>
      <span>
        <div class="tv-indicator-item-title">${item.title}</div>
        <div class="tv-indicator-item-sub">${item.sub}</div>
      </span>
      <span class="tv-indicator-star ${favs.has(item.kind) ? "active" : ""}" title="Favorite">★</span>
    `;
    btn.onclick = (e) => {
      if (e.target.classList.contains("tv-indicator-star")) {
        const f = getIndicatorFavorites();
        if (f.has(item.kind)) f.delete(item.kind); else f.add(item.kind);
        saveIndicatorFavorites(f);
        renderIndicatorLibrary();
        e.stopPropagation();
        return;
      }
      addIndicator(item.kind);
    };
    list.appendChild(btn);
  });
}

function addIndicator(kind) {
  loadIndicatorSettings();

  if (kind === "ma") indicatorSettings.ma.push(defaultMAConfig());
  if (kind === "vwap") indicatorSettings.vwap.enabled = true;
  if (kind === "volume") indicatorSettings.volume = { ...indicatorSettings.volume, enabled:true, visible:true };
  if (kind === "rsi") indicatorSettings.rsi = { ...indicatorSettings.rsi, enabled:true, visible:true };
  if (kind === "whaleLiquidity") indicatorSettings.whaleLiquidity = true;
  if (kind === "orderflowFoundation") indicatorSettings.orderflowFoundation = true;

  indicatorSettings = normalizeIndicatorSettings(indicatorSettings);
  saveIndicatorSettings();
  redrawIndicators();
  redrawLiquidity();
  updateIndicatorLegend();
  closeIndicatorModal();
  toast(`${libraryTitle(kind)} added`);
}

function libraryTitle(kind) {
  return INDICATOR_LIBRARY.find(x => x.kind === kind)?.title || kind;
}

function indicatorDisplayName(kind, idx=null) {
  if (kind === "ma") {
    const cfg = indicatorSettings.ma[idx];
    return `${cfg.type} ${cfg.length} ${sourceLabel(cfg.source)}`;
  }
  if (kind === "vwap") return `VWAP ${sourceLabel(indicatorSettings.vwap.source)}`;
  if (kind === "volume") return indicatorSettings.volume.showMA ? `Volume + ${indicatorSettings.volume.maType} ${indicatorSettings.volume.maLength}` : "Volume";
  if (kind === "rsi") return `RSI ${indicatorSettings.rsi.length}`;
  if (kind === "whaleLiquidity") return "WhaleX Liquidity";
  if (kind === "orderflowFoundation") return "WhaleX Orderflow";
  return kind;
}

function sourceLabel(src) {
  return ({close:"close", open:"open", high:"high", low:"low", hl2:"HL2", hlc3:"HLC3", ohlc4:"OHLC4"}[src] || src || "close");
}

function activeIndicators() {
  const out = [];
  indicatorSettings.ma.forEach((cfg, idx) => {
    if (cfg.enabled) out.push({ kind:"ma", idx, visible:cfg.visible !== false, color:cfg.color });
  });
  if (indicatorSettings.vwap.enabled) out.push({ kind:"vwap", visible:indicatorSettings.vwap.visible !== false, color:indicatorSettings.vwap.color });
  if (indicatorSettings.volume.enabled) out.push({ kind:"volume", visible:indicatorSettings.volume.visible !== false, color:indicatorSettings.volume.maColor });
  if (indicatorSettings.rsi.enabled) out.push({ kind:"rsi", visible:indicatorSettings.rsi.visible !== false, color:indicatorSettings.rsi.color });
  if (indicatorSettings.whaleLiquidity) out.push({ kind:"whaleLiquidity", visible:true, color:"#22c55e" });
  if (indicatorSettings.orderflowFoundation) out.push({ kind:"orderflowFoundation", visible:true, color:"#d6a93d" });
  return out;
}

function updateIndicatorLegend() {
  if (!indicatorLegend) return;
  indicatorLegend.innerHTML = "";
  activeIndicators().forEach(item => {
    const row = document.createElement("div");
    row.className = "indicator-legend-row";
    const visibleIcon = item.visible ? "👁" : "🙈";
    row.innerHTML = `
      <button class="indicator-legend-btn" data-act="toggle">${visibleIcon}</button>
      <span class="indicator-legend-name" style="color:${item.color || "#cbd5e1"}">${indicatorDisplayName(item.kind,item.idx)}</span>
      <button class="indicator-legend-btn" data-act="settings">⚙</button>
      <button class="indicator-legend-btn" data-act="remove">×</button>
    `;
    row.querySelector('[data-act="toggle"]').onclick = () => toggleIndicatorVisibility(item.kind,item.idx);
    row.querySelector('[data-act="settings"]').onclick = () => openIndicatorSettings(item.kind,item.idx);
    row.querySelector('[data-act="remove"]').onclick = () => removeIndicator(item.kind,item.idx);
    indicatorLegend.appendChild(row);
  });
}

function toggleIndicatorVisibility(kind, idx=null) {
  if (kind === "ma") indicatorSettings.ma[idx].visible = indicatorSettings.ma[idx].visible === false;
  if (kind === "vwap") indicatorSettings.vwap.visible = indicatorSettings.vwap.visible === false;
  if (kind === "volume") indicatorSettings.volume.visible = indicatorSettings.volume.visible === false;
  if (kind === "rsi") indicatorSettings.rsi.visible = indicatorSettings.rsi.visible === false;
  saveIndicatorSettings();
  redrawIndicators();
  updateIndicatorLegend();
}

function removeIndicator(kind, idx=null) {
  if (kind === "ma") indicatorSettings.ma.splice(idx,1);
  if (kind === "vwap") indicatorSettings.vwap.enabled = false;
  if (kind === "volume") indicatorSettings.volume.enabled = false;
  if (kind === "rsi") indicatorSettings.rsi.enabled = false;
  if (kind === "whaleLiquidity") indicatorSettings.whaleLiquidity = false;
  if (kind === "orderflowFoundation") indicatorSettings.orderflowFoundation = false;
  saveIndicatorSettings();
  redrawIndicators();
  redrawLiquidity();
  updateIndicatorLegend();
}

function cloneIndicatorConfig(kind, idx=null) {
  if (kind === "ma") return JSON.parse(JSON.stringify(indicatorSettings.ma[idx]));
  if (kind === "vwap") return JSON.parse(JSON.stringify(indicatorSettings.vwap));
  if (kind === "volume") return JSON.parse(JSON.stringify(indicatorSettings.volume));
  if (kind === "rsi") return JSON.parse(JSON.stringify(indicatorSettings.rsi));
  if (kind === "whaleLiquidity") return { enabled:indicatorSettings.whaleLiquidity };
  if (kind === "orderflowFoundation") return { enabled:indicatorSettings.orderflowFoundation };
  return {};
}

function openIndicatorSettings(kind, idx=null) {
  activeIndicatorTarget = { kind, idx };
  indicatorSettingsDraft = cloneIndicatorConfig(kind,idx);
  activeIndicatorSettingsTab = "inputs";
  document.getElementById("indicatorSettingsTitle").textContent = indicatorDisplayName(kind,idx) + " Settings";
  document.querySelectorAll(".tv-settings-tab").forEach(b => b.classList.toggle("active", b.dataset.indicatorSettingsTab === "inputs"));
  renderIndicatorSettingsBody();
  document.getElementById("indicatorSettingsModal")?.classList.remove("hidden");
}

function closeIndicatorSettingsModal() {
  document.getElementById("indicatorSettingsModal")?.classList.add("hidden");
  indicatorSettingsDraft = null;
  activeIndicatorTarget = null;
}

function settingRow(label, inputHtml, note="") {
  return `<div class="tv-setting-row compact"><label>${label}${note ? `<small>${note}</small>` : ""}</label><div>${inputHtml}</div></div>`;
}

function settingSubtitle(text) {
  return `<div class="tv-settings-subtitle">${text}</div>`;
}

function renderIndicatorSettingsBody() {
  const body = document.getElementById("indicatorSettingsBody");
  if (!body || !activeIndicatorTarget || !indicatorSettingsDraft) return;
  const { kind } = activeIndicatorTarget;
  const cfg = indicatorSettingsDraft;
  const tab = activeIndicatorSettingsTab;
  let html = "";

  if (kind === "ma") {
    if (tab === "inputs") {
      html += settingSubtitle("Inputs");
      html += settingRow("Type", maTypeSelect(cfg.type, false));
      html += settingRow("Length", `<input data-field="length" type="number" min="1" max="1000" value="${cfg.length || 9}">`);
      html += settingRow("Source", sourceSelect(cfg.source));
      html += settingRow("Offset", `<input data-field="offset" type="number" min="-500" max="500" value="${cfg.offset || 0}">`);
    }
    if (tab === "style") {
      html += settingSubtitle("Style");
      html += settingRow("Color", `<input data-field="color" type="color" value="${cfg.color || "#38bdf8"}">`);
      html += settingRow("Line width", `<input data-field="width" type="number" min="1" max="6" value="${cfg.width || 2}">`);
    }
    if (tab === "visibility") {
      html += settingRow("Visible", `<input data-field="visible" type="checkbox" ${cfg.visible !== false ? "checked" : ""}>`);
    }
  }

  if (kind === "vwap") {
    if (tab === "inputs") {
      html += settingSubtitle("Inputs");
      html += settingRow("Source", sourceSelect(cfg.source || "hlc3", ["hlc3","close","ohlc4"]));
      html += settingRow("Anchor period", `<select data-field="anchor"><option value="session">Session / Day</option><option value="week">Week</option><option value="month">Month</option></select>`);
      html += settingRow("Offset", `<input data-field="offset" type="number" min="-500" max="500" value="${cfg.offset || 0}">`);
      html += settingSubtitle("Bands");
      html += settingRow("Band calculation", `<select data-field="bandMode"><option value="stdev">Standard Deviation</option><option value="percent">Percentage</option></select>`);
      html += settingRow("Band 1", `<input data-field="showBand1" type="checkbox" ${cfg.showBand1 ? "checked" : ""}>`);
      html += settingRow("Band 1 multiplier", `<input data-field="band1Mult" type="number" step="0.1" min="0" value="${cfg.band1Mult ?? 1}">`);
      html += settingRow("Band 2", `<input data-field="showBand2" type="checkbox" ${cfg.showBand2 ? "checked" : ""}>`);
      html += settingRow("Band 2 multiplier", `<input data-field="band2Mult" type="number" step="0.1" min="0" value="${cfg.band2Mult ?? 2}">`);
      html += settingRow("Band 3", `<input data-field="showBand3" type="checkbox" ${cfg.showBand3 ? "checked" : ""}>`);
      html += settingRow("Band 3 multiplier", `<input data-field="band3Mult" type="number" step="0.1" min="0" value="${cfg.band3Mult ?? 3}">`);
    }
    if (tab === "style") {
      html += settingSubtitle("Style");
      html += settingRow("VWAP color", `<input data-field="color" type="color" value="${cfg.color || "#eab308"}">`);
      html += settingRow("VWAP width", `<input data-field="width" type="number" min="1" max="6" value="${cfg.width || 2}">`);
      html += settingRow("Band color", `<input data-field="bandColor" type="color" value="${cfg.bandColor || "#93c5fd"}">`);
      html += settingRow("Band width", `<input data-field="bandWidth" type="number" min="1" max="6" value="${cfg.bandWidth || 1}">`);
    }
    if (tab === "visibility") {
      html += settingRow("Visible", `<input data-field="visible" type="checkbox" ${cfg.visible !== false ? "checked" : ""}>`);
    }
  }

  if (kind === "volume") {
    if (tab === "inputs") {
      html += settingSubtitle("Inputs");
      html += settingRow("Show volume", `<input data-field="enabled" type="checkbox" ${cfg.enabled !== false ? "checked" : ""}>`);
      html += settingSubtitle("Volume Moving Average");
      html += settingRow("Show Volume MA", `<input data-field="showMA" type="checkbox" ${cfg.showMA ? "checked" : ""}>`);
      html += settingRow("MA type", maTypeSelect(cfg.maType || "SMA", true));
      html += settingRow("MA length", `<input data-field="maLength" type="number" min="1" max="1000" value="${cfg.maLength || 20}">`);
    }
    if (tab === "style") {
      html += settingSubtitle("Columns");
      html += settingRow("Up color", `<input data-field="upColor" type="color" value="${cfg.upColor || "#22c55e"}">`);
      html += settingRow("Down color", `<input data-field="downColor" type="color" value="${cfg.downColor || "#ef4444"}">`);
      html += settingRow("Opacity", `<input data-field="opacity" type="number" min="5" max="100" value="${cfg.opacity || 28}">`);
      html += settingSubtitle("Volume MA");
      html += settingRow("MA color", `<input data-field="maColor" type="color" value="${cfg.maColor || "#f59e0b"}">`);
      html += settingRow("MA width", `<input data-field="maWidth" type="number" min="1" max="6" value="${cfg.maWidth || 2}">`);
    }
    if (tab === "visibility") {
      html += settingRow("Visible", `<input data-field="visible" type="checkbox" ${cfg.visible !== false ? "checked" : ""}>`);
    }
  }

  if (kind === "rsi") {
    if (tab === "inputs") {
      html += settingSubtitle("RSI");
      html += settingRow("RSI length", `<input data-field="length" type="number" min="1" max="200" value="${cfg.length || 14}">`);
      html += settingRow("Source", sourceSelect(cfg.source || "close", ["close","hlc3","ohlc4"]));
      html += settingSubtitle("Levels");
      html += settingRow("Upper level", `<input data-field="upper" type="number" min="1" max="100" value="${cfg.upper || 70}">`);
      html += settingRow("Middle level", `<input data-field="middle" type="number" min="1" max="100" value="${cfg.middle || 50}">`);
      html += settingRow("Lower level", `<input data-field="lower" type="number" min="1" max="100" value="${cfg.lower || 30}">`);
      html += settingSubtitle("Smoothing");
      html += settingRow("Show MA", `<input data-field="showMA" type="checkbox" ${cfg.showMA ? "checked" : ""}>`);
      html += settingRow("MA type", maTypeSelect(cfg.maType || "SMA", true));
      html += settingRow("MA length", `<input data-field="maLength" type="number" min="1" max="200" value="${cfg.maLength || 14}">`);
      html += settingRow("Bollinger Bands", `<input data-field="showBB" type="checkbox" ${cfg.showBB ? "checked" : ""}>`);
      html += settingRow("BB StdDev", `<input data-field="bbStdDev" type="number" step="0.1" min="0" value="${cfg.bbStdDev || 2}">`);
    }
    if (tab === "style") {
      html += settingSubtitle("RSI Style");
      html += settingRow("RSI color", `<input data-field="color" type="color" value="${cfg.color || "#d6a93d"}">`);
      html += settingRow("MA color", `<input data-field="maColor" type="color" value="${cfg.maColor || "#a78bfa"}">`);
      html += settingRow("Upper color", `<input data-field="upperColor" type="color" value="${cfg.upperColor || "#94a3b8"}">`);
      html += settingRow("Middle color", `<input data-field="middleColor" type="color" value="${cfg.middleColor || "#64748b"}">`);
      html += settingRow("Lower color", `<input data-field="lowerColor" type="color" value="${cfg.lowerColor || "#94a3b8"}">`);
    }
    if (tab === "visibility") {
      html += settingRow("Visible", `<input data-field="visible" type="checkbox" ${cfg.visible !== false ? "checked" : ""}>`);
    }
  }

  if (kind === "whaleLiquidity" || kind === "orderflowFoundation") {
    html += settingRow("Enabled", `<input data-field="enabled" type="checkbox" ${cfg.enabled !== false ? "checked" : ""}>`);
  }

  body.innerHTML = html;
  body.querySelectorAll("select[data-field]").forEach(el => {
    const field = el.dataset.field;
    if (cfg[field] !== undefined) el.value = cfg[field];
  });
  body.querySelectorAll("[data-field]").forEach(el => {
    const evt = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, () => {
      const field = el.dataset.field;
      if (el.type === "checkbox") cfg[field] = el.checked;
      else if (el.type === "number") cfg[field] = Number(el.value);
      else cfg[field] = el.value;
    });
  });
}

function sourceSelect(value="close", allowed=["close","open","high","low","hl2","hlc3","ohlc4"]) {
  const labels = { close:"Close", open:"Open", high:"High", low:"Low", hl2:"HL2", hlc3:"HLC3", ohlc4:"OHLC4" };
  return `<select data-field="source">${allowed.map(v => `<option value="${v}" ${v===value ? "selected" : ""}>${labels[v]}</option>`).join("")}</select>`;
}

function maTypeSelect(value="EMA", includeVolumeTypes=false) {
  const base = includeVolumeTypes
    ? ["SMA","EMA","SMMA/RMA","WMA","VWMA"]
    : ["EMA","SMA","SMMA/RMA","WMA","VWMA"];
  return `<select data-field="${includeVolumeTypes ? "maType" : "type"}">${base.map(v => `<option value="${v}" ${v===value ? "selected" : ""}>${v}</option>`).join("")}</select>`;
}

function saveActiveIndicatorSettings() {
  if (!activeIndicatorTarget || !indicatorSettingsDraft) return;
  const { kind, idx } = activeIndicatorTarget;
  const cfg = normalizeOneIndicator(kind, indicatorSettingsDraft);

  if (kind === "ma") indicatorSettings.ma[idx] = cfg;
  if (kind === "vwap") indicatorSettings.vwap = { ...indicatorSettings.vwap, ...cfg, enabled:true };
  if (kind === "volume") indicatorSettings.volume = { ...indicatorSettings.volume, ...cfg, enabled:cfg.enabled !== false };
  if (kind === "rsi") indicatorSettings.rsi = { ...indicatorSettings.rsi, ...cfg, enabled:true };
  if (kind === "whaleLiquidity") indicatorSettings.whaleLiquidity = cfg.enabled !== false;
  if (kind === "orderflowFoundation") indicatorSettings.orderflowFoundation = cfg.enabled !== false;

  indicatorSettings = normalizeIndicatorSettings(indicatorSettings);
  saveIndicatorSettings();
  redrawIndicators();
  redrawLiquidity();
  updateIndicatorLegend();
  closeIndicatorSettingsModal();
}

function normalizeOneIndicator(kind, cfg) {
  if (kind === "ma") return {
    enabled:true,
    visible:cfg.visible !== false,
    type:cfg.type || "EMA",
    length:Math.max(1, Number(cfg.length || 9)),
    source:cfg.source || "close",
    color:cfg.color || "#38bdf8",
    width:Math.max(1, Number(cfg.width || 2)),
    offset:Number(cfg.offset || 0)
  };
  if (kind === "vwap") return {
    enabled:true,
    visible:cfg.visible !== false,
    source:cfg.source || "hlc3",
    color:cfg.color || "#eab308",
    width:Math.max(1, Number(cfg.width || 2)),
    anchor:cfg.anchor || "session",
    offset:Number(cfg.offset || 0),
    showBand1:!!cfg.showBand1,
    showBand2:!!cfg.showBand2,
    showBand3:!!cfg.showBand3,
    bandMode:cfg.bandMode || "stdev",
    band1Mult:Number(cfg.band1Mult ?? 1),
    band2Mult:Number(cfg.band2Mult ?? 2),
    band3Mult:Number(cfg.band3Mult ?? 3),
    bandColor:cfg.bandColor || "#93c5fd",
    bandWidth:Math.max(1, Number(cfg.bandWidth || 1))
  };
  if (kind === "rsi") return {
    enabled:true,
    visible:cfg.visible !== false,
    length:Math.max(1, Number(cfg.length || 14)),
    source:cfg.source || "close",
    upper:Number(cfg.upper || 70),
    middle:Number(cfg.middle || 50),
    lower:Number(cfg.lower || 30),
    color:cfg.color || "#d6a93d",
    showMA:!!cfg.showMA,
    maType:cfg.maType || "SMA",
    maLength:Math.max(1, Number(cfg.maLength || 14)),
    maColor:cfg.maColor || "#a78bfa",
    showBB:!!cfg.showBB,
    bbStdDev:Number(cfg.bbStdDev || 2),
    upperColor:cfg.upperColor || "#94a3b8",
    middleColor:cfg.middleColor || "#64748b",
    lowerColor:cfg.lowerColor || "#94a3b8"
  };
  if (kind === "volume") return {
    enabled:cfg.enabled !== false,
    visible:cfg.visible !== false,
    upColor:cfg.upColor || "#22c55e",
    downColor:cfg.downColor || "#ef4444",
    opacity:Math.max(5,Math.min(100,Number(cfg.opacity || 28))),
    showMA:!!cfg.showMA,
    maType:cfg.maType || "SMA",
    maLength:Math.max(1,Number(cfg.maLength || 20)),
    maColor:cfg.maColor || "#f59e0b",
    maWidth:Math.max(1,Number(cfg.maWidth || 2))
  };
  return cfg;
}

function priceSource(c, source) {
  if (source === "open") return c.open;
  if (source === "high") return c.high;
  if (source === "low") return c.low;
  if (source === "hl2") return (c.high + c.low) / 2;
  if (source === "hlc3") return (c.high + c.low + c.close) / 3;
  if (source === "ohlc4") return (c.open + c.high + c.low + c.close) / 4;
  if (source === "volume") return c.volume || 0;
  return c.close;
}

function applyOffset(data, offset=0) {
  offset = Number(offset || 0);
  if (!offset || !rawCandles.length) return data;
  return data.map((p, i) => {
    const ni = i + offset;
    if (ni >= 0 && ni < rawCandles.length) return { time:rawCandles[ni].time, value:p.value };
    return p;
  });
}

function maOverValues(values, period, type="EMA", volumes=null) {
  period = Math.max(1, Number(period || 9));
  if (!values.length) return [];
  if (type === "SMA") {
    const out = [];
    let sum = 0;
    values.forEach((v,i) => {
      sum += v.value;
      if (i >= period) sum -= values[i-period].value;
      if (i >= period-1) out.push({ time:v.time, value:sum/period });
    });
    return out;
  }
  if (type === "WMA") {
    const out = [];
    const denom = period*(period+1)/2;
    for (let i=period-1; i<values.length; i++) {
      let weighted=0;
      for (let j=0;j<period;j++) weighted += values[i-j].value*(period-j);
      out.push({ time:values[i].time, value:weighted/denom });
    }
    return out;
  }
  if (type === "SMMA/RMA") {
    const out = [];
    let rma = values[0].value;
    const alpha = 1/period;
    values.forEach(v => {
      rma = alpha*v.value + (1-alpha)*rma;
      out.push({ time:v.time, value:rma });
    });
    return out;
  }
  if (type === "VWMA") {
    const out = [];
    let pv=0, vol=0;
    values.forEach((v,i) => {
      const vv = volumes?.[i] ?? rawCandles[i]?.volume ?? 1;
      pv += v.value*vv;
      vol += vv;
      if (i >= period) {
        const oldV = volumes?.[i-period] ?? rawCandles[i-period]?.volume ?? 1;
        pv -= values[i-period].value*oldV;
        vol -= oldV;
      }
      if (i >= period-1) out.push({ time:v.time, value:vol ? pv/vol : v.value });
    });
    return out;
  }
  const k = 2/(period+1);
  let ema = values[0].value;
  return values.map(v => {
    ema = v.value*k + ema*(1-k);
    return { time:v.time, value:ema };
  });
}

function maData(data, cfg) {
  const vals = data.map(c => ({ time:c.time, value:priceSource(c,cfg.source) }));
  return applyOffset(maOverValues(vals, cfg.length, cfg.type), cfg.offset);
}

function volumeMAData(data, cfg) {
  const vals = data.map(c => ({ time:c.time, value:c.volume || 0 }));
  return maOverValues(vals, cfg.maLength, cfg.maType, data.map(c => c.volume || 0));
}

function periodKey(time, anchor) {
  const d = new Date(time*1000);
  if (anchor === "week") {
    const onejan = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getUTCDay()+1) / 7);
    return `${d.getUTCFullYear()}-W${week}`;
  }
  if (anchor === "month") return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}`;
  return d.toISOString().slice(0,10);
}

function vwapBandsData(data) {
  let cumPV=0, cumV=0, cumPV2=0, current=null;
  const src = indicatorSettings.vwap.source || "hlc3";
  const anchor = indicatorSettings.vwap.anchor || "session";
  return data.map(c => {
    const key = periodKey(c.time, anchor);
    if (key !== current) { current=key; cumPV=0; cumV=0; cumPV2=0; }
    const p = priceSource(c,src);
    const vol = Math.max(0,c.volume || 0);
    cumPV += p*vol;
    cumPV2 += p*p*vol;
    cumV += vol;
    const vwap = cumV ? cumPV/cumV : c.close;
    const variance = cumV ? Math.max(cumPV2/cumV - vwap*vwap, 0) : 0;
    const stdev = Math.sqrt(variance);
    return { time:c.time, value:vwap, stdev };
  });
}

function rsiData(data, period=14) {
  if (data.length < period + 1) return [];
  const src = indicatorSettings.rsi.source || "close";
  let gains=0, losses=0;
  const out=[];
  for (let i=1;i<=period;i++) {
    const ch = priceSource(data[i],src) - priceSource(data[i-1],src);
    if (ch >= 0) gains += ch; else losses -= ch;
  }
  let avgGain=gains/period, avgLoss=losses/period;
  for (let i=period+1;i<data.length;i++) {
    const ch = priceSource(data[i],src) - priceSource(data[i-1],src);
    const gain=Math.max(ch,0), loss=Math.max(-ch,0);
    avgGain=(avgGain*(period-1)+gain)/period;
    avgLoss=(avgLoss*(period-1)+loss)/period;
    const rs = avgLoss === 0 ? 100 : avgGain/avgLoss;
    out.push({ time:data[i].time, value:100 - (100/(1+rs)), volume:data[i].volume || 0 });
  }
  return out;
}

function clearIndicatorSeries() {
  Object.values(indicatorSeries).forEach(s => { try { chart.removeSeries(s); } catch(e) {} });
  indicatorSeries = {};
  if (volumeSeries) { try { chart.removeSeries(volumeSeries); } catch(e) {}; volumeSeries=null; }
  drawRSI();
}

function addLineIndicator(key, data, color, width=2, priceScaleId=undefined) {
  try {
    const opts = { color, lineWidth:Math.max(1,Number(width || 2)), priceLineVisible:false, lastValueVisible:true };
    if (priceScaleId !== undefined) opts.priceScaleId = priceScaleId;
    indicatorSeries[key] = chart.addLineSeries(opts);
    indicatorSeries[key].setData(data);
  } catch(e) {}
}

function redrawIndicators() {
  clearIndicatorSeries();
  if (!rawCandles.length) { updateIndicatorLegend(); return; }

  indicatorSettings.ma.forEach((cfg,idx) => {
    if (cfg.enabled && cfg.visible !== false) addLineIndicator(`ma${idx}`, maData(rawCandles,cfg), cfg.color, cfg.width);
  });

  if (indicatorSettings.vwap.enabled && indicatorSettings.vwap.visible !== false) {
    const v = vwapBandsData(rawCandles);
    addLineIndicator("vwap", applyOffset(v.map(x => ({time:x.time,value:x.value})), indicatorSettings.vwap.offset), indicatorSettings.vwap.color, indicatorSettings.vwap.width);
    [1,2,3].forEach(n => {
      if (!indicatorSettings.vwap[`showBand${n}`]) return;
      const mult = Number(indicatorSettings.vwap[`band${n}Mult`] || n);
      const upper = v.map(x => ({ time:x.time, value: indicatorSettings.vwap.bandMode === "percent" ? x.value*(1+mult/100) : x.value + x.stdev*mult }));
      const lower = v.map(x => ({ time:x.time, value: indicatorSettings.vwap.bandMode === "percent" ? x.value*(1-mult/100) : x.value - x.stdev*mult }));
      addLineIndicator(`vwapU${n}`, applyOffset(upper, indicatorSettings.vwap.offset), indicatorSettings.vwap.bandColor, indicatorSettings.vwap.bandWidth);
      addLineIndicator(`vwapL${n}`, applyOffset(lower, indicatorSettings.vwap.offset), indicatorSettings.vwap.bandColor, indicatorSettings.vwap.bandWidth);
    });
  }

  if (indicatorSettings.volume.enabled && indicatorSettings.volume.visible !== false) {
    try {
      const alpha = Math.max(5,Math.min(100,Number(indicatorSettings.volume.opacity || 28))) / 100;
      const hexToRgb = hex => {
        const n = parseInt((hex || "#64748b").replace("#",""),16);
        return [(n>>16)&255,(n>>8)&255,n&255];
      };
      const rgba = (hex,a) => {
        const [r,g,b]=hexToRgb(hex);
        return `rgba(${r},${g},${b},${a})`;
      };
      volumeSeries = chart.addHistogramSeries({
        priceFormat:{type:"volume"},
        priceScaleId:"volume",
        priceLineVisible:false,
        lastValueVisible:false
      });
      chart.priceScale("volume").applyOptions({ visible:false, scaleMargins:{ top:0.82, bottom:0 } });
      volumeSeries.setData(rawCandles.map(c => ({
        time:c.time,
        value:c.volume || 0,
        color:c.close >= c.open ? rgba(indicatorSettings.volume.upColor, alpha) : rgba(indicatorSettings.volume.downColor, alpha)
      })));
      if (indicatorSettings.volume.showMA) {
        addLineIndicator("volumeMA", volumeMAData(rawCandles, indicatorSettings.volume), indicatorSettings.volume.maColor, indicatorSettings.volume.maWidth, "volume");
      }
    } catch(e) {}
  }

  drawRSI();
  if (orderflowTag) orderflowTag.classList.toggle("hidden", !indicatorSettings.orderflowFoundation);
  updateIndicatorLegend();
}

function drawRSI() {
  rsiPanel.classList.toggle("hidden", !(indicatorSettings.rsi.enabled && indicatorSettings.rsi.visible !== false));
  if (!(indicatorSettings.rsi.enabled && indicatorSettings.rsi.visible !== false) || !rawCandles.length) return;

  const rect = rsiPanel.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  rsiCanvas.width=Math.floor(rect.width*dpr);
  rsiCanvas.height=Math.floor(rect.height*dpr);
  rsiCanvas.style.width=rect.width+"px";
  rsiCanvas.style.height=rect.height+"px";
  rsiCtx.setTransform(dpr,0,0,dpr,0,0);
  rsiCtx.clearRect(0,0,rect.width,rect.height);

  const period = Math.max(1,Number(indicatorSettings.rsi.length || 14));
  const data = rsiData(rawCandles,period).slice(-180);
  if (!data.length) return;

  const padL=36,padR=10,padT=16,padB=14;
  const w=rect.width-padL-padR,h=rect.height-padT-padB;
  const yFor=v => padT+(100-v)/100*h;
  const xFor=i => padL+(i/Math.max(1,data.length-1))*w;

  const levelRows = [
    [indicatorSettings.rsi.upper, indicatorSettings.rsi.upperColor],
    [indicatorSettings.rsi.middle, indicatorSettings.rsi.middleColor],
    [indicatorSettings.rsi.lower, indicatorSettings.rsi.lowerColor]
  ];
  levelRows.forEach(([v,c]) => {
    const y=yFor(Number(v));
    rsiCtx.strokeStyle=c || "rgba(148,163,184,.35)";
    rsiCtx.lineWidth=1;
    rsiCtx.beginPath(); rsiCtx.moveTo(padL,y); rsiCtx.lineTo(rect.width-padR,y); rsiCtx.stroke();
    rsiCtx.fillStyle="#94a3b8"; rsiCtx.font="11px Inter, Arial"; rsiCtx.fillText(String(v),8,y+3);
  });

  const drawLine = (arr,color,width=2) => {
    rsiCtx.strokeStyle=color;
    rsiCtx.lineWidth=width;
    rsiCtx.beginPath();
    arr.forEach((p,i) => {
      const x=xFor(i), y=yFor(p.value);
      if (i===0) rsiCtx.moveTo(x,y); else rsiCtx.lineTo(x,y);
    });
    rsiCtx.stroke();
  };

  drawLine(data, indicatorSettings.rsi.color || "#d6a93d", 2);

  if (indicatorSettings.rsi.showMA) {
    const smoothed = maOverValues(data, indicatorSettings.rsi.maLength, indicatorSettings.rsi.maType, data.map(x => x.volume || 0));
    const offset = data.length - smoothed.length;
    const mapped = smoothed.map((x,i) => ({ ...x, value:x.value, _idx:i+offset }));
    rsiCtx.strokeStyle = indicatorSettings.rsi.maColor || "#a78bfa";
    rsiCtx.lineWidth = 2;
    rsiCtx.beginPath();
    mapped.forEach((p,i) => {
      const x = xFor(p._idx), y = yFor(p.value);
      if (i===0) rsiCtx.moveTo(x,y); else rsiCtx.lineTo(x,y);
    });
    rsiCtx.stroke();

    if (indicatorSettings.rsi.showBB && smoothed.length) {
      const len = Math.max(1,Number(indicatorSettings.rsi.maLength || 14));
      const stdevRows = [];
      for (let i=len-1; i<data.length; i++) {
        const slice = data.slice(i-len+1,i+1).map(x => x.value);
        const mean = slice.reduce((a,b)=>a+b,0)/slice.length;
        const sd = Math.sqrt(slice.reduce((a,b)=>a+(b-mean)*(b-mean),0)/slice.length);
        stdevRows.push({ idx:i, mean, sd });
      }
      const mult = Number(indicatorSettings.rsi.bbStdDev || 2);
      ["upper","lower"].forEach(side => {
        rsiCtx.strokeStyle = "rgba(167,139,250,.65)";
        rsiCtx.lineWidth = 1;
        rsiCtx.beginPath();
        stdevRows.forEach((p,i) => {
          const val = side === "upper" ? p.mean + p.sd*mult : p.mean - p.sd*mult;
          const x = xFor(p.idx), y = yFor(val);
          if (i===0) rsiCtx.moveTo(x,y); else rsiCtx.lineTo(x,y);
        });
        rsiCtx.stroke();
      });
    }
  }
}

/* ---------- Data connection ---------- */

function connect() {
  if (ws) { ws.close(); ws = null; }
  clearLiquidityLines();
  rawCandles = [];
  candlesByTime = new Map();
  lastAlertKeys = new Set();
  toolbarPinned = false;
  els.status.textContent = "Connecting";
  els.statusDot.style.background = "#f59e0b";
  els.title.textContent = `${(els.symbol.value || "BTCUSDT").trim().toUpperCase()} · Bybit Liquidity`;

  ws = new WebSocket(wsUrl());

  ws.onopen = () => {
    els.status.textContent = "Connected";
    els.statusDot.style.background = "#22c55e";
  };

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);

    if (msg.type === "status") {
      els.status.textContent = msg.status || "Status";
      if (msg.history_source) els.historySource.textContent = "Candles: " + msg.history_source;
      if (msg.error) els.subtitle.textContent = msg.error;
      return;
    }

    if (msg.type === "candles") {
      if (msg.history_source) els.historySource.textContent = "Candles: " + msg.history_source;
      if (msg.warning) els.subtitle.textContent = `History fallback active · ${msg.warning}`;
      rawCandles = Array.isArray(msg.candles) ? msg.candles : [];
      redrawMainSeries();
      safeFit();
      setTimeout(() => {
        try { chart.timeScale().setVisibleLogicalRange({ from: Math.max(0, rawCandles.length-180), to: rawCandles.length+5 }); } catch(e) {}
      }, 350);
      loadDrawings();
      return;
    }

    if (msg.type === "candle") { updateOneCandle(msg.candle); return; }
    if (msg.type === "liquidity") {
      els.status.textContent = msg.ready ? "Live" : "Loading book";
      updateLiquidity(msg);
      return;
    }
    if (msg.type === "error") {
      els.status.textContent = "Error";
      els.subtitle.textContent = msg.error || "Unknown error";
    }
  };

  ws.onerror = () => {
    els.status.textContent = "WebSocket error";
    els.statusDot.style.background = "#ef4444";
  };
  ws.onclose = () => {
    els.status.textContent = "Disconnected";
    els.statusDot.style.background = "#ef4444";
  };
}


function openIndicatorModal() {
  const modal = document.getElementById("indicatorModal");
  if (!modal) {
    toast("Indicator modal missing. Please redeploy v3.2 with clear cache.");
    return;
  }
  try { loadIndicatorSettings(); } catch(e) { console.warn("Indicator settings load failed", e); }
  modal.classList.remove("hidden");
}

function closeIndicatorModal() {
  document.getElementById("indicatorModal")?.classList.add("hidden");
}


/* ---------- UI events ---------- */

chart.subscribeCrosshairMove(param => {
  if (!param?.time) return;
  const c = candlesByTime.get(String(param.time));
  if (!c) return;
  els.oVal.textContent = fmtPrice(c.open);
  els.hVal.textContent = fmtPrice(c.high);
  els.lVal.textContent = fmtPrice(c.low);
  els.cVal.textContent = fmtPrice(c.close);
  els.vVal.textContent = Number(c.volume || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
});

chart.timeScale().subscribeVisibleTimeRangeChange(() => drawOverlay());

const ro = new ResizeObserver(() => safeResize());
ro.observe(shellEl);
try { ro.observe(document.querySelector(".chart-area")); } catch(e) {}
window.addEventListener("resize", safeResize);

els.connectBtn.onclick = connect;
els.fitBtn.onclick = () => resetChartView();
els.maxBtn.onclick = () => { els.shell.classList.toggle("max-mode"); setTimeout(safeResize,80); };
els.panelBtn.onclick = () => {
  const open = !els.workspace.classList.contains("panels-open");
  els.workspace.classList.toggle("panels-open", open);
  els.rightPanel.classList.toggle("hidden", !open);
  if (els.showRightPanel) els.showRightPanel.checked = open;
  setTimeout(safeResize,80);
};
els.settingsBtn.onclick = () => els.settingsModal.classList.remove("hidden");
els.closeSettings.onclick = () => els.settingsModal.classList.add("hidden");
els.showBids.onchange = redrawLiquidity;
els.showAsks.onchange = redrawLiquidity;
els.showWatermark.onchange = () => els.watermark.style.display = els.showWatermark.checked ? "block" : "none";
els.showBottomPanel.onchange = () => {
  els.bottomPanel.classList.toggle("hidden", !els.showBottomPanel.checked);
  els.chartArea.classList.toggle("bottom-open", els.showBottomPanel.checked);
  setTimeout(safeResize,80);
};
els.showRightPanel.onchange = () => {
  els.workspace.classList.toggle("panels-open", els.showRightPanel.checked);
  els.rightPanel.classList.toggle("hidden", !els.showRightPanel.checked);
  setTimeout(safeResize,80);
};
els.showTitleRow.onchange = () => {
  els.titleRow.classList.toggle("hidden", !els.showTitleRow.checked);
  els.chartArea.classList.toggle("title-hidden", !els.showTitleRow.checked);
  setTimeout(safeResize,80);
};
els.chartType.onchange = () => makeSeries(els.chartType.value);
els.indicatorBtn.onclick = () => openIndicatorModal();
document.getElementById("indicatorBtn")?.addEventListener("click", openIndicatorModal);

document.getElementById("closeIndicatorModal")?.addEventListener("click", closeIndicatorModal);
document.getElementById("indicatorSearchInput")?.addEventListener("input", renderIndicatorLibrary);
document.querySelectorAll(".tv-indicator-tab").forEach(btn => {
  btn.onclick = () => {
    indicatorLibraryTab = btn.dataset.libraryTab || "all";
    document.querySelectorAll(".tv-indicator-tab").forEach(b => b.classList.toggle("active", b === btn));
    renderIndicatorLibrary();
  };
});

document.getElementById("closeIndicatorSettingsModal")?.addEventListener("click", closeIndicatorSettingsModal);
document.getElementById("cancelIndicatorSettingsBtn")?.addEventListener("click", closeIndicatorSettingsModal);
document.getElementById("saveIndicatorSettingsBtn")?.addEventListener("click", saveActiveIndicatorSettings);
document.querySelectorAll(".tv-settings-tab").forEach(btn => {
  btn.onclick = () => {
    activeIndicatorSettingsTab = btn.dataset.indicatorSettingsTab || "inputs";
    document.querySelectorAll(".tv-settings-tab").forEach(b => b.classList.toggle("active", b === btn));
    renderIndicatorSettingsBody();
  };
});

els.alertBtn.onclick = () => toast("Liquidity toast alerts are active");

const toolButtons = {
  cursor: els.cursorBtn,
  edit: els.editBtn,
  hline: els.hlineBtn,
  trend: els.trendBtn,
  ray: els.rayBtn,
  rect: els.rectBtn,
  fib: els.fibBtn
};
Object.entries(toolButtons).forEach(([t,b]) => { if (b) b.onclick = () => setTool(t); });

if (els.rrBtn) {
  els.rrBtn.onclick = (e) => {
    els.leftToolFlyout?.classList.toggle("hidden");
    e.stopPropagation();
  };
}
if (els.longPosBtn) els.longPosBtn.onclick = () => {
  els.leftToolFlyout?.classList.add("hidden");
  setTool("longpos");
};
if (els.shortPosBtn) els.shortPosBtn.onclick = () => {
  els.leftToolFlyout?.classList.add("hidden");
  setTool("shortpos");
};

els.undoBtn.onclick = undo;
els.deleteBtn.onclick = () => deleteDrawing();
if (els.selDelete) els.selDelete.onclick = () => deleteDrawing();
if (els.selLock) els.selLock.onclick = () => toggleLock();
if (els.selHide) els.selHide.onclick = () => toggleHide();
if (els.selClone) els.selClone.onclick = () => cloneDrawing();
if (els.selMoveMode) els.selMoveMode.onclick = () => setTool("cursor");
if (els.selSettings) els.selSettings.onclick = () => openDrawingSettings();
if (els.selTemplate) els.selTemplate.onclick = () => openToolbarTemplates();
if (els.selStyle) els.selStyle.onclick = () => openToolbarStyle();
if (els.selLineWidth) els.selLineWidth.onclick = () => openToolbarStyle();

if (els.toolbarDragHandle) {
  els.toolbarDragHandle.addEventListener("mousedown", e => {
    toolbarPinned = true;
    const r = els.selectionToolbar.getBoundingClientRect();
    const shell = shellEl.getBoundingClientRect();
    toolbarDrag = {
      dx: e.clientX - r.left,
      dy: e.clientY - r.top,
      shellLeft: shell.left,
      shellTop: shell.top
    };
    e.preventDefault();
    e.stopPropagation();
  });
}

document.addEventListener("mousemove", e => {
  if (!toolbarDrag) return;
  const x = e.clientX - toolbarDrag.shellLeft - toolbarDrag.dx;
  const y = e.clientY - toolbarDrag.shellTop - toolbarDrag.dy;
  placeToolbar(x, y);
});

document.addEventListener("mouseup", () => {
  if (toolbarDrag) {
    saveToolbarPosition();
    toolbarDrag = null;
  }
});

document.getElementById("quickColor")?.addEventListener("input", applyQuickStyle);
document.getElementById("quickWidth")?.addEventListener("input", applyQuickStyle);
document.getElementById("quickLineStyle")?.addEventListener("change", applyQuickStyle);
document.getElementById("quickLabels")?.addEventListener("change", applyQuickStyle);
document.getElementById("quickOpenSettings")?.addEventListener("click", () => openDrawingSettings());
document.getElementById("quickSaveTemplate")?.addEventListener("click", saveTemplateFromToolbar);
document.getElementById("quickApplyTemplate")?.addEventListener("click", applyTemplateFromToolbar);
document.getElementById("quickDefaultTemplate")?.addEventListener("click", setDefaultTemplateFromToolbar);
document.getElementById("quickDeleteTemplate")?.addEventListener("click", deleteTemplateFromToolbar);


if (els.addFibLevel) els.addFibLevel.onclick = () => {
  const d = selectedDrawing();
  if (!d || d.type !== "fib") return;
  normalizeDrawing(d);
  d.settings.levels.push({ on:true, value:0, label:"custom", color:d.settings.color || "#a78bfa", width:1, lineStyle:"solid" });
  saveDrawings();
  renderDrawingSettings();
  drawOverlay();
};
if (els.closeDrawingSettings) els.closeDrawingSettings.onclick = () => els.drawingSettingsModal.classList.add("hidden");
if (els.applyDrawingSettings) els.applyDrawingSettings.onclick = () => applySettingsFromModal();
if (els.resetDrawingSettings) els.resetDrawingSettings.onclick = () => resetSelectedDrawingSettings();
if (els.saveTemplateBtn) els.saveTemplateBtn.onclick = () => saveCurrentAsTemplate();
if (els.applyTemplateBtn) els.applyTemplateBtn.onclick = () => applySelectedTemplate();
if (els.setDefaultTemplateBtn) els.setDefaultTemplateBtn.onclick = () => setSelectedTemplateAsDefault();
if (els.deleteTemplateBtn) els.deleteTemplateBtn.onclick = () => deleteSelectedTemplate();

document.querySelectorAll(".settings-tab").forEach(btn => {
  btn.onclick = () => {
    activeSettingsTab = btn.dataset.tab;
    document.querySelectorAll(".settings-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === activeSettingsTab));
    renderDrawingSettings();
  };
});

document.querySelectorAll("#tfbar button").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll("#tfbar button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    connect();
  };
});

document.querySelectorAll(".watch").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".watch").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    els.symbol.value = b.dataset.symbol;
    connect();
  };
});


document.addEventListener("mousedown", e => {
  if (!toolbarStylePopover.classList.contains("hidden") || !toolbarTemplatePopover.classList.contains("hidden")) {
    const inside = e.target.closest("#toolbarStylePopover,#toolbarTemplatePopover,#selectionToolbar,#leftToolFlyout,#rrBtn");
    if (!inside) { hideToolbarPopovers(); els.leftToolFlyout?.classList.add("hidden"); }
  }
});


document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (els.shell.classList.contains("max-mode")) els.shell.classList.remove("max-mode");
    setTool("cursor");
    els.leftToolFlyout?.classList.add("hidden");
    setTimeout(safeResize,80);
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    if (selectedId) { deleteDrawing(); e.preventDefault(); }
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    undo(); e.preventDefault();
  }
  if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "e") setTool("edit");
  if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "m") {
    els.shell.classList.toggle("max-mode");
    setTimeout(safeResize,80);
  }
  if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "f") resetChartView();
  if (!e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "r") resetChartView();
});

loadIndicatorSettings();
makeSeries("candles");
setTool("cursor");
document.body.classList.add("mode-move");
safeResize();
connect();
setTimeout(resetChartView, 900);
setTimeout(resetChartView, 1800);
window.addEventListener("load", () => setTimeout(resetChartView, 500));
