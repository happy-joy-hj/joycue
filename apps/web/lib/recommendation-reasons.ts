export const RECOMMENDATION_REASON_CODES = [
  "TIME_MATCH",
  "ENERGY_MATCH",
  "EASY_TO_START",
  "LOCATION_MATCH",
  "BUDGET_MATCH",
  "INTEREST_MATCH",
] as const;

export type RecommendationReasonCode =
  (typeof RECOMMENDATION_REASON_CODES)[number];

const recommendationReasonLabels: Record<RecommendationReasonCode, string> = {
  TIME_MATCH: "Fits the time you have",
  ENERGY_MATCH: "Matches your energy",
  EASY_TO_START: "Easy to get started",
  LOCATION_MATCH: "Works with where you want to be",
  BUDGET_MATCH: "Fits your budget",
  INTEREST_MATCH: "Matches your interests",
};

export function getRecommendationReasonLabel(
  reasonCode: RecommendationReasonCode,
): string {
  return recommendationReasonLabels[reasonCode];
}
