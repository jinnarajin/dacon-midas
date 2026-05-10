import type { Insight, RiskFlag, RiskLevel } from "../market/model";

export interface SectorSelection {
  level: "sector";
  market: string;
  sector_id: string;
}

export interface SectorSummary {
  sector_id: string;
  sector_name: string;
  industry_group: string | null;
  stock_count: number;
  rising_stock_count: number;
  falling_stock_count: number;
  flat_stock_count: number;
  rising_stock_ratio: number;
  average_change_rate: number;
  market_average_change_rate: number;
  excess_return: number;
  total_market_cap: number;
  total_trading_value: number;
  volume_growth_rate: number | null;
  volatility: number;
  risk_level: RiskLevel;
  keywords: string[];
}

export interface StockTile {
  stock_code: string;
  stock_name: string;
  market: "KOSPI" | "KOSDAQ" | "KONEX" | "OTHER";
  industry: string | null;
  current_price: number;
  previous_close: number;
  change_rate: number;
  excess_return: number;
  volume: number;
  average_volume: number | null;
  volume_growth_rate: number | null;
  trading_value: number;
  market_cap: number;
  volatility: number;
  has_disclosure: boolean;
  keywords: string[];
}

export interface GainerRankItem {
  stock_code: string;
  stock_name: string;
  rank: number;
  change_rate: number;
}

export interface TradingValueRankItem {
  stock_code: string;
  stock_name: string;
  rank: number;
  trading_value: number;
}

export interface SectorRankings {
  top_gainers: GainerRankItem[];
  top_decliners: GainerRankItem[];
  trading_value_leaders: TradingValueRankItem[];
}

export interface SectorResponse {
  selection: SectorSelection;
  as_of: string;
  summary: SectorSummary;
  stock_tiles: StockTile[];
  rankings: SectorRankings;
  risk_flags: RiskFlag[];
  insight: Insight;
  related_news_ids: string[];
}
