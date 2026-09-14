import { ActivitySource } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

  const activityId = parseActivityId(body);

  if (!activityId) {
    return Response.json(
      {
        error: "Invalid activity.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        isActive: true,
        source: ActivitySource.STARTER,
      },
      select: {
        id: true,
      },
    });

    if (!activity) {
      return Response.json(
        {
          error: "Activity not found.",
        },
        {
          status: 404,
        },
      );
    }

    const savedActivity = await prisma.savedActivity.upsert({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: activity.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        activityId: activity.id,
      },
      select: {
        id: true,
        activityId: true,
        createdAt: true,
      },
    });

    return Response.json({
      savedActivity,
    });
  } catch (error) {
    console.error("Save activity failed:", error);

    return Response.json(
      {
        error: "We couldn't save this activity.",
      },
      {
        status: 500,
      },
    );
  }
}

function parseActivityId(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { activityId } = body as Record<string, unknown>;

  if (typeof activityId !== "string" || activityId.trim().length === 0) {
    return null;
  }

  return activityId;
}
