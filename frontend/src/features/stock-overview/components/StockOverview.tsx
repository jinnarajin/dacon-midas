import type { ChartPeriod, StockOverviewResponse } from "../../../entities/stock/model";
import { formatKrw, formatNumber, formatPercent } from "../../../shared/lib/formatters";
import { StockChart } from "./StockChart";

interface StockOverviewProps {
  overview: StockOverviewResponse | null;
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}

export function StockOverview({ overview, period, onPeriodChange }: StockOverviewProps) {
  if (!overview) {
    return null;
  }

  const quote = overview.quote;
  const isPositive = quote.change_rate >= 0;
  const changePrefix = isPositive ? "+" : "";
  const volumeGrowth = quote.volume_growth_rate ?? 0;
  const volumeGrowthPrefix = volumeGrowth >= 0 ? "+" : "";
  const newsRows = [
    {
      time: "09:25",
      type: "뉴스",
      title: `${overview.identity.stock_name}, sector momentum remains in focus`,
      summary: `${overview.identity.sector_name} 흐름과 거래대금 변화가 단기 관심 구간을 형성하고 있습니다.`,
      source: "Market Cloud"
    },
    {
      time: "09:12",
      type: "리포트",
      title: `${overview.identity.stock_name} volume and price trend update`,
      summary: `거래량은 ${formatNumber(quote.volume)}주, 거래대금은 ${formatKrw(quote.trading_value)} 수준입니다.`,
      source: "Sample Desk"
    },
    {
      time: "08:45",
      type: "공시",
      title: `${overview.identity.stock_code} related disclosure watch`,
      summary: quote.has_disclosure ? "관련 공시 플래그가 감지되었습니다." : "현재 직접 연결된 공시 플래그는 없습니다.",
      source: "DART"
    }
  ];

  return (
    <section className="stock-overview stock-terminal" aria-label="Stock Overview">
      <header className="stock-terminal-hero">
        <div className="stock-title-block">
          <div className="stock-name-row">
            <h2>{overview.identity.stock_name}</h2>
            <button type="button" aria-label="Add to watchlist">☆</button>
          </div>
          <p>
            {overview.identity.stock_code}
            <span>|</span>
            {overview.identity.market}
            <span>|</span>
            {overview.identity.sector_name}
            {overview.identity.industry ? (
              <>
                <span>|</span>
                {overview.identity.industry}
              </>
            ) : null}
          </p>
        </div>

        <div className="stock-price-block">
          <strong>{formatNumber(quote.current_price)}원</strong>
          <em className={isPositive ? "positive" : "negative"}>
            {changePrefix}{formatKrw(quote.change)} · {changePrefix}{formatPercent(quote.change_rate)}
          </em>
        </div>

        <dl className="stock-meta-strip">
          <div>
            <dt>전일대비</dt>
            <dd>{formatNumber(quote.previous_close)}원</dd>
          </div>
          <div>
            <dt>시가총액</dt>
            <dd>{formatKrw(quote.market_cap)}</dd>
          </div>
          <div>
            <dt>거래대금</dt>
            <dd>{formatKrw(quote.trading_value)}</dd>
          </div>
          <div>
            <dt>거래량</dt>
            <dd>{formatNumber(quote.volume)}주</dd>
          </div>
          <div>
            <dt>변동성</dt>
            <dd>{quote.volatility?.toFixed(2) ?? "-"}</dd>
          </div>
        </dl>
      </header>

      <main className="stock-detail-grid">
        <section className="stock-chart-card" aria-label="Price chart">
          <StockChart chart={overview.chart} period={period} onPeriodChange={onPeriodChange} />
        </section>

        <aside className="stock-side-panel">
          <section className="metric-card-grid" aria-label="Key metrics">
            <article>
              <span>등락률 ({period})</span>
              <strong className={isPositive ? "positive" : "negative"}>
                {changePrefix}{formatPercent(quote.change_rate)}
              </strong>
              <small>{changePrefix}{formatKrw(quote.change)}</small>
            </article>
            <article>
              <span>거래량 증가율</span>
              <strong className={volumeGrowth >= 0 ? "positive" : "negative"}>
                {volumeGrowthPrefix}{formatPercent(quote.volume_growth_rate)}
              </strong>
              <small>{formatNumber(quote.average_volume)} avg</small>
            </article>
            <article>
              <span>거래대금</span>
              <strong>{formatKrw(quote.trading_value)}</strong>
              <small>market activity</small>
            </article>
            <article>
              <span>섹터 대비</span>
              <strong className={overview.sector_comparison.excess_return >= 0 ? "positive" : "negative"}>
                {overview.sector_comparison.excess_return >= 0 ? "+" : ""}
                {formatPercent(overview.sector_comparison.excess_return)}
              </strong>
              <small>{overview.identity.sector_name}</small>
            </article>
          </section>

          <section className="stock-insight-card">
            <h3>종목 인사이트 요약</h3>
            <div className="insight-signal positive">
              <strong>상승 원인 후보</strong>
              <ul>
                <li>섹터 평균 대비 상대 성과 확인</li>
                <li>거래량 및 거래대금 변화 추적 필요</li>
                <li>핵심 키워드: {overview.insight.keywords.join(", ")}</li>
              </ul>
            </div>
            <div className="insight-signal negative">
              <strong>위험 신호</strong>
              <ul>
                <li>단기 변동성 확대 구간에서는 추격 매수 주의</li>
                <li>샘플 데이터 기반 분석으로 실시간 검증 필요</li>
              </ul>
            </div>
            <div className="keyword-chips">
              {overview.insight.keywords.map((keyword) => (
                <span key={keyword}>#{keyword}</span>
              ))}
            </div>
          </section>
        </aside>
      </main>

      <section className="stock-news-panel" aria-label="Related news and disclosures">
        <div className="stock-section-header">
          <h3>관련 뉴스 · 공시</h3>
          <div>
            <button className="active" type="button">전체</button>
            <button type="button">뉴스</button>
            <button type="button">공시</button>
            <button type="button">리포트</button>
          </div>
        </div>
        <div className="news-table">
          <div className="news-row news-head">
            <span>시간</span>
            <span>구분</span>
            <span>제목</span>
            <span>내용 요약</span>
            <span>출처</span>
          </div>
          {newsRows.map((row) => (
            <div className="news-row" key={`${row.time}-${row.title}`}>
              <span>{row.time}</span>
              <em>{row.type}</em>
              <strong>{row.title}</strong>
              <p>{row.summary}</p>
              <span>{row.source}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
