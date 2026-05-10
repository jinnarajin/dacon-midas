import type { StockKpi } from "../../../entities/stock/model";
import { formatKrw, formatNumber, formatPercent } from "../../../shared/lib/formatters";

interface StockKpiGridProps {
  kpis: StockKpi[];
}

function formatKpi(kpi: StockKpi): string {
  if (typeof kpi.value === "string") return kpi.value;
  if (kpi.unit === "percent") return formatPercent(kpi.value);
  if (kpi.unit === "krw") return formatKrw(kpi.value);
  return formatNumber(kpi.value);
}

export function StockKpiGrid({ kpis }: StockKpiGridProps) {
  return (
    <div className="kpi-grid">
      {kpis.map((kpi) => (
        <div className={`kpi ${kpi.status}`} key={kpi.key}>
          <span>{kpi.label}</span>
          <strong>{formatKpi(kpi)}</strong>
        </div>
      ))}
    </div>
  );
}
