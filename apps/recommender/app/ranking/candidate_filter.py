from app.models.activity import Activity, LocationType
from app.models.context import (
    BudgetPreference,
    RecommendationContext,
    TimePreference,
)


def is_candidate_eligible(
    activity: Activity,
    context: RecommendationContext,
) -> bool:
    if (
        context.location == LocationType.STAY_IN
        and activity.location_type == LocationType.GO_OUT
    ):
        return False

    if (
        context.location == LocationType.GO_OUT
        and activity.location_type == LocationType.STAY_IN
    ):
        return False

    if (
        context.budget == BudgetPreference.FREE
        and activity.cost_min is not None
        and activity.cost_min > 0
    ):
        return False

    if (
        context.time == TimePreference.UNDER_10_MIN
        and activity.time_min is not None
        and activity.time_min > 10
    ):
        return False

    return True


def filter_candidates(
    activities: list[Activity],
    context: RecommendationContext,
) -> list[Activity]:
    return [
        activity
        for activity in activities
        if is_candidate_eligible(activity, context)
    ]
