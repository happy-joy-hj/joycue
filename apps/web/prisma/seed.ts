import "dotenv/config";

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  ActivityCategory,
  ActivitySource,
  EffortLevel,
  EnvironmentType,
  InterestKey,
  LocationType,
  PrismaClient,
  ScreenMode,
  SocialMode,
} from "../app/generated/prisma/client";

type StarterActivity = {
  id: string;
  title: string;
  description: string | null;
  first_step: string;
  plan_steps: string[] | null;

  category: ActivityCategory;
  tags: string[];

  time_min: number | null;
  time_max: number | null;

  energy_required: EffortLevel | null;
  activation_effort: EffortLevel | null;
  mental_effort: EffortLevel | null;
  physical_effort: EffortLevel | null;

  location_type: LocationType | null;
  environment: EnvironmentType | null;
  social_mode: SocialMode | null;
  screen_mode: ScreenMode | null;

  cost_min: number | null;
  cost_max: number | null;
};

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is required to seed the database.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const interests = [
  {
    key: InterestKey.FRIENDS,
    label: "Friends & Connection",
    description:
      "Spend time with people you care about or strengthen your connections.",
    sortOrder: 1,
  },
  {
    key: InterestKey.FUN,
    label: "Fun",
    description:
      "Do something playful, enjoyable, or simply because it sounds fun.",
    sortOrder: 2,
  },
  {
    key: InterestKey.MOVEMENT,
    label: "Movement",
    description: "Get up, move around, stretch, walk, or do something active.",
    sortOrder: 3,
  },
  {
    key: InterestKey.CAREER,
    label: "Career",
    description: "Take a small step toward your work, skills, or career goals.",
    sortOrder: 4,
  },
  {
    key: InterestKey.LEARNING,
    label: "Learning",
    description: "Explore a topic, practice a skill, or learn something new.",
    sortOrder: 5,
  },
  {
    key: InterestKey.CREATIVITY,
    label: "Creativity",
    description: "Make, imagine, write, design, or experiment with an idea.",
    sortOrder: 6,
  },
  {
    key: InterestKey.EXPLORATION,
    label: "Exploration",
    description:
      "Look around, go somewhere, or discover something beyond your usual routine.",
    sortOrder: 7,
  },
  {
    key: InterestKey.HOME,
    label: "Home & Everyday Life",
    description:
      "Do something small for your space, surroundings, or everyday routine.",
    sortOrder: 8,
  },
  {
    key: InterestKey.REST,
    label: "Rest & Recharge",
    description: "Slow down, reset, or enjoy a little quiet time.",
    sortOrder: 9,
  },
  {
    key: InterestKey.PERSONAL_PROJECTS,
    label: "Personal Projects",
    description:
      "Make progress on something you've chosen to build, create, or pursue.",
    sortOrder: 10,
  },
  {
    key: InterestKey.NEW_EXPERIENCES,
    label: "New Experiences",
    description:
      "Try something unfamiliar, different, or outside your usual routine.",
    sortOrder: 11,
  },
];

async function loadStarterActivities() {
  const dataPath = fileURLToPath(
    new URL("../../../data/starter_activities.json", import.meta.url),
  );

  const contents = await readFile(dataPath, "utf-8");

  return JSON.parse(contents) as StarterActivity[];
}

async function seedInterests() {
  for (const interest of interests) {
    await prisma.interest.upsert({
      where: {
        key: interest.key,
      },
      update: {
        label: interest.label,
        description: interest.description,
        sortOrder: interest.sortOrder,
      },
      create: interest,
    });
  }
}

async function seedActivities() {
  const activities = await loadStarterActivities();

  for (const activity of activities) {
    const data = {
      title: activity.title,
      description: activity.description,
      firstStep: activity.first_step,
      planSteps: activity.plan_steps ?? [],

      category: activity.category,
      tags: activity.tags,

      timeMin: activity.time_min,
      timeMax: activity.time_max,

      energyRequired: activity.energy_required,
      activationEffort: activity.activation_effort,
      mentalEffort: activity.mental_effort,
      physicalEffort: activity.physical_effort,

      locationType: activity.location_type,
      environment: activity.environment,
      socialMode: activity.social_mode,
      screenMode: activity.screen_mode,

      costMin: activity.cost_min,
      costMax: activity.cost_max,

      source: ActivitySource.STARTER,
      isActive: true,
    };

    await prisma.activity.upsert({
      where: {
        id: activity.id,
      },
      update: data,
      create: {
        id: activity.id,
        ...data,
      },
    });
  }

  return activities.length;
}

async function main() {
  await seedInterests();

  const activityCount = await seedActivities();

  console.log(`Seeded ${interests.length} interests.`);

  console.log(`Seeded ${activityCount} starter activities.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
