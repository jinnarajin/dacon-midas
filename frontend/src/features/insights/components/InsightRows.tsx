import type { InsightRow } from "../../../entities/market/model";

interface InsightRowsProps {
  rows: InsightRow[];
}

export function InsightRows({ rows }: InsightRowsProps) {
  return (
    <div className="insight-rows">
      {rows.map((row) => (
        <div className="insight-row" key={`${row.label}-${row.basis}`}>
          <span>{row.label}</span>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}
