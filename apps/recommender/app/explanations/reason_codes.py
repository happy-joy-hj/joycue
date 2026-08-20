from enum import Enum


class ReasonCode(str, Enum):
    TIME_MATCH = "TIME_MATCH"
    ENERGY_MATCH = "ENERGY_MATCH"
    EASY_TO_START = "EASY_TO_START"
    LOCATION_MATCH = "LOCATION_MATCH"
    BUDGET_MATCH = "BUDGET_MATCH"


def build_reason_codes(
    *,
    time_score: float,
    energy_score: float,
    activation_score: float,
    location_score: float,
    budget_score: float,
) -> list[ReasonCode]:
    reason_codes: list[ReasonCode] = []

    if time_score == 1.0:
        reason_codes.append(ReasonCode.TIME_MATCH)

    if energy_score == 1.0:
        reason_codes.append(ReasonCode.ENERGY_MATCH)

    if activation_score >= 0.8:
        reason_codes.append(ReasonCode.EASY_TO_START)

    if location_score == 1.0:
        reason_codes.append(ReasonCode.LOCATION_MATCH)

    if budget_score == 1.0:
        reason_codes.append(ReasonCode.BUDGET_MATCH)

    return reason_codes
