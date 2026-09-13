-- CreateEnum
CREATE TYPE "RecommendationActionType" AS ENUM ('DO_NOW', 'NOT_FOR_ME');

-- CreateTable
CREATE TABLE "recommendation_action" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "type" "RecommendationActionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recommendation_action_recommendationId_createdAt_idx" ON "recommendation_action"("recommendationId", "createdAt");

-- AddForeignKey
ALTER TABLE "recommendation_action" ADD CONSTRAINT "recommendation_action_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
