from app.explanations.reason_codes import (
    ReasonCode,
    build_reason_codes,
)


def test_perfect_match_returns_all_reason_codes():
    reasons = build_reason_codes(
        time_score=1.0,
        energy_score=1.0,
        activation_score=1.0,
        location_score=1.0,
        budget_score=1.0,
    )

    assert reasons == [
        ReasonCode.TIME_MATCH,
        ReasonCode.ENERGY_MATCH,
        ReasonCode.EASY_TO_START,
        ReasonCode.LOCATION_MATCH,
        ReasonCode.BUDGET_MATCH,
    ]


def test_partial_time_match_does_not_return_time_reason():
    reasons = build_reason_codes(
        time_score=0.5,
        energy_score=1.0,
        activation_score=1.0,
        location_score=1.0,
        budget_score=1.0,
    )

    assert ReasonCode.TIME_MATCH not in reasons


def test_partial_energy_match_does_not_return_energy_reason():
    reasons = build_reason_codes(
        time_score=1.0,
        energy_score=0.4,
        activation_score=1.0,
        location_score=1.0,
        budget_score=1.0,
    )

    assert ReasonCode.ENERGY_MATCH not in reasons


def test_low_activation_effort_is_easy_to_start():
    reasons = build_reason_codes(
        time_score=1.0,
        energy_score=1.0,
        activation_score=0.8,
        location_score=1.0,
        budget_score=1.0,
    )

    assert ReasonCode.EASY_TO_START in reasons


def test_medium_activation_effort_is_not_easy_to_start():
    reasons = build_reason_codes(
        time_score=1.0,
        energy_score=1.0,
        activation_score=0.5,
        location_score=1.0,
        budget_score=1.0,
    )

    assert ReasonCode.EASY_TO_START not in reasons


def test_partial_location_match_does_not_return_location_reason():
    reasons = build_reason_codes(
        time_score=1.0,
        energy_score=1.0,
        activation_score=1.0,
        location_score=0.5,
        budget_score=1.0,
    )

    assert ReasonCode.LOCATION_MATCH not in reasons
