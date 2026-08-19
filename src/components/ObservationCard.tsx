import { useId, useState } from "react";
import { confidenceLabel, formatDate, formatMoney } from "../format";
import type { MarketObservation, ObservationCollection } from "../types";

interface ObservationCardProps {
  observation?: MarketObservation;
  position: number;
  collection: ObservationCollection;
}

export function ObservationCard({ observation, position, collection }: ObservationCardProps) {
  const collectionLabel = collection === "current" ? "Current" : "Tracking";
  const [expanded, setExpanded] = useState(false);
  const reasonId = useId();
  if (!observation) {
    return (
      <article className="observation-card observation-card--pending" aria-label={`Observation ${position} awaiting live data`}>
        <div className="observation-card__meta">
          <span>ASX: —</span>
          <span>{collectionLabel} {position}</span>
        </div>
        <div className="observation-card__primary">
          <p className="micro-label">Market observation</p>
          <h2>Live data pending</h2>
          <p>No simulated company or price shown.</p>
        </div>
        <div className="observation-card__facts">
          <div><span>Reference price</span><strong>—</strong></div>
          <div><span>Review date</span><strong>—</strong></div>
        </div>
        <div className="observation-card__foot">
          <span>Signal strength pending</span>
          <span className="status-pill">Awaiting feed</span>
        </div>
      </article>
    );
  }

  const signal = Math.round(observation.signalStrength);
  return (
    <article className="observation-card" aria-label={`Observation ${position}: ${observation.companyName}`}>
      <div className="observation-card__meta">
        <span>{observation.exchange}: {observation.symbol}</span>
        <div className="observation-card__actions">
          <span>{collectionLabel} {position}</span>
          <button className="expand-button" type="button" aria-expanded={expanded} aria-controls={reasonId} onClick={() => setExpanded((value) => !value)}>
            <span aria-hidden="true">{expanded ? "−" : "+"}</span>
            <span className="sr-only">{expanded ? "Hide" : "Show"} reason for {observation.companyName}</span>
          </button>
        </div>
      </div>
      <div className="observation-card__primary">
        <p className="micro-label">{collectionLabel} observation</p>
        <h2>{observation.companyName}</h2>
        <p>{observation.sector}</p>
      </div>
      <div className="observation-card__facts">
        <div><span>Reference price</span><strong>{formatMoney(observation.referencePrice, observation.currency)}</strong></div>
        <div><span>Review date</span><strong>{formatDate(observation.reviewAt)}</strong></div>
      </div>
      <div className="observation-card__reason" id={reasonId} hidden={!expanded}>
        <p className="micro-label">Why it ranked</p>
        <p>{observation.reason}</p>
      </div>
      <div className="observation-card__foot">
        <span>Observed {formatDate(observation.observedAt)}</span>
        <span className="status-pill">{signal}% · {confidenceLabel(signal)}</span>
      </div>
    </article>
  );
}
