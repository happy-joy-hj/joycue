from app.models.history import RecommendationHistoryItem


FEEDBACK_RECENCY_PENALTIES = {
    1: 20.0,
    2: 15.0,
    3: 10.0,
}


def calculate_feedback_penalty(
    activity_id: str,
    history: list[RecommendationHistoryItem],
) -> float:
    matching_sessions = [
        item.sessions_ago
        for item in history
        if item.activity_id == activity_id and item.not_for_me
    ]

    return sum(
        FEEDBACK_RECENCY_PENALTIES.get(sessions_ago, 0.0)
        for sessions_ago in matching_sessions
    )
