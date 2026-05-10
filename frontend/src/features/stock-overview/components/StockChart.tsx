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

export function StockChart({ chart, period, onPeriodChange }: StockChartProps) {
  const latest = chart.price_series[chart.price_series.length - 1];

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
      <svg className="line-chart" viewBox="0 0 100 100" role="img" aria-label="Stock price chart">
        <polyline points={points(chart.price_series)} />
      </svg>
      <p className="chart-caption">
        Latest close {latest ? formatKrw(latest.close) : "-"}
      </p>
    </div>
  );
}
