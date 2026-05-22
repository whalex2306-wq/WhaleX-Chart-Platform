
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
  toolTip: document.getElementById("toolTip"),
  selectionToolbar: document.getElementById("selectionToolbar"),
  selDelete: document.getElementById("selDelete"),
  selLock: document.getElementById("selLock"),
  selHide: document.getElementById("selHide"),
  selClone: document.getElementById("selClone"),
  selMoveMode: document.getElementById("selMoveMode"),
  selSettings: document.getElementById("selSettings"),
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

const chartEl = document.getElementById("chart");
const shellEl = document.getElementById("chartShell");
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

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
let activeSettingsTab = "style";

function interval() {
  return document.querySelector("#tfbar button.active")?.dataset.tf || "15";
}

function storageKey() {
  return `whalex_drawings_v216_${(els.symbol.value || "BTCUSDT").trim().toUpperCase()}_${interval()}`;
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

function xyToPoint(e) {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const time = xToTime(x), price = yToPrice(y);
  if (time === null || !Number.isFinite(price)) return null;
  return { time, price, x, y };
}

function pointToXY(p) {
  return { x: pToX(p), y: pToY(p) };
}

function dist(a,b,c,d) {
  return Math.hypot(a-c, b-d);
}

function neededPoints(t) {
  return t === "hline" ? 1 : t === "rr" ? 3 : 2;
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
    rr: els.rrBtn
  };
  (map[t] || els.cursorBtn)?.classList.add("active");

  const isDraw = !["cursor", "edit"].includes(t);
  document.body.classList.toggle("mode-move", t === "cursor");
  document.body.classList.toggle("mode-edit", t === "edit");
  document.body.classList.toggle("mode-draw", isDraw);

  shellEl.classList.toggle("drawing-active", isDraw);
  shellEl.classList.toggle("edit-active", t === "edit");
  shellEl.classList.toggle("select-mode", t === "edit");

  if (els.toolTip) {
    const label = t === "cursor" ? "Move / Pan" : t === "edit" ? "Select / Edit" : `Drawing: ${t} (${neededPoints(t)} click${neededPoints(t) > 1 ? "s" : ""})`;
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
  return ({ hline:"Horizontal Line", trend:"Trendline", ray:"Ray", rect:"Rectangle", fib:"Fib Retracement", rr:"Risk/Reward" }[d.type] || d.type) + " #" + String(d.id).slice(-4);
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
    if (els.selLock) els.selLock.textContent = d.locked ? "Unlock" : "Lock";
    if (els.selHide) els.selHide.textContent = d.hidden ? "Show" : "Hide";

    const b = drawingScreenBounds(d);
    if (b) {
      const chartW = canvas.clientWidth || 800;
      const x = Math.max(10, Math.min(chartW - 330, b.left + 8));
      const y = Math.max(10, b.top - 42);
      els.selectionToolbar.style.left = `${x}px`;
      els.selectionToolbar.style.top = `${y}px`;
    }
  }
}

