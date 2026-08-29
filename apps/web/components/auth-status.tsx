"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function AuthStatus() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    const { error } = await authClient.signOut();

    if (error) {
      setIsSigningOut(false);
      return;
    }

    router.refresh();
  }

  if (isPending) {
    return <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          Sign in
        </Link>

        <Link
          href="/sign-up"
          className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="hidden text-sm text-slate-600 sm:block">
        Hi, {session.user.name}
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
