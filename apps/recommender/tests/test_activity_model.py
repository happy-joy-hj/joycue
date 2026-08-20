import pytest
from pydantic import ValidationError

from app.models.activity import (
    Activity,
    ActivityCategory,
    EffortLevel,
    LocationType,
)


def test_valid_activity():
    activity = Activity(
        id="act_001",
        title="Take a short walk",
        first_step="Put on whatever you need to step outside.",
        category=ActivityCategory.MOVEMENT,
        tags=["movement", "outdoors"],
        time_min=10,
        time_max=20,
        energy_required=EffortLevel.LOW,
        activation_effort=EffortLevel.LOW,
        location_type=LocationType.GO_OUT,
        cost_min=0,
        cost_max=0,
    )

    assert activity.id == "act_001"
    assert activity.category == ActivityCategory.MOVEMENT
    assert activity.time_min == 10
    assert activity.time_max == 20


def test_activity_allows_missing_optional_metadata():
    activity = Activity(
        id="custom_001",
        title="Try that cafe",
        first_step="Look up the place you noticed.",
        category=ActivityCategory.EXPLORATION,
    )

    assert activity.time_min is None
    assert activity.energy_required is None
    assert activity.tags == []


def test_time_max_cannot_be_less_than_time_min():
    with pytest.raises(ValidationError):
        Activity(
            id="act_bad_time",
            title="Invalid activity",
            first_step="Start.",
            category=ActivityCategory.FUN,
            time_min=20,
            time_max=10,
        )


def test_cost_max_cannot_be_less_than_cost_min():
    with pytest.raises(ValidationError):
        Activity(
            id="act_bad_cost",
            title="Invalid activity",
            first_step="Start.",
            category=ActivityCategory.FUN,
            cost_min=10,
            cost_max=5,
        )


def test_unknown_fields_are_rejected():
    with pytest.raises(ValidationError):
        Activity(
            id="act_bad_field",
            title="Invalid activity",
            first_step="Start.",
            category=ActivityCategory.FUN,
            unknown_field="hello",
        )
