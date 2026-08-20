import pytest
from pydantic import ValidationError

from app.models.activity import EffortLevel, LocationType
from app.models.context import (
    BudgetPreference,
    RecommendationContext,
    TimePreference,
)


def test_valid_recommendation_context():
    context = RecommendationContext(
        time=TimePreference.AROUND_30_MIN,
        energy=EffortLevel.LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
        text="I don't want to think.",
    )

    assert context.time == TimePreference.AROUND_30_MIN
    assert context.energy == EffortLevel.LOW
    assert context.location == LocationType.STAY_IN
    assert context.budget == BudgetPreference.FREE
    assert context.text == "I don't want to think."


def test_context_text_is_optional():
    context = RecommendationContext(
        time=TimePreference.UNDER_10_MIN,
        energy=EffortLevel.VERY_LOW,
        location=LocationType.EITHER,
        budget=BudgetPreference.ANY,
    )

    assert context.text is None


def test_context_text_is_trimmed():
    context = RecommendationContext(
        time=TimePreference.AROUND_15_MIN,
        energy=EffortLevel.LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
        text="   No work today.   ",
    )

    assert context.text == "No work today."


def test_blank_context_text_becomes_none():
    context = RecommendationContext(
        time=TimePreference.AROUND_15_MIN,
        energy=EffortLevel.LOW,
        location=LocationType.STAY_IN,
        budget=BudgetPreference.FREE,
        text="   ",
    )

    assert context.text is None


def test_invalid_context_value_is_rejected():
    with pytest.raises(ValidationError):
        RecommendationContext(
            time="SOMETIME_LATER",
            energy=EffortLevel.LOW,
            location=LocationType.STAY_IN,
            budget=BudgetPreference.FREE,
        )
