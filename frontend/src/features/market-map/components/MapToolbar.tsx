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
    <div className="toolbar-row" aria-label="Map controls">
      <div className="segmented" aria-label="Tile size metric">
        <button
          className={mapMetric === "market_cap" ? "active" : ""}
          type="button"
          onClick={() => onMapMetricChange("market_cap")}
        >
          Market cap
        </button>
        <button
          className={mapMetric === "trading_value" ? "active" : ""}
          type="button"
          onClick={() => onMapMetricChange("trading_value")}
        >
          Trading value
        </button>
      </div>
      <div className="segmented" aria-label="Tile color metric">
        <button
          className={colorMetric === "change_rate" ? "active" : ""}
          type="button"
          onClick={() => onColorMetricChange("change_rate")}
        >
          Change
        </button>
        <button
          className={colorMetric === "volatility" ? "active" : ""}
          type="button"
          onClick={() => onColorMetricChange("volatility")}
        >
          Volatility
        </button>
      </div>
    </div>
  );
}
