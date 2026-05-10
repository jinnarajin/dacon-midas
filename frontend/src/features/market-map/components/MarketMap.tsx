import type { MarketSummaryResponse, SectorTile } from "../../../entities/market/model";
import type { SectorResponse, StockTile } from "../../../entities/sector/model";
import { formatKrw, formatPercent } from "../../../shared/lib/formatters";
import type { ColorMetric, MapMetric } from "../../../shared/state/selectionStore";
import { MapLegend } from "./MapLegend";
import { MapToolbar } from "./MapToolbar";

interface MarketMapProps {
  level: "market" | "sector" | "stock";
  market: MarketSummaryResponse | null;
  sector: SectorResponse | null;
  mapMetric: MapMetric;
  colorMetric: ColorMetric;
  onMapMetricChange: (metric: MapMetric) => void;
  onColorMetricChange: (metric: ColorMetric) => void;
  onSelectMarket: () => void;
  onSelectSector: (sectorId: string) => void;
  onSelectStock: (stockCode: string) => void;
}

function changeClass(value: number): string {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function sectorSize(tile: SectorTile, metric: MapMetric): number {
  return metric === "market_cap" ? tile.total_market_cap : tile.total_trading_value;
}

function stockSize(tile: StockTile, metric: MapMetric): number {
  return metric === "market_cap" ? tile.market_cap : tile.trading_value;
}

function colorValue(tile: SectorTile | StockTile, metric: ColorMetric): number {
  return metric === "change_rate"
    ? "average_change_rate" in tile
      ? tile.average_change_rate
      : tile.change_rate
    : tile.volatility;
}

export function MarketMap({
  level,
  market,
  sector,
  mapMetric,
  colorMetric,
  onMapMetricChange,
  onColorMetricChange,
  onSelectMarket,
  onSelectSector,
  onSelectStock
}: MarketMapProps) {
  const sectorTiles = market?.sector_tiles ?? [];
  const stockTiles = sector?.stock_tiles ?? [];
  const maxSectorSize = Math.max(...sectorTiles.map((tile) => sectorSize(tile, mapMetric)), 1);
  const maxStockSize = Math.max(...stockTiles.map((tile) => stockSize(tile, mapMetric)), 1);

  return (
    <section className="map-panel" aria-label="Market map">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{level === "market" ? "Market" : "Sector"}</p>
          <h2>{level === "market" ? "Sector Map" : `${sector?.summary.sector_name ?? ""} Stocks`}</h2>
        </div>
        {level !== "market" ? (
          <button className="ghost-button" type="button" onClick={onSelectMarket}>
            Back to market
          </button>
        ) : null}
      </div>

      <MapToolbar
        mapMetric={mapMetric}
        colorMetric={colorMetric}
        onMapMetricChange={onMapMetricChange}
        onColorMetricChange={onColorMetricChange}
      />
      <MapLegend />

      <div className="summary-strip">
        <span>{formatPercent(market?.summary.rising_stock_ratio)} rising</span>
        <span>{formatPercent(market?.summary.average_change_rate)} avg change</span>
        <span>{formatKrw(market?.summary.total_trading_value)} traded</span>
      </div>

      <div className="tile-grid">
        {level === "market"
          ? sectorTiles.map((tile) => {
              const basis = sectorSize(tile, mapMetric) / maxSectorSize;
              const tone = changeClass(colorValue(tile, colorMetric));
              return (
                <button
                  className={`map-tile ${tone}`}
                  key={tile.sector_id}
                  style={{ flexGrow: Math.max(0.35, basis * 2.5) }}
                  type="button"
                  onClick={() => onSelectSector(tile.sector_id)}
                >
                  <strong>{tile.sector_name}</strong>
                  <span>{formatPercent(tile.average_change_rate)}</span>
                  <small>{formatKrw(tile.total_trading_value)}</small>
                </button>
              );
            })
          : stockTiles.map((tile) => {
              const basis = stockSize(tile, mapMetric) / maxStockSize;
              const tone = changeClass(colorValue(tile, colorMetric));
              return (
                <button
                  className={`map-tile ${tone}`}
                  key={tile.stock_code}
                  style={{ flexGrow: Math.max(0.35, basis * 2.5) }}
                  type="button"
                  onClick={() => onSelectStock(tile.stock_code)}
                >
                  <strong>{tile.stock_name}</strong>
                  <span>{formatPercent(tile.change_rate)}</span>
                  <small>{formatKrw(tile.trading_value)}</small>
                </button>
              );
            })}
      </div>
    </section>
  );
}
