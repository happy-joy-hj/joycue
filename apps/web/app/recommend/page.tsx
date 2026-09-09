import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RecommendationContextForm } from "@/app/recommend/recommendation-context-form";

export default async function RecommendPage() {
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

  return (
    <main className="flex-1 px-6 py-14 sm:py-16">
      <section className="mx-auto w-full max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-joy-purple uppercase">
            Your moment
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-joy-night sm:text-4xl">
            What fits right now?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Tell JoyCue a little about your current situation so it can suggest
            something realistic for this moment.
          </p>
        </div>

        <div className="mt-10">
          <RecommendationContextForm />
        </div>
      </section>
    </main>
  );
}
