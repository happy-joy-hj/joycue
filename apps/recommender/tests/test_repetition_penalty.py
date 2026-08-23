from app.models.history import RecommendationHistoryItem
from app.scoring.repetition_penalty import (
    calculate_repetition_penalty,
)


def test_no_history_returns_zero_penalty():
    assert (
        calculate_repetition_penalty(
            "act_006",
            [],
        )
        == 0.0
    )


def test_activity_not_in_history_returns_zero_penalty():
    history = [
        RecommendationHistoryItem(
            activity_id="act_019",
            sessions_ago=1,
        ),
    ]

    assert (
        calculate_repetition_penalty(
            "act_006",
            history,
        )
        == 0.0
    )


def test_previous_session_has_largest_penalty():
    history = [
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=1,
        ),
    ]

    assert (
        calculate_repetition_penalty(
            "act_006",
            history,
        )
        == 15.0
    )


def test_two_sessions_ago_has_medium_penalty():
    history = [
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=2,
        ),
    ]

    assert (
        calculate_repetition_penalty(
            "act_006",
            history,
        )
        == 10.0
    )


def test_three_sessions_ago_has_small_penalty():
    history = [
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=3,
        ),
    ]

    assert (
        calculate_repetition_penalty(
            "act_006",
            history,
        )
        == 5.0
    )


def test_four_or_more_sessions_ago_has_no_penalty():
    history = [
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=4,
        ),
    ]

    assert (
        calculate_repetition_penalty(
            "act_006",
            history,
        )
        == 0.0
    )


def test_most_recent_history_entry_determines_penalty():
    history = [
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=3,
        ),
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=1,
        ),
    ]

    assert (
        calculate_repetition_penalty(
            "act_006",
            history,
        )
        == 15.0
    )
