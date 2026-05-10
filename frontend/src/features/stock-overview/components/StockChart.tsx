import type { ChartPeriod, PricePoint, StockChart as StockChartData } from "../../../entities/stock/model";
import { formatKrw } from "../../../shared/lib/formatters";

interface StockChartProps {
  chart: StockChartData;
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}

function points(series: PricePoint[]): string {
  if (series.length === 0) return "";
  const min = Math.min(...series.map((point) => point.close));
  const max = Math.max(...series.map((point) => point.close));
  const range = Math.max(1, max - min);
  return series
    .map((point, index) => {
      const x = series.length === 1 ? 50 : (index / (series.length - 1)) * 100;
      const y = 90 - ((point.close - min) / range) * 70;
      return `${x},${y}`;
    })
    .join(" ");
}

function periodLimit(period: ChartPeriod): number {
  switch (period) {
    case "1D":
      return 1;
    case "1W":
      return 5;
    case "1M":
      return 22;
    case "3M":
      return 66;
    case "1Y":
      return 252;
  }
}

export function StockChart({ chart, period, onPeriodChange }: StockChartProps) {
  const visibleSeries = chart.price_series.slice(-periodLimit(period));
  const latest = visibleSeries[visibleSeries.length - 1];

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <strong>Price Flow</strong>
        <div className="period-tabs">
          {chart.available_periods.map((item) => (
            <button
              className={period === item ? "active" : ""}
              key={item}
              type="button"
              onClick={() => onPeriodChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {visibleSeries.length > 0 ? (
        <>
          <svg className="line-chart" viewBox="0 0 100 100" role="img" aria-label="Stock price chart">
            <polyline points={points(visibleSeries)} />
          </svg>
          <div className="volume-bars" aria-label="Volume bars">
            {visibleSeries.map((point) => {
              const maxVolume = Math.max(...visibleSeries.map((item) => item.volume), 1);
              return (
                <span
                  key={point.date}
                  style={{ height: `${Math.max(12, (point.volume / maxVolume) * 64)}px` }}
                  title={`${point.date} volume ${point.volume}`}
                />
              );
            })}
          </div>
          <p className="chart-caption">
            {period} close {latest ? formatKrw(latest.close) : "-"}
          </p>
        </>
      ) : (
        <div className="empty-state">No chart data is available for this period.</div>
      )}
    </div>
  );
}
