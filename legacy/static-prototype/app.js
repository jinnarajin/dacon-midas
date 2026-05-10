const sectors = [
  { id: "semi", name: "반도체", industry: "IT", marketCap: 6820, tradingValue: 1180, changeRate: 2.42, volatility: 1.36, keywords: ["HBM", "AI서버", "외국인"] },
  { id: "battery", name: "2차전지", industry: "소재", marketCap: 3260, tradingValue: 620, changeRate: -1.38, volatility: 1.82, keywords: ["리튬", "전기차", "수요"] },
  { id: "internet", name: "인터넷", industry: "플랫폼", marketCap: 980, tradingValue: 260, changeRate: 1.12, volatility: 0.94, keywords: ["AI", "광고", "커머스"] },
  { id: "bio", name: "바이오", industry: "헬스케어", marketCap: 1420, tradingValue: 310, changeRate: 0.58, volatility: 1.11, keywords: ["임상", "기술수출"] },
  { id: "auto", name: "자동차", industry: "경기소비재", marketCap: 2140, tradingValue: 430, changeRate: -0.26, volatility: 0.78, keywords: ["수출", "환율"] },
  { id: "finance", name: "금융", industry: "금융", marketCap: 1730, tradingValue: 290, changeRate: 0.34, volatility: 0.62, keywords: ["금리", "배당"] },
  { id: "ship", name: "조선", industry: "산업재", marketCap: 790, tradingValue: 350, changeRate: 2.18, volatility: 1.54, keywords: ["LNG", "수주"] },
  { id: "defense", name: "방산", industry: "산업재", marketCap: 640, tradingValue: 250, changeRate: 2.84, volatility: 1.92, keywords: ["수출", "계약"] },
  { id: "steel", name: "철강", industry: "소재", marketCap: 820, tradingValue: 210, changeRate: -1.72, volatility: 1.21, keywords: ["중국", "원가"] },
  { id: "energy", name: "에너지", industry: "에너지", marketCap: 760, tradingValue: 180, changeRate: 0.46, volatility: 0.88, keywords: ["유가", "정제마진"] },
  { id: "consumer", name: "소비재", industry: "소비재", marketCap: 520, tradingValue: 130, changeRate: -0.82, volatility: 0.93, keywords: ["내수", "화장품"] },
];

const stocks = [
  ["005930", "삼성전자", "semi", "메모리", 81200, 79500, 1880, 1210, 4840, 1.28, true],
  ["000660", "SK하이닉스", "semi", "메모리", 189400, 181900, 650, 310, 1378, 1.88, false],
  ["042700", "한미반도체", "semi", "장비", 151200, 145400, 188, 92, 147, 2.05, false],
  ["039030", "이오테크닉스", "semi", "장비", 181700, 176900, 54, 30, 22, 1.64, false],
  ["373220", "LG에너지솔루션", "battery", "셀", 342500, 350000, 62, 53, 801, 1.62, false],
  ["006400", "삼성SDI", "battery", "셀", 318000, 322000, 51, 42, 218, 1.81, false],
  ["086520", "에코프로", "battery", "소재", 96300, 98400, 148, 112, 96, 2.12, false],
  ["247540", "에코프로비엠", "battery", "소재", 208500, 213000, 82, 75, 204, 1.76, true],
  ["035420", "NAVER", "internet", "플랫폼", 193800, 190400, 82, 64, 315, 1.08, false],
  ["035720", "카카오", "internet", "플랫폼", 48350, 47900, 210, 190, 214, 1.24, false],
  ["068270", "셀트리온", "bio", "바이오시밀러", 184500, 181400, 76, 71, 405, 1.12, true],
  ["207940", "삼성바이오로직스", "bio", "CDMO", 843000, 842000, 8, 8.3, 600, 0.78, false],
  ["005380", "현대차", "auto", "완성차", 244000, 245500, 94, 85, 510, 0.82, false],
  ["000270", "기아", "auto", "완성차", 112300, 111600, 135, 118, 451, 0.88, false],
  ["055550", "신한지주", "finance", "은행", 49600, 49250, 96, 87, 253, 0.62, false],
  ["316140", "우리금융지주", "finance", "은행", 15780, 15850, 188, 174, 117, 0.74, false],
  ["329180", "HD현대중공업", "ship", "조선", 147200, 142900, 52, 25, 131, 1.72, false],
  ["042660", "한화오션", "ship", "조선", 32700, 32200, 312, 270, 100, 1.38, false],
  ["012450", "한화에어로스페이스", "defense", "방산", 248500, 238000, 71, 33, 126, 2.08, true],
  ["047810", "한국항공우주", "defense", "방산", 53600, 52900, 116, 89, 52, 1.21, false],
  ["005490", "POSCO홀딩스", "steel", "철강", 356000, 363000, 42, 39, 301, 1.16, false],
  ["010950", "S-Oil", "energy", "정유", 72100, 71600, 41, 38, 81, 0.88, false],
  ["090430", "아모레퍼시픽", "consumer", "화장품", 121300, 123500, 39, 36, 71, 1.04, false],
].map(([code, name, sector, industry, price, previousClose, volume, averageVolume, marketCap, volatility, hasDisclosure]) => {
  const changeRate = ((price - previousClose) / previousClose) * 100;
  const tradingValue = (price * volume) / 100000;
  const volumeGrowthRate = ((volume - averageVolume) / averageVolume) * 100;
  return { code, name, sector, industry, price, previousClose, volume, averageVolume, marketCap, volatility, hasDisclosure, changeRate, tradingValue, volumeGrowthRate };
});

