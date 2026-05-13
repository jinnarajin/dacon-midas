import type { ChartPeriod, StockOverviewResponse } from "../../../entities/stock/model";
import { formatKrw, formatPercent } from "../../../shared/lib/formatters";
import { StockChart } from "./StockChart";
import { StockKpiGrid } from "./StockKpiGrid";

interface StockOverviewProps {
  overview: StockOverviewResponse | null;
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}

export function StockOverview({ overview, period, onPeriodChange }: StockOverviewProps) {
  if (!overview) {
    return null;
  }

  return (
    <section className="stock-overview" aria-label="종목 Overview">
      <div className="overview-header">
        <div>
          <p className="eyebrow">{overview.identity.sector_name}</p>
          <h2>{overview.identity.stock_name}</h2>
          <span>
            {overview.identity.stock_code} / {overview.identity.market}
          </span>
        </div>
        <div className="quote-box">
          <strong>{formatKrw(overview.quote.current_price)}</strong>
          <span>{formatPercent(overview.quote.change_rate)}</span>
        </div>
      </div>
      <StockKpiGrid kpis={overview.kpis} />
      <StockChart chart={overview.chart} period={period} onPeriodChange={onPeriodChange} />
    </section>
  );
}
