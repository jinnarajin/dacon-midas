import type { MarketSummaryResponse, SectorTile } from "../entities/market/model";
import type { NewsResponse } from "../entities/news/model";
import type { SectorResponse, StockTile } from "../entities/sector/model";
import type { StockOverviewResponse } from "../entities/stock/model";

const AS_OF = "2026-05-10 15:30:00";

const sectors: SectorTile[] = [
  sector("information_technology", "정보기술 (Information Technology)", 246, 164, 1.86, 982000000000000, 2480000000000, 82.4, 1.42, ["semiconductors", "software"]),
  sector("financials", "금융 (Financials)", 188, 94, 0.18, 351000000000000, 880000000000, 24.6, 0.92, ["banks", "insurance"]),
  sector("health_care", "헬스케어 (Health Care)", 312, 141, -0.42, 226000000000000, 690000000000, 36.2, 1.66, ["biotech", "pharma"]),
  sector("consumer_discretionary", "임의소비재 (Consumer Discretionary)", 286, 159, 0.64, 312000000000000, 940000000000, 41.8, 1.24, ["autos", "retail"]),
  sector("consumer_staples", "필수소비재 (Consumer Staples)", 124, 70, 0.28, 118000000000000, 260000000000, 18.9, 0.78, ["food", "household"]),
  sector("industrials", "산업재 (Industrials)", 364, 218, 1.12, 275000000000000, 1050000000000, 68.1, 1.38, ["shipbuilding", "defense"]),
  sector("energy", "에너지 (Energy)", 76, 35, -0.18, 72000000000000, 240000000000, 31.4, 1.52, ["oil", "gas"]),
  sector("materials", "원자재 (Materials)", 224, 89, -0.96, 286000000000000, 760000000000, 52.7, 1.84, ["chemicals", "steel"]),
  sector("utilities", "유틸리티 (Utilities)", 42, 20, 0.06, 39000000000000, 85000000000, 12.8, 0.64, ["power", "gas"]),
  sector("communication_services", "통신서비스 (Communication Services)", 118, 72, 0.92, 176000000000000, 540000000000, 46.5, 1.18, ["telecom", "platforms"]),
  sector("real_estate", "부동산 (Real Estate)", 58, 24, -0.24, 44000000000000, 110000000000, 21.6, 1.04, ["REITs", "developers"])
];

const stocksBySector: Record<string, StockTile[]> = {
  information_technology: [
    stock("005930", "Samsung Electronics", "Semiconductors", 81200, 2.14, 1880000, 1210000, 152656000000, 484000000000000, 1.28, ["memory", "AI server"]),
    stock("000660", "SK hynix", "Semiconductors", 189400, 4.12, 650000, 310000, 123110000000, 137800000000000, 1.88, ["HBM", "memory"]),
    stock("035420", "NAVER", "Internet Software", 214000, 1.24, 939000, 582000, 201000000000, 54000000000000, 1.14, ["AI", "cloud"]),
    stock("042700", "Hanmi Semiconductor", "Semiconductor Equipment", 154300, -1.25, 484000, 391000, 74700000000, 14900000000000, 2.04, ["equipment", "HBM"])
  ],
  financials: [
    stock("105560", "KB Financial", "Banks", 84200, -0.21, 1377000, 950000, 116000000000, 33000000000000, 0.82, ["bank", "dividend"]),
    stock("055550", "Shinhan Financial", "Banks", 51100, 0.34, 1660000, 1180000, 84800000000, 26400000000000, 0.78, ["bank", "NIM"]),
    stock("086790", "Hana Financial", "Banks", 62800, 0.18, 1190000, 920000, 74700000000, 18300000000000, 0.74, ["bank", "FX"])
  ],
  health_care: [
    stock("207940", "Samsung Biologics", "CDMO", 821000, -0.48, 112000, 87000, 92000000000, 58400000000000, 1.16, ["CDMO", "capacity"]),
    stock("068270", "Celltrion", "Biotechnology", 183000, 1.08, 502000, 390000, 91900000000, 39800000000000, 1.22, ["biosimilar", "drug"])
  ],
  consumer_discretionary: [
    stock("005380", "Hyundai Motor", "Automobiles", 263000, 0.58, 840000, 639000, 221000000000, 55000000000000, 1.02, ["autos", "hybrid"]),
    stock("000270", "Kia", "Automobiles", 111500, 0.74, 1776000, 1369000, 198000000000, 44000000000000, 1.06, ["autos", "SUV"])
  ],
  consumer_staples: [
    stock("097950", "CJ CheilJedang", "Food Products", 332000, 0.22, 67000, 51000, 22200000000, 5000000000000, 0.72, ["food", "margin"]),
    stock("004370", "Nongshim", "Food Products", 407500, 0.54, 42000, 33000, 17100000000, 2500000000000, 0.76, ["noodles", "exports"])
  ],
  industrials: [
    stock("329180", "HD Hyundai Heavy", "Shipbuilding", 178000, 2.64, 697000, 343000, 124000000000, 15800000000000, 1.94, ["LNG", "orders"]),
    stock("012450", "Hanwha Aerospace", "Defense", 349500, 2.18, 431000, 244000, 150600000000, 17600000000000, 1.86, ["defense", "engine"])
  ],
  energy: [
    stock("096770", "SK Innovation", "Oil & Gas", 118600, -0.34, 498000, 391000, 59100000000, 11000000000000, 1.32, ["oil", "battery"]),
    stock("010950", "S-Oil", "Oil Refining", 68800, 0.48, 332000, 251000, 22800000000, 7750000000000, 1.18, ["refining", "spread"])
  ],
  materials: [
    stock("051910", "LG Chem", "Chemicals", 402000, -1.32, 443000, 310000, 178000000000, 31000000000000, 1.88, ["chemicals", "battery"]),
    stock("005490", "POSCO Holdings", "Steel", 392000, -0.54, 361000, 284000, 141500000000, 33200000000000, 1.42, ["steel", "lithium"])
  ],
  utilities: [
    stock("015760", "KEPCO", "Electric Utilities", 21950, 0.06, 1840000, 1520000, 40400000000, 14100000000000, 0.62, ["power", "tariff"]),
    stock("036460", "Korea Gas", "Gas Utilities", 38200, -0.18, 311000, 250000, 11900000000, 3530000000000, 0.78, ["gas", "import"])
  ],
  communication_services: [
    stock("017670", "SK Telecom", "Telecom", 55200, 0.42, 792000, 641000, 43700000000, 11900000000000, 0.84, ["telecom", "AI"]),
    stock("035720", "Kakao", "Interactive Media", 58900, -0.74, 2428000, 1900000, 143000000000, 26000000000000, 1.48, ["platform", "ads"])
  ],
  real_estate: [
    stock("357120", "Koramco REITs", "REITs", 4780, 0.12, 480000, 410000, 2290000000, 390000000000, 0.58, ["REIT", "dividend"]),
    stock("334890", "IGIS Value Plus REIT", "REITs", 5120, -0.08, 260000, 220000, 1330000000, 270000000000, 0.52, ["REIT", "office"])
  ]
};