const news = [
  { time: "09:18", type: "뉴스", sector: "semi", code: null, tags: ["반도체", "HBM"], title: "반도체 업종 강세, AI 서버 수요 기대 확대" },
  { time: "09:42", type: "공시", sector: "semi", code: "005930", tags: ["공시", "투자"], title: "삼성전자 신규 시설투자 관련 공시" },
  { time: "10:07", type: "뉴스", sector: "semi", code: "000660", tags: ["HBM"], title: "SK하이닉스 HBM 공급 기대감 부각" },
  { time: "10:24", type: "뉴스", sector: "battery", code: null, tags: ["2차전지"], title: "2차전지 소재주 약세, 전기차 수요 우려 지속" },
  { time: "10:58", type: "공시", sector: "defense", code: "012450", tags: ["방산", "공시"], title: "한화에어로스페이스 단일판매 공급계약 공시" },
  { time: "11:16", type: "뉴스", sector: "ship", code: null, tags: ["조선", "LNG"], title: "조선주 수주 모멘텀 지속, LNG선 발주 기대" },
  { time: "11:32", type: "리포트", sector: null, code: null, tags: ["시장"], title: "국내 증시, 성장 섹터 거래대금 집중" },
  { time: "12:05", type: "뉴스", sector: "internet", code: null, tags: ["AI"], title: "인터넷 플랫폼주 AI 서비스 확장 기대" },
];

const state = {
  selectedLevel: "market",
  selectedSector: null,
  selectedStockCode: null,
  mapMetric: "market_cap",
  colorMetric: "change_rate",
  period: "1M",
};

const el = {
  body: document.body,
  treemap: document.querySelector("#treemap"),
  summaryStrip: document.querySelector("#summaryStrip"),
  mapScope: document.querySelector("#mapScope"),
  mapTitle: document.querySelector("#mapTitle"),
  backButton: document.querySelector("#backButton"),
  insightScope: document.querySelector("#insightScope"),
  insightTitle: document.querySelector("#insightTitle"),
  headline: document.querySelector("#headline"),
  insightRows: document.querySelector("#insightRows"),
  issueKeywords: document.querySelector("#issueKeywords"),
  overviewPanel: document.querySelector("#overviewPanel"),
  overviewSector: document.querySelector("#overviewSector"),
  overviewName: document.querySelector("#overviewName"),
  overviewMeta: document.querySelector("#overviewMeta"),
  overviewQuote: document.querySelector("#overviewQuote"),
  stockKpis: document.querySelector("#stockKpis"),
  priceChart: document.querySelector("#priceChart"),
  stockNews: document.querySelector("#stockNews"),
  newsContext: document.querySelector("#newsContext"),
  newsList: document.querySelector("#newsList"),
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor((sorted.length - 1) * p);
  return sorted[index] || 1;
}

