from app.models.history import RecommendationHistoryItem
from app.scoring.feedback_penalty import calculate_feedback_penalty


def test_returns_zero_without_history():
    assert calculate_feedback_penalty("act_1", []) == 0.0


def test_returns_zero_when_activity_was_not_rejected():
    history = [
        RecommendationHistoryItem(
            activity_id="act_1",
            sessions_ago=1,
            not_for_me=False,
        ),
    ]

    assert calculate_feedback_penalty("act_1", history) == 0.0


def test_penalizes_recent_not_for_me_feedback():
    history = [
        RecommendationHistoryItem(
            activity_id="act_1",
            sessions_ago=1,
            not_for_me=True,
        ),
    ]

    assert calculate_feedback_penalty("act_1", history) == 20.0


def test_penalty_decreases_with_recency():
    assert (
        calculate_feedback_penalty(
            "act_1",
            [
                RecommendationHistoryItem(
                    activity_id="act_1",
                    sessions_ago=2,
                    not_for_me=True,
                ),
            ],
        )
        == 15.0
    )

    assert (
        calculate_feedback_penalty(
            "act_1",
            [
                RecommendationHistoryItem(
                    activity_id="act_1",
                    sessions_ago=3,
                    not_for_me=True,
                ),
            ],
        )
        == 10.0
    )


def test_accumulates_repeated_not_for_me_feedback():
    history = [
        RecommendationHistoryItem(
            activity_id="act_1",
            sessions_ago=1,
            not_for_me=True,
        ),
        RecommendationHistoryItem(
            activity_id="act_1",
            sessions_ago=2,
            not_for_me=True,
        ),
    ]

    assert calculate_feedback_penalty("act_1", history) == 35.0


def test_ignores_feedback_for_other_activities():
    history = [
        RecommendationHistoryItem(
            activity_id="act_2",
            sessions_ago=1,
            not_for_me=True,
        ),
    ]

    assert calculate_feedback_penalty("act_1", history) == 0.0
