import { useEffect, useMemo, useState } from "react";

import type { MarketSummaryResponse } from "../entities/market/model";
import type { NewsResponse } from "../entities/news/model";
import type { SectorResponse } from "../entities/sector/model";
import type { ChartPeriod, StockOverviewResponse } from "../entities/stock/model";
import { MarketMap } from "../features/market-map/components/MarketMap";
import { StockOverview } from "../features/stock-overview/components/StockOverview";
import { getMarketSummary, getNews, getSector, getStockOverview } from "../services/marketApi";
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
    <div className="app-shell map-only-shell" data-theme={theme}>
      <header className="app-header">
        <div>
          <p className="eyebrow">Market Cloud</p>
          <h1>섹터 계층 맵</h1>
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            aria-label="테마 전환"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <div className="status-pill">{market?.as_of ?? "Loading"}</div>
        </div>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

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

      {selection.selectedLevel === "stock" ? (
        <StockOverview overview={stock} period={selection.period} onPeriodChange={updatePeriod} />
      ) : null}

      <div className="screen-reader-only" aria-live="polite">
        {news?.items.length ?? 0} related news items loaded.
      </div>
    </div>
  );
}
