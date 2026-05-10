import { useEffect, useMemo, useState } from "react";

import type { MarketSummaryResponse } from "../entities/market/model";
import type { NewsResponse } from "../entities/news/model";
import type { SectorResponse } from "../entities/sector/model";
import type { ChartPeriod, StockOverviewResponse } from "../entities/stock/model";
import { InsightPanel } from "../features/insights/components/InsightPanel";
import { MarketMap } from "../features/market-map/components/MarketMap";
import { NewsDock } from "../features/news-feed/components/NewsDock";
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

  const activeInsight = useMemo(() => {
    if (selection.selectedLevel === "stock") return stock?.insight ?? null;
    if (selection.selectedLevel === "sector") return sector?.insight ?? null;
    return market?.insight ?? null;
  }, [market, sector, selection.selectedLevel, stock]);

  const insightScope =
    selection.selectedLevel === "stock"
      ? stock?.identity.stock_name ?? "Stock"
      : selection.selectedLevel === "sector"
        ? sector?.summary.sector_name ?? "Sector"
        : "Market";

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
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Market Cloud</p>
          <h1>Market Intelligence Dashboard</h1>
        </div>
        <div className="status-pill">{market?.as_of ?? "Loading"}</div>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

      <main className="dashboard-grid">
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
        <InsightPanel scope={insightScope} insight={activeInsight} />
      </main>

      <StockOverview overview={stock} period={selection.period} onPeriodChange={updatePeriod} />
      <NewsDock news={news} />
    </div>
  );
}
