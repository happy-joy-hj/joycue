from app.models.activity import EffortLevel


EFFORT_RANK = {
    EffortLevel.VERY_LOW: 0,
    EffortLevel.LOW: 1,
    EffortLevel.MEDIUM: 2,
    EffortLevel.HIGH: 3,
}


def score_energy(
    energy_required: EffortLevel | None,
    available_energy: EffortLevel,
) -> float:
    if energy_required is None:
        return 0.5

    required_rank = EFFORT_RANK[energy_required]
    available_rank = EFFORT_RANK[available_energy]

    difference = required_rank - available_rank

    if difference <= 0:
        return 1.0

    if difference == 1:
        return 0.4

    return 0.0
