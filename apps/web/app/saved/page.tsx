import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { SavedActivitiesList } from "@/app/saved/saved-activities-list";

export default async function SavedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      onboardingCompleted: true,
    },
  });

  if (!profile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  const savedActivities = await prisma.savedActivity.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      activity: {
        select: {
          id: true,
          title: true,
          description: true,
          firstStep: true,
        },
      },
    },
  });

  return (
    <main className="flex-1 px-6 py-14 sm:py-16">
      <section className="mx-auto w-full max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-joy-purple uppercase">
            Saved for later
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-joy-night sm:text-4xl">
            Things you want to come back to
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Keep activities here when they sound useful, even if now is not the
            right moment.
          </p>
        </div>

        <SavedActivitiesList initialSavedActivities={savedActivities} />
      </section>
    </main>
  );
}
