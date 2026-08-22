import json
from pathlib import Path

import pytest

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
from app.ranking.ranker import (
    PERSONALIZED_SCORE_WEIGHTS,
    SCORE_WEIGHTS,
    rank_activities,
    score_activity,
)
from app.explanations.reason_codes import ReasonCode
from app.models.interest import Interest


REPO_ROOT = Path(__file__).resolve().parents[3]
STARTER_ACTIVITIES_PATH = REPO_ROOT / "data" / "starter_activities.json"


def load_starter_activities() -> list[Activity]:
    with STARTER_ACTIVITIES_PATH.open(encoding="utf-8") as file:
        raw_activities = json.load(file)

    return [
        Activity.model_validate(activity)
        for activity in raw_activities
    ]


def make_activity(
    activity_id: str,
    *,
    time_min: int = 5,
    time_max: int = 10,
    energy: EffortLevel = EffortLevel.LOW,
    activation: EffortLevel = EffortLevel.VERY_LOW,
    location: LocationType = LocationType.STAY_IN,
    cost_min: float = 0,
    cost_max: float = 0,
    tags: list[str] | None = None,
) -> Activity:
    return Activity(
        id=activity_id,
        title=f"Activity {activity_id}",
        first_step="Start.",
        category=ActivityCategory.FUN,
        time_min=time_min,
        time_max=time_max,
        energy_required=energy,
        activation_effort=activation,
        location_type=location,
        cost_min=cost_min,
        cost_max=cost_max,
        tags=tags or [],
    )


def test_score_weights_add_up_to_one():
    assert sum(SCORE_WEIGHTS.values()) == pytest.approx(1.0)


def test_perfect_activity_match_scores_100():
    context = RecommendationContext(
        time=TimePreference.UNDER_10_MIN,
        energy=EffortLevel.LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
    )

    activity = make_activity("perfect")

    result = score_activity(activity, context)

    assert result.raw_score == 100.0
    assert result.reason_codes == [
        ReasonCode.TIME_MATCH,
        ReasonCode.ENERGY_MATCH,
        ReasonCode.EASY_TO_START,
        ReasonCode.LOCATION_MATCH,
        ReasonCode.BUDGET_MATCH,
    ]


def test_score_activity_contains_breakdown():
    context = RecommendationContext(
        time=TimePreference.UNDER_10_MIN,
        energy=EffortLevel.LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
    )

    activity = make_activity("breakdown")

    result = score_activity(activity, context)

    assert result.score_breakdown.time == 1.0
    assert result.score_breakdown.energy == 1.0
    assert result.score_breakdown.activation == 1.0
    assert result.score_breakdown.location == 1.0
    assert result.score_breakdown.budget == 1.0


def test_poor_match_scores_lower_than_good_match():
    context = RecommendationContext(
        time=TimePreference.UNDER_10_MIN,
        energy=EffortLevel.VERY_LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
    )

    good_activity = make_activity(
        "good",
        energy=EffortLevel.VERY_LOW,
    )

    poor_activity = make_activity(
        "poor",
        time_min=30,
        time_max=60,
        energy=EffortLevel.MEDIUM,
        activation=EffortLevel.MEDIUM,
        location=LocationType.GO_OUT,
        cost_min=10,
        cost_max=20,
    )

    good_result = score_activity(good_activity, context)
    poor_result = score_activity(poor_activity, context)

    assert good_result.raw_score > poor_result.raw_score


def test_rank_activities_orders_highest_score_first():
    context = RecommendationContext(
        time=TimePreference.UNDER_10_MIN,
        energy=EffortLevel.VERY_LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
    )

    activities = [
        make_activity(
            "poor",
            time_min=5,
            time_max=10,
            energy=EffortLevel.MEDIUM,
            activation=EffortLevel.HIGH,
            location=LocationType.STAY_IN,
        ),
        make_activity(
            "good",
            energy=EffortLevel.VERY_LOW,
        ),
    ]

    ranked = rank_activities(activities, context)

    assert ranked[0].activity_id == "good"
    assert ranked[0].raw_score > ranked[1].raw_score


def test_rank_activities_breaks_ties_by_activity_id():
    context = RecommendationContext(
        time=TimePreference.ANY,
        energy=EffortLevel.HIGH,
        location=LocationType.EITHER,
        budget=BudgetPreference.ANY,
    )

    activities = [
        make_activity("activity_b"),
        make_activity("activity_a"),
    ]

    ranked = rank_activities(activities, context)

    assert [result.activity_id for result in ranked] == [
        "activity_a",
        "activity_b",
    ]


def test_go_out_context_prefers_outdoor_activities():
    activities = load_starter_activities()

    context = RecommendationContext(
        time=TimePreference.AROUND_30_MIN,
        energy=EffortLevel.MEDIUM,
        location=LocationType.GO_OUT,
        budget=BudgetPreference.LOW_COST,
    )

    ranked = rank_activities(activities, context)

    top_three_ids = [
        result.activity_id
        for result in ranked[:3]
    ]

    assert top_three_ids == [
        "act_006",
        "act_019",
        "act_020",
    ]

def test_ranker_excludes_candidates_that_violate_hard_constraints():
    activities = load_starter_activities()

    context = RecommendationContext(
        time=TimePreference.AROUND_30_MIN,
        energy=EffortLevel.MEDIUM,
        location=LocationType.GO_OUT,
        budget=BudgetPreference.FREE,
    )

    ranked = rank_activities(activities, context)

    ranked_ids = [
        result.activity_id
        for result in ranked
    ]

    assert "act_017" not in ranked_ids
    assert "act_020" not in ranked_ids

def test_personalized_score_weights_add_up_to_one():
    assert sum(
        PERSONALIZED_SCORE_WEIGHTS.values()
    ) == pytest.approx(1.0)

def test_no_interests_preserves_baseline_score():
    context = RecommendationContext(
        time=TimePreference.UNDER_10_MIN,
        energy=EffortLevel.LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
    )

    activity = make_activity(
        "baseline",
        tags=["movement"],
    )

    result = score_activity(
        activity,
        context,
        [],
    )

    assert result.raw_score == 100.0
    assert result.score_breakdown.interest is None
    assert ReasonCode.INTEREST_MATCH not in result.reason_codes

def test_interest_match_can_change_ranking():
    context = RecommendationContext(
        time=TimePreference.ANY,
        energy=EffortLevel.HIGH,
        location=LocationType.EITHER,
        budget=BudgetPreference.ANY,
    )

    activities = [
        make_activity(
            "activity_a",
            tags=["home"],
        ),
        make_activity(
            "activity_b",
            tags=["movement"],
        ),
    ]

    baseline = rank_activities(
        activities,
        context,
    )

    personalized = rank_activities(
        activities,
        context,
        [Interest.MOVEMENT],
    )

    assert baseline[0].activity_id == "activity_a"
    assert personalized[0].activity_id == "activity_b"
    assert (
        ReasonCode.INTEREST_MATCH
        in personalized[0].reason_codes
    )
