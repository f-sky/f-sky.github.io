import { memo, useCallback, useMemo, useState, MouseEvent } from "react";
import { Publication, PublicationType } from "./publication";
import classes from "@/styles/publication-list.module.css";

interface IProps {
  publications: PublicationType[];
}

const filters = ["show selected", "show all by date", "show all by topic"];

function renderWithLabel(labels: any[], label2items: Record<string, Omit<PublicationType, "date">[]>) {
  return labels.map((label) => (
    <div key={label}>
      <h3 className={classes.label}>{label}</h3>
      {label2items[label].map((p) => (
        <Publication key={p.title} {...p} />
      ))}
    </div>
  ));
}

export const PublicationList = memo<IProps>(function PublicationList(props) {
  const { publications } = props;
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const selected = useMemo(() => publications.filter((p) => p.selected), [publications]);
  const [years, year2pubs] = useMemo(() => {
    const items = publications.map((pub) => {
      const date = pub.issued["date-parts"][0];
      const year = date[0];
      const month = date[1] || 1;
      const day = date[2] || 1;
      return { ...pub, date: new Date(year, month, day) };
    });
    const years: number[] = [];
    const year2pubs: Record<string, typeof items> = {};

    const pubs = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());
    for (const pub of pubs) {
      const year = pub.date.getFullYear();
      if (!year2pubs[year]) {
        year2pubs[year] = [];
        years.push(year);
      }
      year2pubs[year].push(pub);
    }

    return [years, year2pubs];
  }, [publications]);

  const [topics, topic2pubs] = useMemo(() => {
    const topics: string[] = [];
    const topic2pubs: Record<string, typeof publications> = {};
    for (const item of publications) {
      if (!topic2pubs[item.topic]) {
        topic2pubs[item.topic] = [];
        topics.push(item.topic);
      }
      topic2pubs[item.topic].push(item);
    }
    return [topics, topic2pubs];
  }, [publications]);

  const onClick = useCallback(
    (ev: MouseEvent<HTMLAnchorElement>) => setSelectedFilter(ev.currentTarget.dataset.filter),
    []
  );

  return (
    <section>
      <h2>
        Publications
        <br className={classes.mobileBreak} />
        <span className={classes.filters}>
          {filters.map((filter) => (
            <span key={filter} className={classes.filter}>
              <a
                className={selectedFilter === filter ? classes.active : undefined}
                data-filter={filter}
                onClick={onClick}
              >
                {filter}
              </a>
            </span>
          ))}
        </span>
      </h2>
      <div className={classes.smallText}>* denotes equal contribution.</div>
      <div>
        {selectedFilter === "show selected"
          ? selected.map((p) => <Publication key={p.title} {...p} />)
          : selectedFilter === "show all by date"
          ? renderWithLabel(years, year2pubs)
          : renderWithLabel(topics, topic2pubs)}
      </div>
    </section>
  );
});
