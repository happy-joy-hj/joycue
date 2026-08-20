from app.models.activity import EffortLevel, LocationType
from app.models.context import BudgetPreference, TimePreference
from app.scoring.activation_score import score_activation
from app.scoring.budget_score import score_budget
from app.scoring.energy_score import score_energy
from app.scoring.location_score import score_location
from app.scoring.time_score import score_time


def test_time_any_always_matches():
    assert score_time(20, 60, TimePreference.ANY) == 1.0


def test_time_scores_overlapping_window_as_full_match():
    assert score_time(5, 15, TimePreference.UNDER_10_MIN) == 1.0


def test_time_scores_nearby_window_as_partial_match():
    assert score_time(21, 30, TimePreference.AROUND_15_MIN) == 0.5


def test_time_scores_far_window_as_no_match():
    assert score_time(30, 60, TimePreference.UNDER_10_MIN) == 0.0


def test_energy_requirement_within_available_energy_matches():
    assert (
        score_energy(EffortLevel.LOW, EffortLevel.MEDIUM)
        == 1.0
    )


def test_energy_one_level_above_is_partial_match():
    assert (
        score_energy(EffortLevel.MEDIUM, EffortLevel.LOW)
        == 0.4
    )


def test_energy_two_levels_above_is_no_match():
    assert (
        score_energy(EffortLevel.MEDIUM, EffortLevel.VERY_LOW)
        == 0.0
    )


def test_activation_rewards_easy_to_start_activity():
    assert score_activation(EffortLevel.VERY_LOW) == 1.0


def test_activation_penalizes_hard_to_start_activity():
    assert score_activation(EffortLevel.HIGH) == 0.2


def test_location_exact_match():
    assert (
        score_location(
            LocationType.STAY_IN,
            LocationType.STAY_IN,
        )
        == 1.0
    )


def test_location_either_matches_specific_preference():
    assert (
        score_location(
            LocationType.EITHER,
            LocationType.STAY_IN,
        )
        == 1.0
    )


def test_location_mismatch():
    assert (
        score_location(
            LocationType.GO_OUT,
            LocationType.STAY_IN,
        )
        == 0.0
    )


def test_budget_any_matches_any_cost():
    assert score_budget(50, 100, BudgetPreference.ANY) == 1.0


def test_budget_free_matches_free_activity():
    assert score_budget(0, 0, BudgetPreference.FREE) == 1.0


def test_budget_free_rejects_paid_activity():
    assert score_budget(5, 20, BudgetPreference.FREE) == 0.0


def test_budget_low_cost_matches_inexpensive_activity():
    assert score_budget(5, 20, BudgetPreference.LOW_COST) == 1.0
