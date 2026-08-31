"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Interest = {
  key: string;
  label: string;
  description: string | null;
};

export function OnboardingForm() {
  const router = useRouter();

  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function completeOnboarding(interestsToSave: string[]) {
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/me/onboarding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests: interestsToSave,
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
            What would you like{" "}
            <span className="text-joy-gradient">more of?</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">
            Pick anything that sounds interesting to you. JoyCue can use these
            choices to make future recommendations feel more personal.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-white/85 shadow-[0_20px_60px_-35px_rgba(46,62,110,0.45)] backdrop-blur-sm">
          <div className="bg-joy-gradient h-1.5 w-full" />

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {isLoadingInterests ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-2xl border border-line bg-surface-soft"
                    aria-hidden="true"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.key);

                  return (
                    <button
                      key={interest.key}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleInterest(interest.key)}
                      disabled={isSaving}
                      className={`rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
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

            {error && (
              <p
                role="alert"
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => void completeOnboarding([])}
                disabled={isSaving || isLoadingInterests}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted transition hover:bg-surface-soft hover:text-joy-indigo disabled:cursor-not-allowed disabled:opacity-60"
              >
                Do this later
              </button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {selectedInterests.length > 0 && (
                  <p className="text-sm text-muted">
                    {selectedInterests.length}{" "}
                    {selectedInterests.length === 1 ? "interest" : "interests"}{" "}
                    selected
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => void completeOnboarding(selectedInterests)}
                  disabled={
                    isSaving ||
                    isLoadingInterests ||
                    selectedInterests.length === 0
                  }
                  className="bg-joy-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save & continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
