import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      activityId: string;
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

  const { activityId } = await params;

  if (!activityId.trim()) {
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
    const result = await prisma.savedActivity.deleteMany({
      where: {
        userId: session.user.id,
        activityId,
      },
    });

    return Response.json({
      removed: result.count > 0,
    });
  } catch (error) {
    console.error("Remove saved activity failed:", error);

    return Response.json(
      {
        error: "We couldn't remove this saved activity.",
      },
      {
        status: 500,
      },
    );
  }
}
