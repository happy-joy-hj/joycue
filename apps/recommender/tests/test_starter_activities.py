import json
from collections import Counter
from pathlib import Path

from app.models.activity import Activity, ActivityCategory


REPO_ROOT = Path(__file__).resolve().parents[3]
STARTER_ACTIVITIES_PATH = REPO_ROOT / "data" / "starter_activities.json"


def load_starter_activities() -> list[Activity]:
    with STARTER_ACTIVITIES_PATH.open(encoding="utf-8") as file:
        raw_activities = json.load(file)

    return [Activity.model_validate(activity) for activity in raw_activities]


def test_starter_activity_file_exists():
    assert STARTER_ACTIVITIES_PATH.exists()


def test_starter_library_contains_exactly_20_activities():
    activities = load_starter_activities()

    assert len(activities) == 20


def test_starter_activity_ids_are_unique():
    activities = load_starter_activities()
    activity_ids = [activity.id for activity in activities]

    assert len(activity_ids) == len(set(activity_ids))


def test_starter_activity_titles_are_unique():
    activities = load_starter_activities()
    titles = [activity.title for activity in activities]

    assert len(titles) == len(set(titles))


def test_all_starter_activities_have_ranking_metadata():
    activities = load_starter_activities()

    for activity in activities:
        assert activity.time_min is not None
        assert activity.time_max is not None

        assert activity.energy_required is not None
        assert activity.activation_effort is not None
        assert activity.mental_effort is not None
        assert activity.physical_effort is not None

        assert activity.location_type is not None
        assert activity.environment is not None
        assert activity.social_mode is not None
        assert activity.screen_mode is not None

        assert activity.cost_min is not None
        assert activity.cost_max is not None

        assert activity.tags
        assert activity.plan_steps


def test_starter_activity_category_distribution():
    activities = load_starter_activities()

    category_counts = Counter(activity.category for activity in activities)

    assert category_counts == {
        ActivityCategory.REST: 3,
        ActivityCategory.MOVEMENT: 3,
        ActivityCategory.AWARENESS: 2,
        ActivityCategory.HOME: 2,
        ActivityCategory.FUN: 2,
        ActivityCategory.SOCIAL: 2,
        ActivityCategory.LEARNING: 2,
        ActivityCategory.CAREER: 1,
        ActivityCategory.CREATIVE: 1,
        ActivityCategory.EXPLORATION: 2,
    }
