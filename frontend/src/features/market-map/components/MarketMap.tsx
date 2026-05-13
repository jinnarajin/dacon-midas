import type { CSSProperties } from "react";

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

function toneClass(value: number, metric: ColorMetric): string {
  if (metric === "volatility") {
    if (value >= 1.7) return "watch";
    if (value >= 1.2) return "neutral";
    return "calm";
  }
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

function colorLabel(metric: ColorMetric): string {
  return metric === "change_rate" ? "Change" : "Volatility";
}

function sizeLabel(metric: MapMetric): string {
  return metric === "market_cap" ? "Market cap" : "Trading value";
}

function displayColorValue(tile: SectorTile | StockTile, metric: ColorMetric): string {
  const value = colorValue(tile, metric);
  return metric === "change_rate" ? formatPercent(value) : value.toFixed(2);
}

function displaySizeValue(tile: SectorTile | StockTile, metric: MapMetric): string {
  const value =
    "sector_id" in tile
      ? sectorSize(tile, metric)
      : stockSize(tile, metric);
  return formatKrw(value);
}

function tileStyle(basis: number): CSSProperties {
  const scaled = Math.sqrt(Math.max(0.04, basis));
  return {
    flexGrow: Math.max(0.25, scaled * 3),
    flexBasis: `${150 + scaled * 280}px`,
    minHeight: `${96 + scaled * 150}px`
  };
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
  const activeTiles = level === "market" ? sectorTiles : stockTiles;

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
        <span>Size: {sizeLabel(mapMetric)}</span>
        <span>Color: {colorLabel(colorMetric)}</span>
      </div>

      <div className="tile-grid">
        {activeTiles.length === 0 ? (
          <div className="empty-state">No map data is available for the current selection.</div>
        ) : level === "market"
          ? sectorTiles.map((tile) => {
              const basis = sectorSize(tile, mapMetric) / maxSectorSize;
              const tone = toneClass(colorValue(tile, colorMetric), colorMetric);
              return (
                <button
                  className={`map-tile ${tone}`}
                  key={tile.sector_id}
                  style={tileStyle(basis)}
                  type="button"
                  onClick={() => onSelectSector(tile.sector_id)}
                >
                  <strong>{tile.sector_name}</strong>
                  <span>{displayColorValue(tile, colorMetric)}</span>
                  <small>{sizeLabel(mapMetric)} {displaySizeValue(tile, mapMetric)}</small>
                </button>
              );
            })
          : stockTiles.map((tile) => {
              const basis = stockSize(tile, mapMetric) / maxStockSize;
              const tone = toneClass(colorValue(tile, colorMetric), colorMetric);
              return (
                <button
                  className={`map-tile ${tone}`}
                  key={tile.stock_code}
                  style={tileStyle(basis)}
                  type="button"
                  onClick={() => onSelectStock(tile.stock_code)}
                >
                  <strong>{tile.stock_name}</strong>
                  <span>{displayColorValue(tile, colorMetric)}</span>
                  <small>{sizeLabel(mapMetric)} {displaySizeValue(tile, mapMetric)}</small>
                </button>
              );
            })}
      </div>
    </section>
  );
}
