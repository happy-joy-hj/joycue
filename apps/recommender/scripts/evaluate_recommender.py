import json
from pathlib import Path

from app.models.activity import Activity, EffortLevel, LocationType
from app.models.context import (
    BudgetPreference,
    RecommendationContext,
    TimePreference,
)
from app.ranking.ranker import rank_activities


REPO_ROOT = Path(__file__).resolve().parents[3]
STARTER_ACTIVITIES_PATH = REPO_ROOT / "data" / "starter_activities.json"


def load_starter_activities() -> list[Activity]:
    with STARTER_ACTIVITIES_PATH.open(encoding="utf-8") as file:
        raw_activities = json.load(file)

    return [
        Activity.model_validate(activity)
        for activity in raw_activities
    ]


def print_scenario(
    name: str,
    context: RecommendationContext,
    activities: list[Activity],
    limit: int = 5,
) -> None:
    ranked = rank_activities(activities, context)

    activities_by_id = {
        activity.id: activity
        for activity in activities
    }

    print()
    print("=" * 72)
    print(name)
    print("=" * 72)
    print(
        f"Time: {context.time.value} | "
        f"Energy: {context.energy.value} | "
        f"Location: {context.location.value} | "
        f"Budget: {context.budget.value}"
    )
    print()

    for position, result in enumerate(ranked[:limit], start=1):
        activity = activities_by_id[result.activity_id]
        breakdown = result.score_breakdown
        reason_codes = ", ".join(
            reason.value
            for reason in result.reason_codes
        )

        print(
            f"{position}. {activity.title} "
            f"[{activity.category.value}] "
            f"- {result.raw_score:.2f}"
        )
        print(
            "   "
            f"time={breakdown.time:.1f} | "
            f"energy={breakdown.energy:.1f} | "
            f"activation={breakdown.activation:.1f} | "
            f"location={breakdown.location:.1f} | "
            f"budget={breakdown.budget:.1f}"
        )
        print(f"   Reasons: {reason_codes}")
        print(f"   First step: {activity.first_step}")
        print()


def main() -> None:
    activities = load_starter_activities()

    scenarios = [
        (
            "Scenario A - Very low energy, quick and at home",
            RecommendationContext(
                time=TimePreference.UNDER_10_MIN,
                energy=EffortLevel.VERY_LOW,
                location=LocationType.STAY_IN,
                budget=BudgetPreference.FREE,
            ),
        ),
        (
            "Scenario B - Medium energy, more time and willing to go out",
            RecommendationContext(
                time=TimePreference.AROUND_30_MIN,
                energy=EffortLevel.MEDIUM,
                location=LocationType.GO_OUT,
                budget=BudgetPreference.LOW_COST,
            ),
        ),
        (
            "Scenario C - Low energy, about 15 minutes and at home",
            RecommendationContext(
                time=TimePreference.AROUND_15_MIN,
                energy=EffortLevel.LOW,
                location=LocationType.STAY_IN,
                budget=BudgetPreference.FREE,
            ),
        ),
        (
            "Scenario D - Medium energy, wants to go out but spend nothing",
            RecommendationContext(
                time=TimePreference.AROUND_30_MIN,
                energy=EffortLevel.MEDIUM,
                location=LocationType.GO_OUT,
                budget=BudgetPreference.FREE,
            ),
        ),
    ]

    for name, context in scenarios:
        print_scenario(
            name=name,
            context=context,
            activities=activities,
        )


if __name__ == "__main__":
    main()
