from app.models.context import TimePreference


TIME_WINDOWS = {
    TimePreference.UNDER_10_MIN: (1, 10),
    TimePreference.AROUND_15_MIN: (10, 20),
    TimePreference.AROUND_30_MIN: (20, 40),
    TimePreference.AROUND_60_MIN: (40, 75),
}


def score_time(
    time_min: int | None,
    time_max: int | None,
    preference: TimePreference,
) -> float:
    if preference == TimePreference.ANY:
        return 1.0

    if time_min is None or time_max is None:
        return 0.5

    preferred_min, preferred_max = TIME_WINDOWS[preference]

    overlaps = (
        time_min <= preferred_max
        and time_max >= preferred_min
    )

    if overlaps:
        return 1.0

    if time_min > preferred_max:
        difference = time_min - preferred_max
    else:
        difference = preferred_min - time_max

    if difference <= 10:
        return 0.5

    return 0.0
