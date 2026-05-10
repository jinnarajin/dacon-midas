import type { Insight } from "../../../entities/market/model";
import { InsightRows } from "./InsightRows";

interface InsightPanelProps {
  scope: string;
  insight: Insight | null;
}

export function InsightPanel({ scope, insight }: InsightPanelProps) {
  return (
    <aside className="insight-panel" aria-label="Insight panel">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">{scope}</p>
          <h2>Insight</h2>
        </div>
      </div>
      <p className="headline">{insight?.headline ?? "Loading market context."}</p>
      <InsightRows rows={insight?.rows ?? []} />
      <div className="keyword-list">
        {(insight?.keywords ?? []).map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
    </aside>
  );
}
