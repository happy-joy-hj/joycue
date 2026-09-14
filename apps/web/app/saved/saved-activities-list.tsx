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
        <p role="alert" className="mt-8 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-10 space-y-4">
        {savedActivities.map((savedActivity) => (
          <article
            key={savedActivity.id}
            className="rounded-2xl border border-line bg-white/80 p-5"
          >
            <h2 className="text-lg font-semibold text-joy-night">
              {savedActivity.activity.title}
            </h2>

            {savedActivity.activity.description && (
              <p className="mt-2 text-sm leading-6 text-muted">
                {savedActivity.activity.description}
              </p>
            )}

            <p className="mt-4 text-sm leading-6 text-joy-indigo">
              <span className="font-semibold">First step:</span>{" "}
              {savedActivity.activity.firstStep}
            </p>

            <button
              type="button"
              disabled={pendingActivityId === savedActivity.activity.id}
              onClick={() => handleRemove(savedActivity.activity.id)}
              className="mt-5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-joy-soft-lavender hover:text-joy-indigo disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pendingActivityId === savedActivity.activity.id
                ? "Removing..."
                : "Remove from saved"}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
