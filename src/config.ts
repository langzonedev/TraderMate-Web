import type { Horizon } from "./types";

export interface HorizonOption {
  id: Horizon;
  label: string;
  kicker: string;
  title: string;
  summary: string;
}

export const HORIZONS: readonly HorizonOption[] = [
  {
    id: "short",
    label: "Short",
    kicker: "Short · 30-day view",
    title: "Near-term market observations.",
    summary: "Four current ASX observations ranked for the short horizon.",
  },
  {
    id: "medium",
    label: "Mid",
    kicker: "Mid · 6-month view",
    title: "The middle-distance view.",
    summary: "Four current ASX observations ranked for the mid horizon.",
  },
  {
    id: "long",
    label: "Long",
    kicker: "Long · 12-month view",
    title: "A longer market horizon.",
    summary: "Four current ASX observations ranked for the long horizon.",
  },
] as const;

export const OBSERVATIONS_PER_HORIZON = 4;
