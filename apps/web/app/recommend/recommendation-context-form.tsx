"use client";

import { useState, type SyntheticEvent } from "react";

import {
  type BudgetPreference,
  type EnergyLevel,
  type LocationPreference,
  normalizeRecommendationContextText,
  type RecommendationContext,
  type TimePreference,
} from "@/lib/recommendation-context";

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
};

type RecommendationResult = {
  activity: {
    id: string;
    title: string;
    description: string | null;
    firstStep: string;
  };
  ranking: {
    finalScore: number;
    reasonCodes: string[];
  };
};

const timeOptions: Option<TimePreference>[] = [
  {
    value: "UNDER_10_MIN",
    label: "Under 10 min",
    description: "Something quick and easy to fit in.",
  },
  {
    value: "AROUND_15_MIN",
    label: "Around 15 min",
    description: "A short activity without a big commitment.",
  },
  {
    value: "AROUND_30_MIN",
    label: "Around 30 min",
    description: "Enough time to settle into something.",
  },
  {
    value: "AROUND_60_MIN",
    label: "Around an hour",
    description: "I have room for something more involved.",
  },
  {
    value: "ANY",
    label: "I'm flexible",
    description: "Time isn't a major constraint right now.",
  },
];

const energyOptions: Option<EnergyLevel>[] = [
  {
    value: "VERY_LOW",
    label: "Very low",
    description: "I want something extremely easy to start.",
  },
  {
    value: "LOW",
    label: "Low",
    description: "I can do a little, but nothing demanding.",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    description: "I have a reasonable amount of energy.",
  },
  {
    value: "HIGH",
    label: "High",
    description: "I'm ready for something more active or involved.",
  },
];

const locationOptions: Option<LocationPreference>[] = [
  {
    value: "STAY_IN",
    label: "Stay in",
    description: "I'd rather stay where I am.",
  },
  {
    value: "GO_OUT",
    label: "Go out",
    description: "I'm open to leaving home or my current place.",
  },
  {
    value: "EITHER",
    label: "Either",
    description: "Both staying in and going out work for me.",
  },
];

const budgetOptions: Option<BudgetPreference>[] = [
  {
    value: "FREE",
    label: "Free",
    description: "Keep the recommendation free.",
  },
  {
    value: "LOW_COST",
    label: "Low cost",
    description: "A small expense is okay.",
  },
  {
    value: "ANY",
    label: "Flexible",
    description: "Cost isn't a major constraint right now.",
  },
];

export function RecommendationContextForm() {
  const [time, setTime] = useState<TimePreference | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [location, setLocation] = useState<LocationPreference | null>(null);
  const [budget, setBudget] = useState<BudgetPreference | null>(null);
  const [text, setText] = useState("");
  const [recommendations, setRecommendations] = useState<
    RecommendationResult[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearRecommendationResults() {
    setRecommendations([]);
    setError(null);
  }

  const isComplete =
    time !== null && energy !== null && location !== null && budget !== null;

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!time || !energy || !location || !budget || isSubmitting) {
      return;
    }

    const context: RecommendationContext = {
      time,
      energy,
      location,
      budget,
      text: normalizeRecommendationContextText(text),
    };

    setError(null);
    setRecommendations([]);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(context),
      });

      const data = (await response.json()) as {
        recommendations?: RecommendationResult[];
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "We couldn't find recommendations right now.");
        return;
      }

      if (!Array.isArray(data.recommendations)) {
        throw new Error("Invalid recommendation response.");
      }

      setRecommendations(data.recommendations);
    } catch {
      setError(
        "Something went wrong while finding recommendations. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white/85 shadow-[0_20px_60px_-35px_rgba(46,62,110,0.45)] backdrop-blur-sm">
      <div className="bg-joy-gradient h-1.5 w-full" />

      <form
        onSubmit={handleSubmit}
        className="space-y-10 px-6 py-8 sm:px-10 sm:py-10"
      >
        <ContextSection
          title="How much time do you have?"
          options={timeOptions}
          selectedValue={time}
          onSelect={(value) => {
            setTime(value);
            clearRecommendationResults();
          }}
        />

        <ContextSection
          title="How's your energy?"
          options={energyOptions}
          selectedValue={energy}
          onSelect={(value) => {
            setEnergy(value);
            clearRecommendationResults();
          }}
        />

        <ContextSection
          title="Would you rather stay in or go out?"
          options={locationOptions}
          selectedValue={location}
          onSelect={(value) => {
            setLocation(value);
            clearRecommendationResults();
          }}
        />

        <ContextSection
          title="What works for your budget?"
          options={budgetOptions}
          selectedValue={budget}
          onSelect={(value) => {
            setBudget(value);
            clearRecommendationResults();
          }}
        />

        <div className="border-t border-line pt-8">
          <label
            htmlFor="recommendation-context"
            className="text-lg font-semibold text-joy-night"
          >
            Anything else JoyCue should know?
          </label>

          <p className="mt-1 text-sm leading-6 text-muted">
            Optional - for example, &quot;I don&apos;t want to think too
            much&quot; or &quot;No work today.&quot;
          </p>

          <textarea
            id="recommendation-context"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              clearRecommendationResults();
            }}
            maxLength={500}
            rows={4}
            placeholder="Tell JoyCue a little about your situation..."
            className="mt-4 w-full resize-none rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm leading-6 text-joy-night outline-none transition placeholder:text-muted/70 focus:border-joy-purple focus:ring-2 focus:ring-joy-purple/20"
          />

          <p className="mt-2 text-right text-xs text-muted">
            {text.length}/500
          </p>
        </div>

        <div className="border-t border-line pt-6">
          <button
            type="submit"
            disabled={!isComplete || isSubmitting}
            className="bg-joy-gradient w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? "Finding something..." : "Find something for me"}
          </button>

          {!isComplete && (
            <p className="mt-3 text-sm text-muted">
              Choose one option from each section to continue.
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </div>

        {recommendations.length > 0 && (
          <section className="border-t border-line pt-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-joy-purple uppercase">
                Your matches
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-joy-night">
                Here are a few things that fit.
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {recommendations.map((recommendation, index) => (
                <article
                  key={recommendation.activity.id}
                  className="rounded-2xl border border-line bg-white/70 p-5"
                >
                  <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                    Option {index + 1}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-joy-night">
                    {recommendation.activity.title}
                  </h3>

                  {recommendation.activity.description && (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {recommendation.activity.description}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-6 text-joy-indigo">
                    <span className="font-semibold">First step:</span>{" "}
                    {recommendation.activity.firstStep}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </form>
    </div>
  );
}

type ContextSectionProps<T extends string> = {
  title: string;
  options: Option<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
};

function ContextSection<T extends string>({
  title,
  options,
  selectedValue,
  onSelect,
}: ContextSectionProps<T>) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-joy-night">{title}</legend>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.value)}
              className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-purple focus-visible:ring-offset-2 ${
                isSelected
                  ? "border-joy-purple bg-gradient-to-br from-joy-mist/70 to-joy-soft-lavender/70 shadow-sm"
                  : "border-line bg-white/70 hover:border-joy-soft-lavender hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-joy-night">{option.label}</p>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    {option.description}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                    isSelected
                      ? "border-joy-purple bg-joy-purple text-white"
                      : "border-line text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
