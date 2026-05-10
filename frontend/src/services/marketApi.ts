import type { MarketSummaryResponse } from "../entities/market/model";
import type { NewsResponse } from "../entities/news/model";
import type { SectorResponse } from "../entities/sector/model";
import type { StockOverviewResponse } from "../entities/stock/model";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function getMarketSummary(): Promise<MarketSummaryResponse> {
  return request<MarketSummaryResponse>("/api/market/summary");
}

export function getSector(sectorId: string): Promise<SectorResponse> {
  return request<SectorResponse>(`/api/sectors/${sectorId}`);
}

export function getStockOverview(stockCode: string): Promise<StockOverviewResponse> {
  return request<StockOverviewResponse>(`/api/stocks/${stockCode}/overview`);
}

export function getNews(params: {
  selectionLevel: "market" | "sector" | "stock";
  sectorId?: string | null;
  stockCode?: string | null;
}): Promise<NewsResponse> {
  const search = new URLSearchParams({ selection_level: params.selectionLevel });
  if (params.sectorId) {
    search.set("sector_id", params.sectorId);
  }
  if (params.stockCode) {
    search.set("stock_code", params.stockCode);
  }
  return request<NewsResponse>(`/api/news?${search.toString()}`);
}
