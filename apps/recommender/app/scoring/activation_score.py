from app.models.activity import EffortLevel


ACTIVATION_SCORES = {
    EffortLevel.VERY_LOW: 1.0,
    EffortLevel.LOW: 0.8,
    EffortLevel.MEDIUM: 0.5,
    EffortLevel.HIGH: 0.2,
}


def score_activation(
    activation_effort: EffortLevel | None,
) -> float:
    if activation_effort is None:
        return 0.5

    return ACTIVATION_SCORES[activation_effort]
