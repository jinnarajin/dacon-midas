import { useEffect, useMemo, useState } from "react";

import type { MarketSummaryResponse } from "../entities/market/model";
import type { NewsResponse } from "../entities/news/model";
import type { SectorResponse } from "../entities/sector/model";
import type { ChartPeriod, StockOverviewResponse } from "../entities/stock/model";
import { MarketMap } from "../features/market-map/components/MarketMap";
import { StockOverview } from "../features/stock-overview/components/StockOverview";
import { getMarketSummary, getNews, getSector, getStockOverview } from "../services/marketApi";
import { formatKrw, formatNumber, formatPercent } from "../shared/lib/formatters";
import {
  initialSelectionState,
  selectMarket,
  selectSector,
  selectStock,
  type ColorMetric,
  type MapMetric,
  type SelectionState
} from "../shared/state/selectionStore";

export function App() {
  const [selection, setSelection] = useState<SelectionState>(initialSelectionState);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [market, setMarket] = useState<MarketSummaryResponse | null>(null);
  const [sector, setSector] = useState<SectorResponse | null>(null);
  const [stock, setStock] = useState<StockOverviewResponse | null>(null);
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMarketSummary().then(setMarket).catch((caught: Error) => setError(caught.message));
  }, []);

  useEffect(() => {
    if (!selection.selectedSectorId) {
      setSector(null);
      return;
    }
    getSector(selection.selectedSectorId)
      .then(setSector)
      .catch((caught: Error) => setError(caught.message));
  }, [selection.selectedSectorId]);

  useEffect(() => {
    if (!selection.selectedStockCode) {
      setStock(null);
      return;
    }
    getStockOverview(selection.selectedStockCode)
      .then(setStock)
      .catch((caught: Error) => setError(caught.message));
  }, [selection.selectedStockCode]);

  useEffect(() => {
    getNews({
      selectionLevel: selection.selectedLevel,
      sectorId: selection.selectedSectorId,
      stockCode: selection.selectedStockCode
    })
      .then(setNews)
      .catch((caught: Error) => setError(caught.message));
  }, [selection.selectedLevel, selection.selectedSectorId, selection.selectedStockCode]);

  const hierarchyTitle = useMemo(() => {
    if (selection.selectedLevel === "stock") {
      return stock?.identity.stock_name ?? selection.selectedStockCode ?? "Stock";
    }
    if (selection.selectedLevel === "sector") {
      return sector?.summary.sector_name ?? selection.selectedSectorId ?? "Sector";
    }
    return market?.summary.market_name ?? "KR Market";
  }, [market, sector, selection.selectedLevel, selection.selectedSectorId, selection.selectedStockCode, stock]);

  const activeStats = useMemo(() => {
    if (selection.selectedLevel === "stock" && stock) {
      return [
        { label: "Last Price", value: formatNumber(stock.quote.current_price), tone: stock.quote.change_rate },
        { label: "Change", value: formatPercent(stock.quote.change_rate), tone: stock.quote.change_rate },
        { label: "Trading Value", value: formatKrw(stock.quote.trading_value), tone: 0 },
        { label: "Volume", value: formatNumber(stock.quote.volume), tone: stock.quote.volume_growth_rate ?? 0 }
      ];
    }
    if (selection.selectedLevel === "sector" && sector) {
      return [
        { label: "Stocks", value: formatNumber(sector.summary.stock_count), tone: 0 },
        { label: "Avg Change", value: formatPercent(sector.summary.average_change_rate), tone: sector.summary.average_change_rate },
        { label: "Trading Value", value: formatKrw(sector.summary.total_trading_value), tone: 0 },
        { label: "Rising", value: formatPercent(sector.summary.rising_stock_ratio), tone: sector.summary.rising_stock_ratio - 50 }
      ];
    }
    return [
      { label: "Listed Universe", value: formatNumber(market?.summary.total_stock_count), tone: 0 },
      { label: "Avg Change", value: formatPercent(market?.summary.average_change_rate), tone: market?.summary.average_change_rate ?? 0 },
      { label: "Trading Value", value: formatKrw(market?.summary.total_trading_value), tone: 0 },
      { label: "Rising", value: formatPercent(market?.summary.rising_stock_ratio), tone: (market?.summary.rising_stock_ratio ?? 50) - 50 }
    ];
  }, [market, sector, selection.selectedLevel, stock]);

  function updateMapMetric(metric: MapMetric) {
    setSelection((current) => ({ ...current, mapMetric: metric }));
  }

  function updateColorMetric(metric: ColorMetric) {
    setSelection((current) => ({ ...current, colorMetric: metric }));
  }

  function updatePeriod(period: ChartPeriod) {
    setSelection((current) => ({ ...current, period }));
  }

  return (
    <div className="app-shell midas-shell map-only-shell" data-theme={theme}>
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <h1>Midas Map</h1>
          </div>
        </div>
        <nav className="market-tabs" aria-label="Market filters">
          <button className="active" type="button" onClick={() => setSelection((current) => selectMarket(current))}>
            전체 시장
          </button>
          <button type="button">코스피</button>
          <button type="button">코스닥</button>
          <button type="button">선물</button>
          <button type="button">ETF</button>
        </nav>
        <div className="top-controls" aria-label="Map display controls">
          <span>기준: 종가⌄</span>
          <button type="button" onClick={() => updateMapMetric("market_cap")}>$ 시가총액⌄</button>
          <div className="heat-scale" aria-label="Heat scale">
            <i className="loss-3" /> <i className="loss-2" /> <i className="loss-1" /> <b>0%</b>
            <i className="gain-1" /> <i className="gain-2" /> <i className="gain-3" />
          </div>
        </div>
        <div className="global-search" aria-label="Search">
          <span>⌕</span>
          <input readOnly value={`종목 검색 · ${hierarchyTitle}`} aria-label="Current selection" />
        </div>
        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            aria-label="테마 전환"
          >
            ⚙
          </button>
        </div>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

      {selection.selectedLevel !== "stock" ? (
        <section className="market-overview" aria-label="Market overview">
          <div className="overview-copy">
            <p className="eyebrow">Market hierarchy</p>
            <h2>{hierarchyTitle}</h2>
            <span>{market?.as_of ?? "Loading"} · 섹터를 누르면 기업 히트맵, 기업을 누르면 종목 상세로 이동</span>
          </div>
          <div className="stat-grid">
            {activeStats.map((stat) => (
              <article className={stat.tone > 0 ? "positive" : stat.tone < 0 ? "negative" : ""} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="hierarchy-bar" aria-label="Selection hierarchy">
        <button type="button" onClick={() => setSelection((current) => selectMarket(current))}>
          Market
        </button>
        {selection.selectedSectorId ? (
          <>
            <span>/</span>
            <button
              type="button"
              onClick={() => setSelection((current) => selectSector(current, selection.selectedSectorId ?? ""))}
            >
              {sector?.summary.sector_name ?? selection.selectedSectorId}
            </button>
          </>
        ) : null}
        {selection.selectedStockCode ? (
          <>
            <span>/</span>
            <strong>{stock?.identity.stock_name ?? selection.selectedStockCode}</strong>
          </>
        ) : null}
        <em>{hierarchyTitle}</em>
      </nav>

      {selection.selectedLevel !== "stock" ? (
        <main className="map-focus">
          <MarketMap
            level={selection.selectedLevel}
            market={market}
            sector={sector}
            mapMetric={selection.mapMetric}
            colorMetric={selection.colorMetric}
            onMapMetricChange={updateMapMetric}
            onColorMetricChange={updateColorMetric}
            onSelectMarket={() => setSelection((current) => selectMarket(current))}
            onSelectSector={(sectorId) => setSelection((current) => selectSector(current, sectorId))}
            onSelectStock={(stockCode) =>
              setSelection((current) =>
                selectStock(current, selection.selectedSectorId ?? sector?.summary.sector_id ?? "", stockCode)
              )
            }
          />
        </main>
      ) : null}

      {selection.selectedLevel === "stock" ? (
        <StockOverview overview={stock} period={selection.period} onPeriodChange={updatePeriod} />
      ) : null}

      <div className="screen-reader-only" aria-live="polite">
        {news?.items.length ?? 0} related news items loaded.
      </div>
    </div>
  );
}
