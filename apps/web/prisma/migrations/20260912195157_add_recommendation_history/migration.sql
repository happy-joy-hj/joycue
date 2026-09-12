-- CreateTable
CREATE TABLE "recommendation_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recommendation_session_userId_createdAt_idx" ON "recommendation_session"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "recommendation_activityId_idx" ON "recommendation"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_sessionId_activityId_key" ON "recommendation"("sessionId", "activityId");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_sessionId_rank_key" ON "recommendation"("sessionId", "rank");

-- AddForeignKey
ALTER TABLE "recommendation_session" ADD CONSTRAINT "recommendation_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "recommendation_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
