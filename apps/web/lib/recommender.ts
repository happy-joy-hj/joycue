import type { RecommendationContext } from "@/lib/recommendation-context";
import type { RecommendationReasonCode } from "@/lib/recommendation-reasons";

export type RecommenderActivity = {
  id: string;
  title: string;
  description: string | null;
  first_step: string;
  plan_steps: string[];

  category: string;
  tags: string[];

  time_min: number | null;
  time_max: number | null;

  energy_required: string | null;
  activation_effort: string | null;
  mental_effort: string | null;
  physical_effort: string | null;

  location_type: string | null;
  environment: string | null;
  social_mode: string | null;
  screen_mode: string | null;

  cost_min: number | null;
  cost_max: number | null;
};

export type RecommendationHistoryItem = {
  activity_id: string;
  sessions_ago: number;
};

export type RecommenderRequest = {
  context: RecommendationContext;
  interests: string[];
  history: RecommendationHistoryItem[];
  candidates: RecommenderActivity[];
  limit?: number;
};

export type ScoreBreakdown = {
  time: number;
  energy: number;
  activation: number;
  location: number;
  budget: number;
  interest?: number;
};

export type RankedActivity = {
  activity_id: string;
  raw_score: number;
  repetition_penalty: number;
  final_score: number;
  score_breakdown: ScoreBreakdown;
  reason_codes: RecommendationReasonCode[];
};

export type RecommenderResponse = {
  recommendations: RankedActivity[];
};

export async function requestRecommendations(
  request: RecommenderRequest,
): Promise<RecommenderResponse> {
  const baseUrl = process.env.RECOMMENDER_URL;

  if (!baseUrl) {
    throw new Error("RECOMMENDER_URL is not configured.");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Recommender request failed with status ${response.status}.`,
    );
  }

  return (await response.json()) as RecommenderResponse;
}
