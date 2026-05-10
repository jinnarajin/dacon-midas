import type { ChartPeriod } from "../../entities/stock/model";

export type SelectedLevel = "market" | "sector" | "stock";
export type MapMetric = "market_cap" | "trading_value";
export type ColorMetric = "change_rate" | "volatility";

export interface SelectionState {
  selectedLevel: SelectedLevel;
  selectedSectorId: string | null;
  selectedStockCode: string | null;
  mapMetric: MapMetric;
  colorMetric: ColorMetric;
  period: ChartPeriod;
}

export const initialSelectionState: SelectionState = {
  selectedLevel: "market",
  selectedSectorId: null,
  selectedStockCode: null,
  mapMetric: "market_cap",
  colorMetric: "change_rate",
  period: "1M"
};

export function selectMarket(state: SelectionState): SelectionState {
  return {
    ...state,
    selectedLevel: "market",
    selectedSectorId: null,
    selectedStockCode: null
  };
}

export function selectSector(state: SelectionState, sectorId: string): SelectionState {
  return {
    ...state,
    selectedLevel: "sector",
    selectedSectorId: sectorId,
    selectedStockCode: null
  };
}

export function selectStock(
  state: SelectionState,
  sectorId: string,
  stockCode: string
): SelectionState {
  return {
    ...state,
    selectedLevel: "stock",
    selectedSectorId: sectorId,
    selectedStockCode: stockCode
  };
}
