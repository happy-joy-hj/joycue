"use client";

import Link from "next/link";
import { useState } from "react";

type SavedActivity = {
  id: string;
  activity: {
    id: string;
    title: string;
    description: string | null;
    firstStep: string;
  };
};

type SavedActivitiesListProps = {
  initialSavedActivities: SavedActivity[];
};

export function SavedActivitiesList({
  initialSavedActivities,
}: SavedActivitiesListProps) {
  const [savedActivities, setSavedActivities] = useState(
    initialSavedActivities,
  );
  const [pendingActivityId, setPendingActivityId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function handleRemove(activityId: string) {
    if (pendingActivityId === activityId) {
      return;
    }

    setPendingActivityId(activityId);
    setError(null);

    try {
      const response = await fetch(`/api/saved-activities/${activityId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "We couldn't remove this saved activity.");
        return;
      }

      setSavedActivities((current) =>
        current.filter(
          (savedActivity) => savedActivity.activity.id !== activityId,
        ),
      );
    } catch {
      setError("Something went wrong while removing this saved activity.");
    } finally {
      setPendingActivityId(null);
    }
  }

  if (savedActivities.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-line bg-white/80 p-8 text-center">
        <h2 className="text-lg font-semibold text-joy-night">
          Nothing saved yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Save a recommendation and it will appear here for later.
        </p>

        <Link
          href="/recommend"
          className="bg-joy-gradient mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Find something
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p
          role="alert"
          className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-10 space-y-4">
        {savedActivities.map((savedActivity) => (
          <article
            key={savedActivity.id}
            className="rounded-2xl border border-line bg-white/85 p-5 shadow-[0_12px_32px_-26px_rgba(46,62,110,0.5)] transition hover:border-joy-soft-lavender sm:p-6"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-joy-purple uppercase">
                Saved activity
              </p>

              <h2 className="mt-2 text-lg font-semibold tracking-tight text-joy-night sm:text-xl">
                {savedActivity.activity.title}
              </h2>

              {savedActivity.activity.description && (
                <p className="mt-2 text-sm leading-6 text-muted">
                  {savedActivity.activity.description}
                </p>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-joy-soft-lavender/60 bg-joy-mist/25 px-4 py-3">
              <p className="text-xs font-semibold tracking-[0.12em] text-joy-purple uppercase">
                First step
              </p>

              <p className="mt-1.5 text-sm leading-6 text-joy-indigo">
                {savedActivity.activity.firstStep}
              </p>
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                disabled={pendingActivityId === savedActivity.activity.id}
                onClick={() => handleRemove(savedActivity.activity.id)}
                className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-joy-soft-lavender hover:bg-surface-soft hover:text-joy-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pendingActivityId === savedActivity.activity.id
                  ? "Removing..."
                  : "Remove from saved"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
