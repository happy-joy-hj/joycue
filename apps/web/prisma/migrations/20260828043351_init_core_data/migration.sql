-- CreateEnum
CREATE TYPE "InterestKey" AS ENUM ('FRIENDS', 'FUN', 'MOVEMENT', 'CAREER', 'LEARNING', 'CREATIVITY', 'EXPLORATION', 'HOME', 'REST', 'PERSONAL_PROJECTS', 'NEW_EXPERIENCES');

-- CreateEnum
CREATE TYPE "ActivitySource" AS ENUM ('STARTER', 'USER_CREATED', 'NOTICED', 'SAVED_RECOMMENDATION');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('REST', 'MOVEMENT', 'AWARENESS', 'HOME', 'FUN', 'SOCIAL', 'LEARNING', 'CAREER', 'CREATIVE', 'EXPLORATION');

-- CreateEnum
CREATE TYPE "EffortLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('STAY_IN', 'GO_OUT', 'EITHER');

-- CreateEnum
CREATE TYPE "EnvironmentType" AS ENUM ('QUIET', 'FLEXIBLE', 'LIVELY');

-- CreateEnum
CREATE TYPE "SocialMode" AS ENUM ('SOLO', 'WITH_OTHERS', 'EITHER');

-- CreateEnum
CREATE TYPE "ScreenMode" AS ENUM ('SCREEN_FREE', 'SCREEN_OPTIONAL', 'SCREEN_REQUIRED');

-- CreateTable
CREATE TABLE "Interest" (
    "key" "InterestKey" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "firstStep" TEXT NOT NULL,
    "planSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" "ActivityCategory" NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "timeMin" INTEGER,
    "timeMax" INTEGER,
    "energyRequired" "EffortLevel",
    "activationEffort" "EffortLevel",
    "mentalEffort" "EffortLevel",
    "physicalEffort" "EffortLevel",
    "locationType" "LocationType",
    "environment" "EnvironmentType",
    "socialMode" "SocialMode",
    "screenMode" "ScreenMode",
    "costMin" DOUBLE PRECISION,
    "costMax" DOUBLE PRECISION,
    "source" "ActivitySource" NOT NULL DEFAULT 'STARTER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interest_sortOrder_key" ON "Interest"("sortOrder");