function addDrawing(points) {
  let d = normalizeDrawing({
    id: Date.now() + Math.floor(Math.random() * 1000),
    type: activeTool,
    points,
    locked: false,
    hidden: false
  });
  d = applyDefaultTemplateToDrawing(d);
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
    const low = Math.min(d.points[0].price, d.points[1].price);
    const high = Math.max(d.points[0].price, d.points[1].price);
    for (const lev of d.settings.levels.filter(l => l.on)) {
      const yy = pToY({ price: low + (high-low)*Number(lev.value) });
      if (yy != null && Math.abs(y-yy) < 6) return { kind:"body" };
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
  const xe=pToX(entry), xt=pToX(target), ye=pToY(entry), yt=pToY(target), ys=pToY(stop);
  if ([xe,xt,ye,yt,ys].some(v => v == null)) return;
  const left=Math.min(xe,xt), right=Math.max(xe,xt)+90, w=right-left;
  const profitColor=s.profitColor || "#22c55e", lossColor=s.lossColor || "#ef4444";
  ctx.save();
  ctx.fillStyle=colorWithOpacity(profitColor,s.fillOpacity);
  ctx.fillRect(left,Math.min(ye,yt),w,Math.abs(yt-ye));
  ctx.fillStyle=colorWithOpacity(lossColor,s.fillOpacity);
  ctx.fillRect(left,Math.min(ye,ys),w,Math.abs(ys-ye));
  ctx.lineWidth=s.width;
  ctx.strokeStyle=profitColor; ctx.strokeRect(left,Math.min(ye,yt),w,Math.abs(yt-ye));
  ctx.strokeStyle=lossColor; ctx.strokeRect(left,Math.min(ye,ys),w,Math.abs(ys-ye));
  ctx.restore();
  const risk=Math.abs(entry.price-stop.price), reward=Math.abs(target.price-entry.price), rr=risk>0?(reward/risk).toFixed(2):"—";
  if (s.showLabels) {
    const mode = (s.mode || "long").toUpperCase();
    drawLabel(`${mode} Entry ${fmtPrice(entry.price)}`,right-170,ye,"#111827");
    drawLabel(`TP ${fmtPrice(target.price)}${s.showRR ? "  RR "+rr : ""}`,right-160,yt,"#15803d");
    drawLabel(`SL ${fmtPrice(stop.price)}`,right-135,ys,"#991b1b");
  }
  if (sel) { anchor(xe,ye,true); anchor(xt,yt,true); anchor(pToX(stop),ys,true); }
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
    canvas.style.cursor = h ? (h.hit.kind === "anchor" ? "grab" : "move") : "default";
  }
});

window.addEventListener("mouseup", () => {
  canvas.classList.remove("dragging");
  if (dragMode) {
    canvas.classList.remove("dragging");
    saveDrawings();
    dragMode = null;
    dragStart = null;
    toast("Drawing updated");
  }
});

canvas.addEventListener("click", e => {
  if (activeTool === "cursor" || activeTool === "edit") return;

  const p = xyToPoint(e);
  if (!p) {
    toast("Chart not ready for drawing. Press R, then try again.");
    return;
  }

  pendingPoints.push({ time:p.time, price:p.price });

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


/* ---------- Data connection ---------- */

function connect() {
  if (ws) { ws.close(); ws = null; }
  clearLiquidityLines();
  rawCandles = [];
  candlesByTime = new Map();
  lastAlertKeys = new Set();
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
els.indicatorBtn.onclick = () => toast("Indicator menu comes after drawing tools are stable");
els.alertBtn.onclick = () => toast("Liquidity toast alerts are active");

const toolButtons = {
  cursor: els.cursorBtn,
  edit: els.editBtn,
  hline: els.hlineBtn,
  trend: els.trendBtn,
  ray: els.rayBtn,
  rect: els.rectBtn,
  fib: els.fibBtn,
  rr: els.rrBtn
};
Object.entries(toolButtons).forEach(([t,b]) => { if (b) b.onclick = () => setTool(t); });

els.undoBtn.onclick = undo;
els.deleteBtn.onclick = () => deleteDrawing();
if (els.selDelete) els.selDelete.onclick = () => deleteDrawing();
if (els.selLock) els.selLock.onclick = () => toggleLock();
if (els.selHide) els.selHide.onclick = () => toggleHide();
if (els.selClone) els.selClone.onclick = () => cloneDrawing();
if (els.selMoveMode) els.selMoveMode.onclick = () => setTool("cursor");
if (els.selSettings) els.selSettings.onclick = () => openDrawingSettings();

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

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (els.shell.classList.contains("max-mode")) els.shell.classList.remove("max-mode");
    setTool("cursor");
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

makeSeries("candles");
setTool("cursor");
document.body.classList.add("mode-move");
safeResize();
connect();
setTimeout(resetChartView, 900);
setTimeout(resetChartView, 1800);
window.addEventListener("load", () => setTimeout(resetChartView, 500));
