from app.models.activity import LocationType


def score_location(
    activity_location: LocationType | None,
    preferred_location: LocationType,
) -> float:
    if activity_location is None:
        return 0.5

    if preferred_location == LocationType.EITHER:
        return 1.0

    if activity_location == LocationType.EITHER:
        return 1.0

    if activity_location == preferred_location:
        return 1.0

    return 0.0
