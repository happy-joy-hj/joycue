-- CreateTable
CREATE TABLE "saved_activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_activity_userId_createdAt_idx" ON "saved_activity"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "saved_activity_activityId_idx" ON "saved_activity"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_activity_userId_activityId_key" ON "saved_activity"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "saved_activity" ADD CONSTRAINT "saved_activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_activity" ADD CONSTRAINT "saved_activity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
