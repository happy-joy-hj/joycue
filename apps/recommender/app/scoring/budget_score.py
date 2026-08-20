from app.models.context import BudgetPreference


def score_budget(
    cost_min: float | None,
    cost_max: float | None,
    preference: BudgetPreference,
) -> float:
    if preference == BudgetPreference.ANY:
        return 1.0

    if cost_min is None or cost_max is None:
        return 0.5

    if preference == BudgetPreference.FREE:
        return 1.0 if cost_min == 0 else 0.0

    if preference == BudgetPreference.LOW_COST:
        if cost_min <= 10:
            return 1.0

        if cost_min <= 25:
            return 0.5

        return 0.0

    return 0.0
