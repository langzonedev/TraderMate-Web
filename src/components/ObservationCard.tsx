import { confidenceLabel, formatDate, formatMoney } from "../format";
import type { MarketObservation } from "../types";

interface ObservationCardProps {
  observation?: MarketObservation;
  position: number;
}

export function ObservationCard({ observation, position }: ObservationCardProps) {
  if (!observation) {
    return (
      <article className="observation-card observation-card--pending" aria-label={`Observation ${position} awaiting live data`}>
        <div className="observation-card__meta">
          <span>ASX: —</span>
          <span>Observation {position}</span>
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
        <span>Observation {position}</span>
      </div>
      <div className="observation-card__primary">
        <p className="micro-label">Market observation</p>
        <h2>{observation.companyName}</h2>
        <p>{observation.sector}</p>
      </div>
      <div className="observation-card__facts">
        <div><span>Reference price</span><strong>{formatMoney(observation.referencePrice, observation.currency)}</strong></div>
        <div><span>Review date</span><strong>{formatDate(observation.reviewAt)}</strong></div>
      </div>
      <div className="observation-card__foot">
        <span>Observed {formatDate(observation.observedAt)}</span>
        <span className="status-pill">{signal}% · {confidenceLabel(signal)}</span>
      </div>
    </article>
  );
}
