"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function AuthStatus() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    const { error } = await authClient.signOut();

    if (error) {
      setIsSigningOut(false);
      return;
    }

    setIsSigningOut(false);
    router.refresh();
  }

  if (isPending) {
    return (
      <div
        className="h-10 w-28 animate-pulse rounded-xl bg-white/15 sm:w-32"
        aria-hidden="true"
      />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/sign-in"
          className="rounded-lg px-1 py-2 text-sm font-medium text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          Sign in
        </Link>

        <Link
          href="/sign-up"
          className="rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-joy-indigo shadow-sm transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-joy-night sm:px-4"
        >
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <nav
        aria-label="Primary navigation"
        className="flex items-center gap-1 sm:gap-2"
      >
        <Link
          href="/recommend"
          className={`rounded-lg px-2 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:px-3 ${
            pathname.startsWith("/recommend")
              ? "bg-white/15 text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          Recommend
        </Link>

        <Link
          href="/saved"
          className={`rounded-lg px-2 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:px-3 ${
            pathname.startsWith("/saved")
              ? "bg-white/15 text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          Saved
        </Link>
      </nav>

      <p
        className="hidden max-w-40 truncate text-sm text-white/80 lg:block"
        title={session.user.name}
      >
        Hi, {session.user.name}
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-joy-indigo shadow-sm transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-joy-night disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
