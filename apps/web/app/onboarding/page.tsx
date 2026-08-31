"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

type Interest = {
  key: string;
  label: string;
  description: string | null;
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [name, setName] = useState<string | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentName = name ?? session?.user.name ?? "";

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.replace("/sign-in");
    }
  }, [isSessionPending, router, session]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInterests() {
      try {
        const response = await fetch("/api/interests", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load interests.");
        }

        const data = (await response.json()) as {
          interests: Interest[];
        };

        setInterests(data.interests);
      } catch (loadError) {
        if (
          loadError instanceof DOMException &&
          loadError.name === "AbortError"
        ) {
          return;
        }

        setError("We couldn't load your interests. Please try again.");
      } finally {
        setIsLoadingInterests(false);
      }
    }

    void loadInterests();

    return () => {
      controller.abort();
    };
  }, []);

  function toggleInterest(key: string) {
    setSelectedInterests((currentInterests) =>
      currentInterests.includes(key)
        ? currentInterests.filter((interest) => interest !== key)
        : [...currentInterests, key],
    );
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = currentName.trim();

    if (!trimmedName) {
      setError("Please enter what you'd like JoyCue to call you.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/me/onboarding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          interests: selectedInterests,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "We couldn't save your choices.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isSessionPending || (!session && !isSessionPending)) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-sm text-muted">Loading your JoyCue...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-12 sm:py-16">
      <section className="mx-auto w-full max-w-4xl">
        <div className="text-center">
          <div className="mx-auto mb-5 w-fit rounded-full border border-line bg-white/70 px-4 py-1.5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-joy-purple uppercase">
              Welcome to JoyCue
            </p>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-joy-night sm:text-5xl">
            Make JoyCue feel more{" "}
            <span className="text-joy-gradient">like yours.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">
            Tell us a little about what you enjoy. You can always change these
            choices later.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 overflow-hidden rounded-3xl border border-line bg-white/85 shadow-[0_20px_60px_-35px_rgba(46,62,110,0.45)] backdrop-blur-sm"
        >
          <div className="bg-joy-gradient h-1.5 w-full" />

          <div className="space-y-10 px-6 py-8 sm:px-10 sm:py-10">
            <section>
              <label
                htmlFor="preferred-name"
                className="text-xl font-semibold tracking-tight text-joy-night"
              >
                What should JoyCue call you?
              </label>

              <p className="mt-2 text-sm leading-6 text-muted">
                Use your name, a nickname, or anything you&apos;d like to be
                called.
              </p>

              <input
                id="preferred-name"
                type="text"
                value={currentName}
                onChange={(event) => setName(event.target.value)}
                maxLength={50}
                autoComplete="name"
                className="mt-5 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-joy-night outline-none transition placeholder:text-muted/60 focus:border-joy-purple focus:ring-4 focus:ring-joy-soft-lavender/40"
                placeholder="What should we call you?"
              />
            </section>

            <section>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-joy-night">
                  What are you interested in?
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Pick anything you&apos;d like more of. You don&apos;t have to
                  choose everything now.
                </p>
              </div>

              {isLoadingInterests ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-28 animate-pulse rounded-2xl border border-line bg-surface-soft"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {interests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.key);

                    return (
                      <button
                        key={interest.key}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleInterest(interest.key)}
                        className={`rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-purple focus-visible:ring-offset-2 ${
                          isSelected
                            ? "border-joy-purple bg-gradient-to-br from-joy-mist/70 to-joy-soft-lavender/70 shadow-sm"
                            : "border-line bg-white/70 hover:border-joy-soft-lavender hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-joy-night">
                              {interest.label}
                            </p>

                            {interest.description && (
                              <p className="mt-2 text-sm leading-6 text-muted">
                                {interest.description}
                              </p>
                            )}
                          </div>

                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                              isSelected
                                ? "border-joy-purple bg-joy-purple text-white"
                                : "border-line text-transparent"
                            }`}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {selectedInterests.length === 0
                  ? "Choosing interests is optional."
                  : `${selectedInterests.length} ${
                      selectedInterests.length === 1 ? "interest" : "interests"
                    } selected`}
              </p>

              <button
                type="submit"
                disabled={isSaving || isLoadingInterests}
                className="bg-joy-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
