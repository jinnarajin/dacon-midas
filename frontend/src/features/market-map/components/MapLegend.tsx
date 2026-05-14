export function MapLegend() {
  return (
    <div className="map-legend" aria-label="Map legend">
      <span>
        <i className="dot up" /> 상승
      </span>
      <span>
        <i className="dot down" /> 하락
      </span>
      <span>
        <i className="dot watch" /> 변동성
      </span>
    </div>
  );
}