export function fallbackMarketSummary(): MarketSummaryResponse {
  return {
    selection: { level: "market", market: "KR" },
    as_of: AS_OF,
    summary: {
      market_name: "Korea Stock Market",
      total_stock_count: 2400,
      rising_stock_count: 1320,
      falling_stock_count: 910,
      flat_stock_count: 170,
      rising_stock_ratio: 55,
      average_change_rate: 0.74,
      total_trading_value: 14230000000000,
      dominant_sector_id: "information_technology",
      risk_level: "normal"
    },
    sector_tiles: sectors,
    leading_sectors: sectors.slice(0, 3).map((item, index) => ({
      sector_id: item.sector_id,
      sector_name: item.sector_name,
      rank: index + 1,
      basis: "trading_value",
      value: item.total_trading_value
    })),
    risk_flags: [],
    insight: { headline: "Fallback GICS sector map is available.", rows: [], keywords: ["GICS"] },
    related_news_ids: []
  };
}

export function fallbackSector(sectorId: string): SectorResponse {
  const sectorTile = sectors.find((item) => item.sector_id === sectorId) ?? sectors[0];
  const stockTiles = stocksBySector[sectorTile.sector_id] ?? stocksBySector.information_technology;
  return {
    selection: { level: "sector", market: "KR", sector_id: sectorTile.sector_id },
    as_of: AS_OF,
    summary: {
      sector_id: sectorTile.sector_id,
      sector_name: sectorTile.sector_name,
      industry_group: sectorTile.industry_group,
      stock_count: sectorTile.stock_count,
      rising_stock_count: sectorTile.rising_stock_count,
      falling_stock_count: sectorTile.stock_count - sectorTile.rising_stock_count,
      flat_stock_count: 0,
      rising_stock_ratio: sectorTile.rising_stock_ratio,
      average_change_rate: sectorTile.average_change_rate,
      market_average_change_rate: 0.74,
      excess_return: sectorTile.average_change_rate - 0.74,
      total_market_cap: sectorTile.total_market_cap,
      total_trading_value: sectorTile.total_trading_value,
      volume_growth_rate: sectorTile.volume_growth_rate,
      volatility: sectorTile.volatility,
      risk_level: sectorTile.volatility >= 1.7 ? "watch" : "normal",
      keywords: sectorTile.keywords
    },
    stock_tiles: stockTiles,
    rankings: {
      top_gainers: stockTiles.map((item, index) => ({ stock_code: item.stock_code, stock_name: item.stock_name, rank: index + 1, change_rate: item.change_rate })),
      top_decliners: stockTiles.slice().reverse().map((item, index) => ({ stock_code: item.stock_code, stock_name: item.stock_name, rank: index + 1, change_rate: item.change_rate })),
      trading_value_leaders: stockTiles.map((item, index) => ({ stock_code: item.stock_code, stock_name: item.stock_name, rank: index + 1, trading_value: item.trading_value }))
    },
    risk_flags: [],
    insight: { headline: `${sectorTile.sector_name} fallback companies are loaded.`, rows: [], keywords: sectorTile.keywords },
    related_news_ids: []
  };
}

