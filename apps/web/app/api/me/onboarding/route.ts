import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { InterestKey } from "@/app/generated/prisma/client";

const validInterestKeys = new Set<string>(Object.values(InterestKey));

export async function PUT(request: Request) {
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

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    !("interests" in body)
  ) {
    return Response.json(
      {
        error: "Name and interests are required.",
      },
      {
        status: 400,
      },
    );
  }

  const { name, interests } = body as {
    name: unknown;
    interests: unknown;
  };

  if (typeof name !== "string" || name.trim().length === 0) {
    return Response.json(
      {
        error: "Please enter a name.",
      },
      {
        status: 400,
      },
    );
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 50) {
    return Response.json(
      {
        error: "Name must be 50 characters or fewer.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !Array.isArray(interests) ||
    !interests.every(
      (interest) =>
        typeof interest === "string" && validInterestKeys.has(interest),
    )
  ) {
    return Response.json(
      {
        error: "One or more interests are invalid.",
      },
      {
        status: 400,
      },
    );
  }

  const uniqueInterests = [...new Set(interests)] as InterestKey[];

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: trimmedName,
      },
    });

    await tx.userInterest.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    if (uniqueInterests.length > 0) {
      await tx.userInterest.createMany({
        data: uniqueInterests.map((interestKey) => ({
          userId: session.user.id,
          interestKey,
        })),
      });
    }

    await tx.userProfile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        onboardingCompleted: true,
      },
      create: {
        userId: session.user.id,
        onboardingCompleted: true,
      },
    });
  });

  return Response.json({
    name: trimmedName,
    interests: uniqueInterests,
    onboardingCompleted: true,
  });
}
