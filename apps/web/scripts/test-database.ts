import "dotenv/config";

import prisma from "../lib/prisma";

async function main() {
  const [interestCount, activityCount] = await Promise.all([
    prisma.interest.count(),
    prisma.activity.count(),
  ]);

  console.log(`Interests: ${interestCount}`);
  console.log(`Activities: ${activityCount}`);

  const sampleActivity = await prisma.activity.findUnique({
    where: {
      id: "act_006",
    },
    select: {
      id: true,
      title: true,
      category: true,
      source: true,
    },
  });

  console.log("Sample activity:", sampleActivity);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