function signed(value) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function price(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function amount(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}조`;
  return `${Math.round(value).toLocaleString("ko-KR")}억`;
}

function avg(items, getter) {
  return items.length ? items.reduce((sum, item) => sum + getter(item), 0) / items.length : 0;
}

function sectorStocks(sectorId) {
  return stocks.filter((stock) => stock.sector === sectorId);
}

function sectorById(id) {
  return sectors.find((sector) => sector.id === id);
}

function stockByCode(code) {
  return stocks.find((stock) => stock.code === code);
}

function normalizeChange(value) {
  return clamp(value, -5, 5) / 5;
}

function normalizedSize(item, allItems) {
  const metric = state.mapMetric === "trading_value" ? item.tradingValue : item.marketCap;
  const values = allItems.map((entry) => (state.mapMetric === "trading_value" ? entry.tradingValue : entry.marketCap));
  const p95 = percentile(values, 0.95);
  return Math.sqrt(clamp(metric, p95 * 0.08, p95) / p95);
}

function riskScore(item) {
  const volatilitySignal = item.volatility >= 1.5 ? 1 : 0;
  const volumeSignal = item.volumeGrowthRate >= 100 ? 1 : 0;
  const disclosureSignal = item.hasDisclosure ? 1 : 0;
  return volatilitySignal + volumeSignal + disclosureSignal;
}

function tileColor(item) {
  if (state.colorMetric === "volatility") {
    const intensity = clamp(item.volatility / 2.3, 0.22, 0.9);
    return `rgba(194, 138, 40, ${intensity})`;
  }
  const normalized = normalizeChange(item.changeRate);
  const alpha = clamp(Math.abs(normalized), 0.26, 0.9);
  if (normalized > 0.02) return `rgba(216, 74, 74, ${alpha})`;
  if (normalized < -0.02) return `rgba(47, 110, 211, ${alpha})`;
  return "rgba(122, 135, 148, 0.62)";
}

function tileSpan(item, allItems) {
  const score = normalizedSize(item, allItems);
  const area = clamp(Math.round(score * 42), 4, 34);
  const col = clamp(Math.round(Math.sqrt(area) * 1.7), 2, 8);
  const row = clamp(Math.round(area / col), 1, 6);
  return { col, row };
}

function marketStats() {
  const rising = stocks.filter((stock) => stock.changeRate > 0).length;
  const falling = stocks.filter((stock) => stock.changeRate < 0).length;
  const trading = stocks.reduce((sum, stock) => sum + stock.tradingValue, 0);
  const leadSector = [...sectors].sort((a, b) => b.tradingValue - a.tradingValue)[0];
  return {
    avgChange: avg(stocks, (stock) => stock.changeRate),
    advanceRatio: (rising / stocks.length) * 100,
    declineRatio: (falling / stocks.length) * 100,
    trading,
    leadSector,
  };
}

function sectorStats(id) {
  const current = sectorById(id);
  const list = sectorStocks(id);
  const rising = list.filter((stock) => stock.changeRate > 0).length;
  return {
    sector: current,
    stocks: list,
    avgChange: avg(list, (stock) => stock.changeRate),
    advanceRatio: list.length ? (rising / list.length) * 100 : 0,
    topStock: [...list].sort((a, b) => b.tradingValue - a.tradingValue)[0],
    volatility: avg(list, (stock) => stock.volatility),
  };
}

function renderSummary(cells) {
  el.summaryStrip.innerHTML = cells.map((cell) => `<div class="summary-cell"><span>${cell.label}</span><strong class="${cell.className || ""}">${cell.value}</strong></div>`).join("");
}

function renderTiles(items, mode) {
  el.treemap.innerHTML = items
    .map((item) => {
      const span = tileSpan(item, items);
      const selected = mode === "stock" && item.code === state.selectedStockCode ? "selected" : "";
      const risk = riskScore(item) >= 2 || item.volatility >= 1.5 ? "risk" : "";
      const disclosure = item.hasDisclosure ? "disclosure" : "";
      const idAttr = mode === "sector" ? `data-sector="${item.id}"` : `data-stock="${item.code}"`;
      const label = mode === "sector" ? item.name : item.name;
      const sub = mode === "sector" ? item.industry : item.industry;
      const value = state.mapMetric === "trading_value" ? amount(item.tradingValue) : amount(item.marketCap);
      return `<button class="tile ${selected} ${risk} ${disclosure}" ${idAttr} style="grid-column: span ${span.col}; grid-row: span ${span.row}; background:${tileColor(item)}" type="button">
        <span><span class="tile-name">${label}</span><span class="tile-sub">${sub}</span></span>
        <span class="tile-bottom"><span class="tile-value">${value}</span><span class="tile-rate">${signed(item.changeRate)}</span></span>
      </button>`;
    })
    .join("");

  document.querySelectorAll("[data-sector]").forEach((button) => button.addEventListener("click", () => renderSector(button.dataset.sector)));
  document.querySelectorAll("[data-stock]").forEach((button) => button.addEventListener("click", () => renderStock(button.dataset.stock)));
}

function renderMarket() {
  state.selectedLevel = "market";
  state.selectedSector = null;
  state.selectedStockCode = null;
  el.overviewPanel.hidden = true;
  el.backButton.hidden = true;
  el.mapScope.textContent = "전체 시장";
  el.mapTitle.textContent = "섹터별 시장 맵";

  const stats = marketStats();
  renderSummary([
    { label: "평균 등락률", value: signed(stats.avgChange), className: stats.avgChange >= 0 ? "up-text" : "down-text" },
    { label: "상승 종목 비율", value: `${stats.advanceRatio.toFixed(0)}%` },
    { label: "거래대금", value: amount(stats.trading) },
    { label: "주도 섹터", value: stats.leadSector.name },
  ]);
  renderTiles(sectors, "sector");
  renderMarketInsight(stats);
  renderNews();
}

function renderSector(id) {
  state.selectedLevel = state.selectedStockCode ? "stock" : "sector";
  state.selectedSector = id;
  el.backButton.hidden = false;
  const stats = sectorStats(id);
  el.mapScope.textContent = "현재 섹터";
  el.mapTitle.textContent = `${stats.sector.name} 종목 맵`;

  renderSummary([
    { label: "섹터 평균", value: signed(stats.avgChange), className: stats.avgChange >= 0 ? "up-text" : "down-text" },
    { label: "상승 비율", value: `${stats.advanceRatio.toFixed(0)}%` },
    { label: "거래대금 상위", value: stats.topStock?.name || "-" },
    { label: "키워드", value: stats.sector.keywords[0] },
  ]);
  renderTiles(stats.stocks, "stock");
  if (!state.selectedStockCode) renderSectorInsight(stats);
  renderNews();
}

function renderMarketInsight(stats) {
  const tone = stats.advanceRatio >= 60 ? "시장 전반 강세" : stats.declineRatio >= 60 ? "시장 전반 약세" : "혼조";
  el.insightScope.textContent = "MARKET";
  el.insightTitle.textContent = "시장 요약";
  el.headline.innerHTML = `<strong>${tone}</strong><p>상승 종목 비율 ${stats.advanceRatio.toFixed(0)}%, 거래대금 주도 섹터는 ${stats.leadSector.name}입니다.</p>`;
  renderInsightRows([
    ["강세", "up", `평균 등락률 ${signed(stats.avgChange)}, 상승 종목 비율 ${stats.advanceRatio.toFixed(0)}%로 집계됩니다.`],
    ["관심 증가", "neutral", `${stats.leadSector.name} 거래대금 집중도가 높아 주도 섹터 후보입니다.`],
    ["확인", "risk", "뉴스와 공시는 원인 후보로만 연결하고 단정 표현은 사용하지 않습니다."],
  ]);
  renderKeywords(stats.leadSector.keywords);
}

function renderSectorInsight(stats) {
  const tone = stats.advanceRatio >= 60 ? "섹터 동반 상승" : stats.avgChange < 0 ? "섹터 약세 가능성" : "섹터 상대 흐름";
  el.insightScope.textContent = "SECTOR";
  el.insightTitle.textContent = `${stats.sector.name} 요약`;
  el.headline.innerHTML = `<strong>${tone}</strong><p>${stats.sector.name} 평균 ${signed(stats.avgChange)}, 상승 종목 비율 ${stats.advanceRatio.toFixed(0)}%입니다.</p>`;
  renderInsightRows([
    [stats.avgChange >= 0 ? "강세" : "약세", stats.avgChange >= 0 ? "up" : "down", `섹터 평균은 시장 대비 ${stats.avgChange >= 0 ? "상대 강세" : "약세"} 구간입니다.`],
    ["관심 증가", "neutral", `${stats.topStock?.name || "-"} 거래대금이 섹터 내에서 가장 큽니다.`],
    [stats.volatility >= 1.5 ? "변동성 유의" : "확인", stats.volatility >= 1.5 ? "risk" : "neutral", `평균 변동성 ${stats.volatility.toFixed(2)} 기준으로 위험 강조 여부를 판단합니다.`],
  ]);
  renderKeywords(stats.sector.keywords);
}

function renderStockInsight(stock) {
  const stats = sectorStats(stock.sector);
  const excess = stock.changeRate - stats.avgChange;
  const tone = excess >= 2 ? "섹터 대비 강세" : excess <= -2 ? "섹터 대비 약세" : "섹터 평균 부근";
  el.insightScope.textContent = "STOCK";
  el.insightTitle.textContent = `${stock.name} 요약`;
  el.headline.innerHTML = `<strong>${tone}</strong><p>섹터 평균 대비 ${excess >= 0 ? "+" : ""}${excess.toFixed(2)}%p, 거래량 증가율 ${signed(stock.volumeGrowthRate)}입니다.</p>`;
  renderInsightRows([
    [excess >= 2 ? "강세" : excess <= -2 ? "약세" : "혼조", excess >= 2 ? "up" : excess <= -2 ? "down" : "neutral", `현재 등락률 ${signed(stock.changeRate)}, 섹터 평균 ${signed(stats.avgChange)}입니다.`],
    [stock.volumeGrowthRate >= 100 ? "관심 증가" : "확인", stock.volumeGrowthRate >= 100 ? "risk" : "neutral", `거래량 증가율 ${signed(stock.volumeGrowthRate)}로 수급 집중 후보를 판단합니다.`],
    [stock.hasDisclosure ? "공시 확인" : "확인", stock.hasDisclosure ? "risk" : "neutral", stock.hasDisclosure ? "관련 공시가 있어 기업 이벤트 확인이 필요합니다." : "직접 연결 공시는 현재 없습니다."],
  ]);
  renderKeywords(sectorById(stock.sector).keywords);
}

function renderInsightRows(rows) {
  el.insightRows.innerHTML = rows.map(([label, tone, text]) => `<div class="insight-row"><span class="badge ${tone}">${label}</span><p>${text}</p></div>`).join("");
}

function renderKeywords(keywords) {
  el.issueKeywords.innerHTML = keywords.map((keyword) => `<span>#${keyword}</span>`).join("");
}

