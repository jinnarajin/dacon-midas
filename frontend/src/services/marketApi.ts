import type { MarketSummaryResponse } from "../entities/market/model";
import type { NewsResponse } from "../entities/news/model";
import type { SectorResponse } from "../entities/sector/model";
import type { StockOverviewResponse } from "../entities/stock/model";
import { fallbackMarketSummary, fallbackNews, fallbackSector, fallbackStockOverview } from "./fallbackData";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function requestWithFallback<T>(path: string, fallback: () => T): Promise<T> {
  try {
    return await request<T>(path);
  } catch {
    return fallback();
  }
}

export function getMarketSummary(): Promise<MarketSummaryResponse> {
  return requestWithFallback<MarketSummaryResponse>("/api/market/summary", fallbackMarketSummary);
}

export function getSector(sectorId: string): Promise<SectorResponse> {
  return requestWithFallback<SectorResponse>(`/api/sectors/${sectorId}`, () => fallbackSector(sectorId));
}

export function getStockOverview(stockCode: string): Promise<StockOverviewResponse> {
  return requestWithFallback<StockOverviewResponse>(
    `/api/stocks/${stockCode}/overview`,
    () => fallbackStockOverview(stockCode)
  );
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
  return requestWithFallback<NewsResponse>(`/api/news?${search.toString()}`, fallbackNews);
}
