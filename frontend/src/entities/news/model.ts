export type NewsItemType = "news" | "disclosure" | "report";

export interface NewsSelection {
  level: "market" | "sector" | "stock";
  market: string;
  sector_id: string | null;
  stock_code: string | null;
}

export interface NewsItem {
  id: string;
  item_type: NewsItemType;
  title: string;
  source: string;
  published_at: string;
  url: string | null;
  summary: string | null;
  related_market: string;
  related_sector_ids: string[];
  related_stock_codes: string[];
  tags: string[];
  priority: number;
  is_direct_match: boolean;
}

export interface NewsEmptyState {
  message: string;
  reason: string;
}

export interface NewsResponse {
  selection: NewsSelection;
  as_of: string;
  items: NewsItem[];
  empty_state: NewsEmptyState | null;
}
