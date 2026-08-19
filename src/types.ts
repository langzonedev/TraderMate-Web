export type Horizon = "short" | "medium" | "long";
export type ObservationCollection = "current" | "tracking";

export interface MarketObservation {
  horizon: Horizon;
  collection: ObservationCollection;
  rank: number;
  durationLabel: string;
  symbol: string;
  exchange: string;
  companyName: string;
  sector: string;
  currency: string;
  referencePrice: number;
  signalStrength: number;
  observedAt: string;
  reviewAt: string;
  status: "active" | "complete";
}

export interface ModelOutcome {
  id: string;
  status: "complete";
  positive: boolean;
  horizon: Horizon;
  modelVersion: string;
  returnPercent: number;
}

export interface MarketSnapshot {
  schemaVersion: number;
  mode: "pending" | "live";
  asOf: string | null;
  modelVersion: string;
  observations: MarketObservation[];
  outcomes: ModelOutcome[];
}
