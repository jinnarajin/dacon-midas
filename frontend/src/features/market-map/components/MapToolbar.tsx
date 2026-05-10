import type { ColorMetric, MapMetric } from "../../../shared/state/selectionStore";

interface MapToolbarProps {
  mapMetric: MapMetric;
  colorMetric: ColorMetric;
  onMapMetricChange: (metric: MapMetric) => void;
  onColorMetricChange: (metric: ColorMetric) => void;
}

export function MapToolbar({
  mapMetric,
  colorMetric,
  onMapMetricChange,
  onColorMetricChange
}: MapToolbarProps) {
  return (
    <div className="toolbar-row" aria-label="맵 설정">
      <div className="segmented" aria-label="타일 크기 기준">
        <button
          className={mapMetric === "market_cap" ? "active" : ""}
          type="button"
          onClick={() => onMapMetricChange("market_cap")}
        >
          시가총액
        </button>
        <button
          className={mapMetric === "trading_value" ? "active" : ""}
          type="button"
          onClick={() => onMapMetricChange("trading_value")}
        >
          거래대금
        </button>
      </div>
      <div className="segmented" aria-label="타일 색상 기준">
        <button
          className={colorMetric === "change_rate" ? "active" : ""}
          type="button"
          onClick={() => onColorMetricChange("change_rate")}
        >
          등락률
        </button>
        <button
          className={colorMetric === "volatility" ? "active" : ""}
          type="button"
          onClick={() => onColorMetricChange("volatility")}
        >
          변동성
        </button>
      </div>
    </div>
  );
}
