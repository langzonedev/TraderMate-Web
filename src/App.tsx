import { useCallback, useEffect, useMemo, useState } from "react";
import { Brand } from "./components/Brand";
import { HorizonPicker } from "./components/HorizonPicker";
import { ObservationCard } from "./components/ObservationCard";
import { HORIZONS, OBSERVATIONS_PER_HORIZON } from "./config";
import { formatDateTime } from "./format";
import type { Horizon, MarketSnapshot, ObservationCollection } from "./types";

const EMPTY_SNAPSHOT: MarketSnapshot = {
  schemaVersion: 6,
  mode: "pending",
  asOf: null,
  modelVersion: "price-baseline-0.1",
  observations: [],
  outcomes: [],
};

export default function App() {
  const localPreview = import.meta.env.VITE_LOCAL_PREVIEW === "true";
  const [horizon, setHorizon] = useState<Horizon>("short");
  const [collection, setCollection] = useState<ObservationCollection>("current");
  const [snapshot, setSnapshot] = useState<MarketSnapshot>(EMPTY_SNAPSHOT);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/recommendations.json?v=${Date.now()}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Snapshot request failed: ${response.status}`);
      setSnapshot(await response.json() as MarketSnapshot);
    } catch {
      setSnapshot(EMPTY_SNAPSHOT);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const selected = HORIZONS.find((option) => option.id === horizon) ?? HORIZONS[0];
  const observations = useMemo(
    () => snapshot.observations.filter(
      (item) => item.horizon === horizon && (item.collection ?? "current") === collection,
    ),
    [collection, horizon, snapshot.observations],
  );
  const completed = snapshot.outcomes.filter((outcome) => outcome.status === "complete" && outcome.horizon === horizon);
  const positive = completed.filter((outcome) => outcome.positive).length;
  const outcomeRate = completed.length ? `${((positive / completed.length) * 100).toFixed(1)}%` : "Tracking";
  const live = snapshot.mode === "live";
  const displayCount = collection === "current" ? OBSERVATIONS_PER_HORIZON : observations.length;

  return (
    <>
      <header className="hero">
        <div className="hero__inner shell">
          <div className="topline">
            <Brand />
            {localPreview && <span className="local-preview-badge">Local only</span>}
          </div>
          <HorizonPicker selected={horizon} onSelect={setHorizon} />
          <div className="hero__copy">
            <p className="eyebrow">{selected.kicker}</p>
            <h1>One market.<br />Three time horizons.</h1>
            <p className="hero__summary">{selected.summary}</p>
          </div>
        </div>
      </header>

      <main className="shell main-content">
        <nav className="collection-picker" aria-label="Observation status">
          <button type="button" className={collection === "current" ? "is-selected" : ""} aria-pressed={collection === "current"} onClick={() => setCollection("current")}>Current</button>
          <button type="button" className={collection === "tracking" ? "is-selected" : ""} aria-pressed={collection === "tracking"} onClick={() => setCollection("tracking")}>Tracking</button>
        </nav>

        <section className="summary-bar" aria-labelledby="summary-heading">
          <div>
            <p className="eyebrow eyebrow--ink" id="summary-heading">{displayCount} {collection === "current" ? "current" : "tracked"} observations</p>
            <p className="summary-bar__status" role="status">
              {loading ? "Checking the latest market snapshot…" : loadError ? "Live feed unavailable" : collection === "tracking" && !observations.length ? "No earlier observations are currently being tracked." : snapshot.asOf ? `Updated ${formatDateTime(snapshot.asOf)}` : "Live market feed pending"}
            </p>
          </div>
          <button className="refresh-button" type="button" onClick={() => void loadSnapshot()} disabled={loading}>
            <span aria-hidden="true">↻</span> {loading ? "Checking" : "Refresh"}
          </button>
        </section>

        <section className="accuracy-card" aria-labelledby="accuracy-heading">
          <div>
            <p className="micro-label" id="accuracy-heading">Historical outcome rate · {selected.label}</p>
            <p className="accuracy-card__value">{outcomeRate}</p>
          </div>
          <p>{completed.length ? `${positive} of ${completed.length} completed observations positive` : "Starts calculating after live observations complete."}</p>
        </section>

        <section className="observation-grid" aria-label={`${selected.label} horizon market observations`}>
          {collection === "current"
            ? Array.from({ length: OBSERVATIONS_PER_HORIZON }, (_, index) => (
                <ObservationCard key={observations[index]?.symbol ?? `pending-${horizon}-${index}`} observation={observations[index]} position={index + 1} collection={collection} />
              ))
            : observations.map((observation, index) => (
                <ObservationCard key={`${observation.symbol}-${observation.observedAt}`} observation={observation} position={index + 1} collection={collection} />
              ))}
        </section>

        <p className="feed-note">{live ? collection === "current" ? `${selected.title} Data shown from the latest approved market snapshot.` : "Earlier observations remain tracked to their original review dates, even after leaving Current." : `${selected.title} Named observations will appear when the approved live feed is connected.`}</p>
      </main>

      <footer>
        <div className="shell footer__inner">
          <div><strong>Market Horizons</strong><p>One market. Three time horizons.</p></div>
          <p className="footer__note">Quantitative market information only. Observations are impersonal and do not consider your objectives, financial situation or needs. They are not instructions to buy, sell or hold a financial product.</p>
        </div>
      </footer>
    </>
  );
}
