import type { Insight } from "../../../entities/market/model";
import { InsightRows } from "./InsightRows";

interface InsightPanelProps {
  scope: string;
  insight: Insight | null;
}

export function InsightPanel({ scope, insight }: InsightPanelProps) {
  return (
    <aside className="insight-panel" aria-label="인사이트 패널">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">{scope}</p>
          <h2>인사이트</h2>
        </div>
      </div>
      <p className="headline">{insight?.headline ?? "시장 흐름을 불러오는 중입니다."}</p>
      <InsightRows rows={insight?.rows ?? []} />
      <div className="keyword-list">
        {(insight?.keywords ?? []).map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
    </aside>
  );
}