export function fallbackStockOverview(stockCode: string): StockOverviewResponse {
  const match = Object.entries(stocksBySector).flatMap(([sectorId, items]) =>
    items.map((item) => ({ sectorId, item }))
  ).find(({ item }) => item.stock_code === stockCode);
  const sectorId = match?.sectorId ?? "information_technology";
  const sectorTile = sectors.find((item) => item.sector_id === sectorId) ?? sectors[0];
  const item = match?.item ?? stocksBySector.information_technology[0];
  const change = item.current_price - item.previous_close;
  return {
    selection: { level: "stock", market: "KR", sector_id: sectorId, stock_code: item.stock_code },
    as_of: AS_OF,
    identity: { stock_code: item.stock_code, stock_name: item.stock_name, market: item.market, sector_id: sectorId, sector_name: sectorTile.sector_name, industry: item.industry },
    quote: { current_price: item.current_price, previous_close: item.previous_close, change, change_rate: item.change_rate, volume: item.volume, average_volume: item.average_volume, volume_growth_rate: item.volume_growth_rate, trading_value: item.trading_value, market_cap: item.market_cap, volatility: item.volatility, has_disclosure: item.has_disclosure },
    kpis: [
      { key: "change_rate", label: "Change rate", value: item.change_rate, unit: "percent", status: item.change_rate >= 0 ? "positive" : "negative" },
      { key: "trading_value", label: "Trading value", value: item.trading_value, unit: "krw", status: "neutral" }
    ],
    sector_comparison: { sector_average_change_rate: sectorTile.average_change_rate, excess_return: item.change_rate - sectorTile.average_change_rate, sector_average_volume_growth_rate: sectorTile.volume_growth_rate, volume_growth_gap: 0, rank_in_sector_by_change_rate: null, rank_in_sector_by_trading_value: null, sector_stock_count: sectorTile.stock_count },
    chart: {
      default_period: "1M",
      available_periods: ["1D", "1W", "1M", "3M", "1Y"],
      price_series: [
        { date: "2026-05-08", open: item.previous_close, high: Math.max(item.previous_close, item.current_price), low: Math.min(item.previous_close, item.current_price), close: item.previous_close, volume: item.average_volume ?? item.volume },
        { date: "2026-05-10", open: item.previous_close, high: Math.max(item.previous_close, item.current_price), low: Math.min(item.previous_close, item.current_price), close: item.current_price, volume: item.volume }
      ],
      volume_series: [
        { date: "2026-05-08", volume: item.average_volume ?? item.volume },
        { date: "2026-05-10", volume: item.volume }
      ]
    },
    risk_flags: [],
    insight: { headline: `${item.stock_name} fallback overview is available.`, rows: [], keywords: item.keywords },
    related_news_ids: [],
    related_disclosure_ids: []
  };
}

export function fallbackNews(): NewsResponse {
  return {
    selection: { level: "market", market: "KR", sector_id: null, stock_code: null },
    as_of: AS_OF,
    items: [],
    empty_state: { message: "Fallback mode: no related news is available.", reason: "fallback" }
  };
}

function sector(
  sector_id: string,
  sector_name: string,
  stock_count: number,
  rising_stock_count: number,
  average_change_rate: number,
  total_market_cap: number,
  total_trading_value: number,
  volume_growth_rate: number,
  volatility: number,
  keywords: string[]
): SectorTile {
  return {
    sector_id,
    sector_name,
    industry_group: "GICS Sector",
    stock_count,
    rising_stock_count,
    rising_stock_ratio: (rising_stock_count / stock_count) * 100,
    average_change_rate,
    total_market_cap,
    total_trading_value,
    volume_growth_rate,
    volatility,
    has_disclosure: volatility >= 1.7,
    keywords
  };
}

function stock(
  stock_code: string,
  stock_name: string,
  industry: string,
  current_price: number,
  change_rate: number,
  volume: number,
  average_volume: number,
  trading_value: number,
  market_cap: number,
  volatility: number,
  keywords: string[]
): StockTile {
  const previous_close = Math.round(current_price / (1 + change_rate / 100));
  return {
    stock_code,
    stock_name,
    market: "KOSPI",
    industry,
    current_price,
    previous_close,
    change_rate,
    excess_return: 0,
    volume,
    average_volume,
    volume_growth_rate: ((volume - average_volume) / average_volume) * 100,
    trading_value,
    market_cap,
    volatility,
    has_disclosure: volatility >= 1.7,
    keywords
  };
}