function relatedNews() {
  if (state.selectedLevel === "stock") {
    const stock = stockByCode(state.selectedStockCode);
    const direct = news.filter((item) => item.code === stock.code);
    const sectorItems = news.filter((item) => item.sector === stock.sector && item.code !== stock.code);
    return [...direct, ...sectorItems, ...news.filter((item) => !item.sector)].slice(0, 4);
  }
  if (state.selectedLevel === "sector") {
    return [...news.filter((item) => item.sector === state.selectedSector), ...news.filter((item) => !item.sector)].slice(0, 4);
  }
  return news.slice(0, 4);
}

function renderNews() {
  const items = relatedNews();
  const context = state.selectedLevel === "stock" ? stockByCode(state.selectedStockCode)?.name : state.selectedLevel === "sector" ? sectorById(state.selectedSector)?.name : "전체 시장";
  el.newsContext.textContent = context || "전체 시장";
  el.newsList.innerHTML = items.map((item) => `<div class="news-card"><span>${item.time} · ${item.type} · ${item.tags.map((tag) => `#${tag}`).join(" ")}</span><strong>${item.title}</strong></div>`).join("");
}

function renderStock(code) {
  const stock = stockByCode(code);
  if (!stock) return;
  state.selectedLevel = "stock";
  state.selectedStockCode = code;
  state.selectedSector = stock.sector;
  renderSector(stock.sector);
  state.selectedLevel = "stock";
  state.selectedStockCode = code;
  el.overviewPanel.hidden = false;
  const stats = sectorStats(stock.sector);
  const excess = stock.changeRate - stats.avgChange;
  const sector = sectorById(stock.sector);

  el.overviewSector.textContent = `${sector.name} · ${stock.industry}`;
  el.overviewName.textContent = stock.name;
  el.overviewMeta.textContent = `${stock.code} · KOSPI/KOSDAQ · 선택 종목은 맵에서도 강조 표시됩니다.`;
  el.overviewQuote.innerHTML = `<strong>${price(stock.price)}</strong><span class="${stock.changeRate >= 0 ? "up-text" : "down-text"}">${signed(stock.changeRate)}</span>`;
  el.stockKpis.innerHTML = [
    ["거래량", `${stock.volume.toLocaleString("ko-KR")}천주`],
    ["거래대금", amount(stock.tradingValue)],
    ["섹터 대비", `${excess >= 0 ? "+" : ""}${excess.toFixed(2)}%p`],
    ["변동성", stock.volatility.toFixed(2)],
    ["거래량 증가율", signed(stock.volumeGrowthRate)],
    ["공시", stock.hasDisclosure ? "확인 필요" : "직접 공시 없음"],
  ].map(([label, value]) => `<div class="kpi"><span>${label}</span><strong>${value}</strong></div>`).join("");

  const stockNews = relatedNews();
  el.stockNews.innerHTML = `<h3>공시 우선 · 관련 뉴스</h3><ul>${stockNews.map((item) => `<li>${item.time} · ${item.type} · ${item.tags.map((tag) => `#${tag}`).join(" ")}<br><strong>${item.title}</strong></li>`).join("")}</ul>`;
  renderStockInsight(stock);
  renderChart(stock);
}

function renderChart(stock) {
  const ctx = el.priceChart.getContext("2d");
  const canvas = el.priceChart;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const countByPeriod = { "1D": 12, "1W": 7, "1M": 24, "3M": 64, "1Y": 128 };
  const count = countByPeriod[state.period] || 24;
  const data = Array.from({ length: count }, (_, index) => {
    const t = index / Math.max(1, count - 1);
    const trend = (stock.changeRate / 100) * t;
    const wave = Math.sin(index * 0.7) * stock.volatility * 0.006;
    return stock.previousClose * (1 + trend + wave);
  });
  data[data.length - 1] = stock.price;
  const min = Math.min(...data) * 0.995;
  const max = Math.max(...data) * 1.005;
  const pad = 28;
  const plotH = canvas.height - 82;

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--line-strong");
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = pad + (plotH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(canvas.width - pad, y);
    ctx.stroke();
  }

  ctx.strokeStyle = stock.changeRate >= 0 ? "#d84a4a" : "#2f6ed3";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = pad + (index / (data.length - 1)) * (canvas.width - pad * 2);
    const y = pad + (1 - (value - min) / (max - min)) * plotH;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  data.forEach((_, index) => {
    const x = pad + (index / (data.length - 1)) * (canvas.width - pad * 2);
    const h = 10 + Math.abs(Math.sin(index * 0.44)) * 34;
    ctx.fillStyle = "rgba(122,135,148,.38)";
    ctx.fillRect(x - 2, canvas.height - 28 - h, 3, h);
  });

  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--muted");
  ctx.font = "13px Segoe UI, Arial";
  ctx.fillText(`${state.period} · 일봉 라인 + 거래량`, pad, canvas.height - 10);
}

function setActive(selector, key, value) {
  document.querySelectorAll(selector).forEach((button) => button.classList.toggle("active", button.dataset[key] === value));
}

document.querySelectorAll("[data-map-metric]").forEach((button) => {
  button.addEventListener("click", () => {
    state.mapMetric = button.dataset.mapMetric;
    setActive("[data-map-metric]", "mapMetric", state.mapMetric);
    if (state.selectedLevel === "market") renderMarket();
    else if (state.selectedLevel === "stock") renderStock(state.selectedStockCode);
    else renderSector(state.selectedSector);
  });
});

document.querySelectorAll("[data-color-metric]").forEach((button) => {
  button.addEventListener("click", () => {
    state.colorMetric = button.dataset.colorMetric;
    setActive("[data-color-metric]", "colorMetric", state.colorMetric);
    if (state.selectedLevel === "market") renderMarket();
    else if (state.selectedLevel === "stock") renderStock(state.selectedStockCode);
    else renderSector(state.selectedSector);
  });
});

document.querySelectorAll("[data-period]").forEach((button) => {
  button.addEventListener("click", () => {
    state.period = button.dataset.period;
    setActive("[data-period]", "period", state.period);
    const stock = stockByCode(state.selectedStockCode);
    if (stock) renderChart(stock);
  });
});

document.querySelector("#themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const stock = stockByCode(state.selectedStockCode);
  if (stock) renderChart(stock);
});

el.backButton.addEventListener("click", renderMarket);

renderMarket();
