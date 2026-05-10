export function MapLegend() {
  return (
    <div className="map-legend" aria-label="맵 범례">
      <span>
        <i className="dot up" /> 상승
      </span>
      <span>
        <i className="dot down" /> 하락
      </span>
      <span>
        <i className="dot watch" /> 주의
      </span>
    </div>
  );
}
