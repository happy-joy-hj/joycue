import pytest
from pydantic import ValidationError

from app.models.history import RecommendationHistoryItem


def test_history_item_accepts_valid_values():
    item = RecommendationHistoryItem(
        activity_id="act_006",
        sessions_ago=1,
    )

    assert item.activity_id == "act_006"
    assert item.sessions_ago == 1


def test_history_item_rejects_empty_activity_id():
    with pytest.raises(ValidationError):
        RecommendationHistoryItem(
            activity_id="",
            sessions_ago=1,
        )


def test_history_item_rejects_zero_sessions_ago():
    with pytest.raises(ValidationError):
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=0,
        )


def test_history_item_rejects_negative_sessions_ago():
    with pytest.raises(ValidationError):
        RecommendationHistoryItem(
            activity_id="act_006",
            sessions_ago=-1,
        )
