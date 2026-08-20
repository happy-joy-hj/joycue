from app.models.activity import (
    Activity,
    ActivityCategory,
    EffortLevel,
    LocationType,
)
from app.models.context import (
    BudgetPreference,
    RecommendationContext,
    TimePreference,
)
from app.ranking.candidate_filter import (
    filter_candidates,
    is_candidate_eligible,
)


def make_activity(
    activity_id: str,
    *,
    location: LocationType | None = LocationType.EITHER,
    time_min: int | None = 5,
    time_max: int | None = 10,
    cost_min: float | None = 0,
    cost_max: float | None = 0,
) -> Activity:
    return Activity(
        id=activity_id,
        title=f"Activity {activity_id}",
        first_step="Start.",
        category=ActivityCategory.FUN,
        time_min=time_min,
        time_max=time_max,
        energy_required=EffortLevel.LOW,
        activation_effort=EffortLevel.LOW,
        location_type=location,
        cost_min=cost_min,
        cost_max=cost_max,
    )


def make_context(
    *,
    time: TimePreference = TimePreference.ANY,
    location: LocationType = LocationType.EITHER,
    budget: BudgetPreference = BudgetPreference.ANY,
) -> RecommendationContext:
    return RecommendationContext(
        time=time,
        energy=EffortLevel.MEDIUM,
        location=location,
        budget=budget,
    )


def test_stay_in_filters_go_out_activity():
    activity = make_activity(
        "go_out",
        location=LocationType.GO_OUT,
    )

    context = make_context(
        location=LocationType.STAY_IN,
    )

    assert not is_candidate_eligible(activity, context)


def test_go_out_filters_stay_in_activity():
    activity = make_activity(
        "stay_in",
        location=LocationType.STAY_IN,
    )

    context = make_context(
        location=LocationType.GO_OUT,
    )

    assert not is_candidate_eligible(activity, context)


def test_either_location_remains_eligible():
    activity = make_activity(
        "either",
        location=LocationType.EITHER,
    )

    context = make_context(
        location=LocationType.GO_OUT,
    )

    assert is_candidate_eligible(activity, context)


def test_free_budget_filters_paid_activity():
    activity = make_activity(
        "paid",
        cost_min=5,
        cost_max=20,
    )

    context = make_context(
        budget=BudgetPreference.FREE,
    )

    assert not is_candidate_eligible(activity, context)


def test_unknown_cost_does_not_filter_activity():
    activity = make_activity(
        "unknown_cost",
        cost_min=None,
        cost_max=None,
    )

    context = make_context(
        budget=BudgetPreference.FREE,
    )

    assert is_candidate_eligible(activity, context)


def test_under_10_filters_activity_that_cannot_fit():
    activity = make_activity(
        "too_long",
        time_min=20,
        time_max=30,
    )

    context = make_context(
        time=TimePreference.UNDER_10_MIN,
    )

    assert not is_candidate_eligible(activity, context)


def test_filter_candidates_returns_only_eligible_activities():
    activities = [
        make_activity(
            "eligible",
            location=LocationType.STAY_IN,
        ),
        make_activity(
            "wrong_location",
            location=LocationType.GO_OUT,
        ),
        make_activity(
            "paid",
            location=LocationType.STAY_IN,
            cost_min=10,
            cost_max=20,
        ),
    ]

    context = make_context(
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
    )

    filtered = filter_candidates(activities, context)

    assert [activity.id for activity in filtered] == [
        "eligible",
    ]
