export function MapLegend() {
  return (
    <div className="map-legend" aria-label="Map legend">
      <span>
        <i className="dot up" /> Rising
      </span>
      <span>
        <i className="dot down" /> Falling
      </span>
      <span>
        <i className="dot watch" /> Watch
      </span>
    </div>
  );
}
