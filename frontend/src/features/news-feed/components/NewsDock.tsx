import type { NewsResponse } from "../../../entities/news/model";

interface NewsDockProps {
  news: NewsResponse | null;
}

export function NewsDock({ news }: NewsDockProps) {
  return (
    <section className="news-dock" aria-label="뉴스와 공시">
      <div className="news-track">
        {(news?.items ?? []).length > 0 ? (
          news!.items.map((item) => (
            <article className="news-item" key={item.id}>
              <span>{item.item_type}</span>
              <strong>{item.title}</strong>
              <small>{item.source}</small>
            </article>
          ))
        ) : (
          <div className="empty-state">{news?.empty_state?.message ?? "관련 뉴스와 공시를 불러오는 중입니다."}</div>
        )}
      </div>
    </section>
  );
}
