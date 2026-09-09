"use client";

import { useState } from "react";

import {
  type BudgetPreference,
  type EnergyLevel,
  type LocationPreference,
  type TimePreference,
} from "@/lib/recommendation-context";

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
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

  const isComplete =
    time !== null && energy !== null && location !== null && budget !== null;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white/85 shadow-[0_20px_60px_-35px_rgba(46,62,110,0.45)] backdrop-blur-sm">
      <div className="bg-joy-gradient h-1.5 w-full" />

      <div className="space-y-10 px-6 py-8 sm:px-10 sm:py-10">
        <ContextSection
          title="How much time do you have?"
          options={timeOptions}
          selectedValue={time}
          onSelect={setTime}
        />

        <ContextSection
          title="How's your energy?"
          options={energyOptions}
          selectedValue={energy}
          onSelect={setEnergy}
        />

        <ContextSection
          title="Would you rather stay in or go out?"
          options={locationOptions}
          selectedValue={location}
          onSelect={setLocation}
        />

        <ContextSection
          title="What works for your budget?"
          options={budgetOptions}
          selectedValue={budget}
          onSelect={setBudget}
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
            onChange={(event) => setText(event.target.value)}
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
          {isComplete ? (
            <div
              role="status"
              className="rounded-2xl border border-joy-soft-lavender bg-gradient-to-br from-joy-mist/50 to-joy-soft-lavender/50 px-5 py-4"
            >
              <p className="font-semibold text-joy-night">
                Your context is ready.
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                JoyCue has the information it needs to look for something that
                fits this moment.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Choose one option from each section to continue.
            </p>
          )}
        </div>
      </div>
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
