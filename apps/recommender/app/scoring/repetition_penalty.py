from app.models.history import RecommendationHistoryItem


RECENCY_PENALTIES = {
    1: 15.0,
    2: 10.0,
    3: 5.0,
}


def calculate_repetition_penalty(
    activity_id: str,
    history: list[RecommendationHistoryItem],
) -> float:
    matching_sessions = [
        item.sessions_ago
        for item in history
        if item.activity_id == activity_id
    ]

    return sum(
        RECENCY_PENALTIES.get(sessions_ago, 0.0)
        for sessions_ago in matching_sessions
    )
