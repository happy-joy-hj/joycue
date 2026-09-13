import { RecommendationActionType } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const validActionTypes = new Set<RecommendationActionType>([
  RecommendationActionType.DO_NOW,
  RecommendationActionType.NOT_FOR_ME,
]);

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      recommendationId: string;
    }>;
  },
) {
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

  const { recommendationId } = await params;

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

  const actionType = parseRecommendationActionType(body);

  if (!actionType) {
    return Response.json(
      {
        error: "Invalid recommendation action.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const recommendation = await prisma.recommendation.findFirst({
      where: {
        id: recommendationId,
        session: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!recommendation) {
      return Response.json(
        {
          error: "Recommendation not found.",
        },
        {
          status: 404,
        },
      );
    }

    const action = await prisma.recommendationAction.create({
      data: {
        recommendationId: recommendation.id,
        type: actionType,
      },
      select: {
        id: true,
        recommendationId: true,
        type: true,
        createdAt: true,
      },
    });

    return Response.json(
      {
        action,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Recommendation action failed:", error);

    return Response.json(
      {
        error: "We couldn't record this recommendation action.",
      },
      {
        status: 500,
      },
    );
  }
}

function parseRecommendationActionType(
  body: unknown,
): RecommendationActionType | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { type } = body as Record<string, unknown>;

  if (
    typeof type !== "string" ||
    !validActionTypes.has(type as RecommendationActionType)
  ) {
    return null;
  }

  return type as RecommendationActionType;
}
