import type { ReactNode } from "react";
import "./foundations.css";

export function Page({ title, lede, children }: { title: string; lede: ReactNode; children: ReactNode }) {
  return (
    <div className="fd-page">
      <h1 className="fd-title">{title}</h1>
      <p className="fd-lede">{lede}</p>
      {children}
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="fd-section">
      <h2 className="fd-heading">{title}</h2>
      {note ? <p className="fd-note">{note}</p> : <div style={{ height: 16 }} />}
      {children}
    </section>
  );
}

/** Token name, utility class and value, stacked. */
export function Label({ name, utility, value }: { name: ReactNode; utility?: string; value?: string }) {
  return (
    <div className="fd-label">
      <strong>{name}</strong>
      {utility && <span className="fd-code">{utility}</span>}
      {value && <span className="fd-code">{value}</span>}
    </div>
  );
}
