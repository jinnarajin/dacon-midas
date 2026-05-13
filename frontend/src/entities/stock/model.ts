import type { Insight, RiskFlag } from "../market/model";

export type ListingMarket = "KOSPI" | "KOSDAQ" | "KONEX" | "OTHER";
export type ChartPeriod = "1D" | "1W" | "1M" | "3M" | "1Y";
export type KpiUnit = "krw" | "number" | "percent" | "rank" | "text";
export type KpiStatus = "positive" | "negative" | "neutral" | "watch" | "risk";

export interface StockSelection {
  level: "stock";
  market: string;
  sector_id: string;
  stock_code: string;
}

export interface StockIdentity {
  stock_code: string;
  stock_name: string;
  market: ListingMarket;
  sector_id: string;
  sector_name: string;
  industry: string | null;
}

export interface StockQuote {
  current_price: number;
  previous_close: number;
  change: number | null;
  change_rate: number;
  volume: number;
  average_volume: number | null;
  volume_growth_rate: number | null;
  trading_value: number;
  market_cap: number | null;
  volatility: number | null;
  has_disclosure: boolean;
}

export interface StockKpi {
  key: string;
  label: string;
  value: number | string | null;
  unit: KpiUnit;
  status: KpiStatus;
}

export interface SectorComparison {
  sector_average_change_rate: number;
  excess_return: number;
  sector_average_volume_growth_rate: number | null;
  volume_growth_gap: number | null;
  rank_in_sector_by_change_rate: number | null;
  rank_in_sector_by_trading_value: number | null;
  sector_stock_count: number;
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface VolumePoint {
  date: string;
  volume: number;
}

export interface StockChart {
  default_period: ChartPeriod;
  available_periods: ChartPeriod[];
  price_series: PricePoint[];
  volume_series: VolumePoint[];
  period_series?: Partial<Record<ChartPeriod, PricePoint[]>>;
}

export interface StockOverviewResponse {
  selection: StockSelection;
  as_of: string;
  identity: StockIdentity;
  quote: StockQuote;
  kpis: StockKpi[];
  sector_comparison: SectorComparison;
  chart: StockChart;
  risk_flags: RiskFlag[];
  insight: Insight;
  related_news_ids: string[];
  related_disclosure_ids: string[];
}
