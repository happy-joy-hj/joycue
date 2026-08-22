from app.models.interest import Interest


def score_interest(
    activity_tags: list[str],
    interests: list[Interest],
) -> float:
    if not interests:
        return 0.0

    normalized_tags = {
        tag.strip().lower()
        for tag in activity_tags
    }

    selected_interest_tags = {
        interest.value.lower()
        for interest in interests
    }

    matching_interests = (
        normalized_tags
        & selected_interest_tags
    )

    if not matching_interests:
        return 0.0

    required_matches = min(
        len(selected_interest_tags),
        2,
    )

    return min(
        len(matching_interests) / required_matches,
        1.0,
    )
