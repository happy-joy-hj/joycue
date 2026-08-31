import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { OnboardingForm } from "@/app/onboarding/onboarding-form";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function OnboardingPage() {
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

  if (profile?.onboardingCompleted) {
    redirect("/");
  }

  return <OnboardingForm />;
}
