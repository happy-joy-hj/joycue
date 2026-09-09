export const TIME_PREFERENCES = [
  "UNDER_10_MIN",
  "AROUND_15_MIN",
  "AROUND_30_MIN",
  "AROUND_60_MIN",
  "ANY",
] as const;

export const ENERGY_LEVELS = ["VERY_LOW", "LOW", "MEDIUM", "HIGH"] as const;

export const LOCATION_PREFERENCES = ["STAY_IN", "GO_OUT", "EITHER"] as const;

export const BUDGET_PREFERENCES = ["FREE", "LOW_COST", "ANY"] as const;

export type TimePreference = (typeof TIME_PREFERENCES)[number];
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];
export type LocationPreference = (typeof LOCATION_PREFERENCES)[number];
export type BudgetPreference = (typeof BUDGET_PREFERENCES)[number];

export type RecommendationContext = {
  time: TimePreference;
  energy: EnergyLevel;
  location: LocationPreference;
  budget: BudgetPreference;
  text: string | null;
};

export function normalizeRecommendationContextText(
  value: string,
): string | null {
  const normalized = value.trim();

  return normalized || null;
}
