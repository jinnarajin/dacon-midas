import type { NewsResponse } from "../../../entities/news/model";

interface NewsDockProps {
  news: NewsResponse | null;
}

export function NewsDock({ news }: NewsDockProps) {
  return (
    <section className="news-dock" aria-label="News and disclosures">
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
          <p>{news?.empty_state?.message ?? "Loading related news."}</p>
        )}
      </div>
    </section>
  );
}
