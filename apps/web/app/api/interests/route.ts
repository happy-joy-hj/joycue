import prisma from "@/lib/prisma";

export async function GET() {
  const interests = await prisma.interest.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      key: true,
      label: true,
      description: true,
    },
  });

  return Response.json({
    interests,
  });
}
