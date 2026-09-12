import { ActivitySource } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  BUDGET_PREFERENCES,
  ENERGY_LEVELS,
  LOCATION_PREFERENCES,
  normalizeRecommendationContextText,
  TIME_PREFERENCES,
  type RecommendationContext,
} from "@/lib/recommendation-context";
import {
  requestRecommendations,
  type RecommendationHistoryItem,
  type RecommenderActivity,
} from "@/lib/recommender";

const validTimePreferences = new Set<string>(TIME_PREFERENCES);
const validEnergyLevels = new Set<string>(ENERGY_LEVELS);
const validLocationPreferences = new Set<string>(LOCATION_PREFERENCES);
const validBudgetPreferences = new Set<string>(BUDGET_PREFERENCES);

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }

  const context = parseRecommendationContext(body);

  if (!context) {
    return Response.json(
      {
        error: "Invalid recommendation context.",
      },
      {
        status: 400,
      },
    );
  }

  const [userInterests, activities, recentSessions] = await Promise.all([
    prisma.userInterest.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        interestKey: true,
      },
    }),
    prisma.activity.findMany({
      where: {
        isActive: true,
        source: ActivitySource.STARTER,
      },
    }),
    prisma.recommendationSession.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      take: 3,
      select: {
        recommendations: {
          select: {
            activityId: true,
          },
        },
      },
    }),
  ]);

  if (activities.length === 0) {
    return Response.json(
      {
        error: "No recommendation activities are available.",
      },
      {
        status: 503,
      },
    );
  }

  const history: RecommendationHistoryItem[] = recentSessions.flatMap(
    (recommendationSession, index) =>
      recommendationSession.recommendations.map((recommendation) => ({
        activity_id: recommendation.activityId,
        sessions_ago: index + 1,
      })),
  );

  const candidates: RecommenderActivity[] = activities.map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    first_step: activity.firstStep,
    plan_steps: activity.planSteps,

    category: activity.category,
    tags: activity.tags,

    time_min: activity.timeMin,
    time_max: activity.timeMax,

    energy_required: activity.energyRequired,
    activation_effort: activity.activationEffort,
    mental_effort: activity.mentalEffort,
    physical_effort: activity.physicalEffort,

    location_type: activity.locationType,
    environment: activity.environment,
    social_mode: activity.socialMode,
    screen_mode: activity.screenMode,

    cost_min: activity.costMin,
    cost_max: activity.costMax,
  }));

  try {
    const result = await requestRecommendations({
      context,
      interests: userInterests.map((userInterest) => userInterest.interestKey),
      history,
      candidates,
      limit: 3,
    });

    const activitiesById = new Map(
      activities.map((activity) => [activity.id, activity]),
    );

    const recommendations = result.recommendations.map((rankedActivity) => {
      const activity = activitiesById.get(rankedActivity.activity_id);

      if (!activity) {
        throw new Error(
          `Recommender returned unknown activity ${rankedActivity.activity_id}.`,
        );
      }

      return {
        activity: {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          firstStep: activity.firstStep,
          planSteps: activity.planSteps,
          category: activity.category,
          tags: activity.tags,
          timeMin: activity.timeMin,
          timeMax: activity.timeMax,
          energyRequired: activity.energyRequired,
          activationEffort: activity.activationEffort,
          locationType: activity.locationType,
          costMin: activity.costMin,
          costMax: activity.costMax,
        },
        ranking: {
          rawScore: rankedActivity.raw_score,
          repetitionPenalty: rankedActivity.repetition_penalty,
          finalScore: rankedActivity.final_score,
          scoreBreakdown: rankedActivity.score_breakdown,
          reasonCodes: rankedActivity.reason_codes,
        },
      };
    });

    if (recommendations.length > 0) {
      await prisma.recommendationSession.create({
        data: {
          userId: session.user.id,
          recommendations: {
            create: recommendations.map((recommendation, index) => ({
              activityId: recommendation.activity.id,
              rank: index + 1,
            })),
          },
        },
      });
    }

    return Response.json({
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation request failed:", error);

    return Response.json(
      {
        error: "We couldn't get recommendations right now.",
      },
      {
        status: 502,
      },
    );
  }
}

function parseRecommendationContext(
  body: unknown,
): RecommendationContext | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { time, energy, location, budget, text } = body as Record<
    string,
    unknown
  >;

  if (
    typeof time !== "string" ||
    !validTimePreferences.has(time) ||
    typeof energy !== "string" ||
    !validEnergyLevels.has(energy) ||
    typeof location !== "string" ||
    !validLocationPreferences.has(location) ||
    typeof budget !== "string" ||
    !validBudgetPreferences.has(budget)
  ) {
    return null;
  }

  if (
    text !== undefined &&
    text !== null &&
    (typeof text !== "string" || text.length > 500)
  ) {
    return null;
  }

  return {
    time: time as RecommendationContext["time"],
    energy: energy as RecommendationContext["energy"],
    location: location as RecommendationContext["location"],
    budget: budget as RecommendationContext["budget"],
    text:
      typeof text === "string"
        ? normalizeRecommendationContextText(text)
        : null,
  };
}
