"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [router, session]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmailPending, setIsEmailPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  async function handleEmailSignUp(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsEmailPending(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setIsEmailPending(false);

    if (error) {
      setErrorMessage(error.message || "Unable to create your account.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  async function handleGoogleSignUp() {
    setErrorMessage(null);
    setIsGooglePending(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      setIsGooglePending(false);
      setErrorMessage(error.message || "Unable to continue with Google.");
    }
  }

  if (isSessionPending || session) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-sm text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12 sm:py-16">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block rounded-full border border-line bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-joy-purple uppercase backdrop-blur-sm transition hover:bg-white"
          >
            JoyCue
          </Link>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-joy-night sm:text-4xl">
            Create your account
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
            Save your interests and build recommendations around you.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-white/90 shadow-[0_20px_60px_-35px_rgba(46,62,110,0.4)] backdrop-blur-sm">
          <div className="bg-joy-gradient h-1.5 w-full" />

          <div className="p-6 sm:p-8">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGooglePending || isEmailPending}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-joy-indigo transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGooglePending
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-joy-purple focus:ring-4 focus:ring-joy-soft-lavender/25"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-joy-purple focus:ring-4 focus:ring-joy-soft-lavender/25"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-joy-purple focus:ring-4 focus:ring-joy-soft-lavender/25"
                />

                <p className="mt-1.5 text-xs text-muted">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Confirm password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-joy-purple focus:ring-4 focus:ring-joy-soft-lavender/25"
                />
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isEmailPending || isGooglePending}
                className="bg-joy-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isEmailPending ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-joy-purple transition hover:text-joy-indigo"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
