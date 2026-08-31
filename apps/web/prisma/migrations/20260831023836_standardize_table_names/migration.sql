-- Rename JoyCue application tables to lowercase snake_case.
ALTER TABLE "Activity" RENAME TO "activity";
ALTER TABLE "Interest" RENAME TO "interest";
ALTER TABLE "UserProfile" RENAME TO "user_profile";
ALTER TABLE "UserInterest" RENAME TO "user_interest";

-- Rename primary key constraints to match the new table names.
ALTER TABLE "activity"
RENAME CONSTRAINT "Activity_pkey" TO "activity_pkey";

ALTER TABLE "interest"
RENAME CONSTRAINT "Interest_pkey" TO "interest_pkey";

ALTER TABLE "user_profile"
RENAME CONSTRAINT "UserProfile_pkey" TO "user_profile_pkey";

ALTER TABLE "user_interest"
RENAME CONSTRAINT "UserInterest_pkey" TO "user_interest_pkey";

-- Rename foreign key constraints.
ALTER TABLE "user_profile"
RENAME CONSTRAINT "UserProfile_userId_fkey" TO "user_profile_userId_fkey";

ALTER TABLE "user_interest"
RENAME CONSTRAINT "UserInterest_userId_fkey" TO "user_interest_userId_fkey";

ALTER TABLE "user_interest"
RENAME CONSTRAINT "UserInterest_interestKey_fkey"
TO "user_interest_interestKey_fkey";

-- Rename indexes created from the old table names.
ALTER INDEX "Interest_sortOrder_key"
RENAME TO "interest_sortOrder_key";

ALTER INDEX "UserInterest_interestKey_idx"
RENAME TO "user_interest_interestKey_idx";
