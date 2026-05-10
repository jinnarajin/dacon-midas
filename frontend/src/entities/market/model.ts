export type SelectionLevel = "market" | "sector" | "stock";
export type RiskLevel = "normal" | "watch" | "risk";
export type RiskFlagLevel = "info" | "watch" | "risk";

export interface MarketSelection {
  level: "market";
  market: string;
}

export interface MarketSummary {
  market_name: string;
  total_stock_count: number;
  rising_stock_count: number;
  falling_stock_count: number;
  flat_stock_count: number;
  rising_stock_ratio: number;
  average_change_rate: number;
  total_trading_value: number;
  dominant_sector_id: string | null;
  risk_level: RiskLevel;
}

export interface SectorTile {
  sector_id: string;
  sector_name: string;
  industry_group: string | null;
  stock_count: number;
  rising_stock_count: number;
  rising_stock_ratio: number;
  average_change_rate: number;
  total_market_cap: number;
  total_trading_value: number;
  volume_growth_rate: number | null;
  volatility: number;
  has_disclosure: boolean;
  keywords: string[];
}

export interface LeadingSector {
  sector_id: string;
  sector_name: string;
  rank: number;
  basis: "trading_value" | "average_change_rate" | "volume_growth_rate" | "market_cap";
  value: number;
}

export interface RiskFlag {
  code: string;
  level: RiskFlagLevel;
  message: string;
}

export interface InsightRow {
  label: string;
  value: string;
  basis: string;
}

export interface Insight {
  headline: string;
  rows: InsightRow[];
  keywords: string[];
}

export interface MarketSummaryResponse {
  selection: MarketSelection;
  as_of: string;
  summary: MarketSummary;
  sector_tiles: SectorTile[];
  leading_sectors: LeadingSector[];
  risk_flags: RiskFlag[];
  insight: Insight;
  related_news_ids: string[];
}
