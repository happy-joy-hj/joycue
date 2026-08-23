from app.models.activity import Activity
from app.models.context import RecommendationContext
from app.models.recommendation import RankedActivity, ScoreBreakdown
from app.models.interest import Interest
from app.models.history import RecommendationHistoryItem
from app.scoring.activation_score import score_activation
from app.scoring.budget_score import score_budget
from app.scoring.energy_score import score_energy
from app.scoring.location_score import score_location
from app.scoring.time_score import score_time
from app.scoring.interest_score import score_interest
from app.scoring.repetition_penalty import (
    calculate_repetition_penalty,
)
from app.ranking.candidate_filter import filter_candidates
from app.explanations.reason_codes import build_reason_codes


SCORE_WEIGHTS = {
    "time": 0.25,
    "energy": 0.25,
    "activation": 0.20,
    "location": 0.20,
    "budget": 0.10,
}
PERSONALIZED_SCORE_WEIGHTS = {
    "time": 0.20,
    "energy": 0.20,
    "activation": 0.20,
    "location": 0.15,
    "budget": 0.10,
    "interest": 0.15,
}


def score_activity(
    activity: Activity,
    context: RecommendationContext,
    interests: list[Interest] | None = None,
    history: list[RecommendationHistoryItem] | None = None,
) -> RankedActivity:
    selected_interests = interests or []
    recent_history = history or []

    interest_score = (
        score_interest(
            activity.tags,
            selected_interests,
        )
        if selected_interests
        else None
    )

    breakdown = ScoreBreakdown(
        time=score_time(
            activity.time_min,
            activity.time_max,
            context.time,
        ),
        energy=score_energy(
            activity.energy_required,
            context.energy,
        ),
        activation=score_activation(
            activity.activation_effort,
        ),
        location=score_location(
            activity.location_type,
            context.location,
        ),
        budget=score_budget(
            activity.cost_min,
            activity.cost_max,
            context.budget,
        ),
        interest=interest_score,
    )

    if selected_interests:
        weighted_score = (
            breakdown.time
            * PERSONALIZED_SCORE_WEIGHTS["time"]
            + breakdown.energy
            * PERSONALIZED_SCORE_WEIGHTS["energy"]
            + breakdown.activation
            * PERSONALIZED_SCORE_WEIGHTS["activation"]
            + breakdown.location
            * PERSONALIZED_SCORE_WEIGHTS["location"]
            + breakdown.budget
            * PERSONALIZED_SCORE_WEIGHTS["budget"]
            + interest_score
            * PERSONALIZED_SCORE_WEIGHTS["interest"]
        )
    else:
        weighted_score = (
            breakdown.time * SCORE_WEIGHTS["time"]
            + breakdown.energy * SCORE_WEIGHTS["energy"]
            + breakdown.activation * SCORE_WEIGHTS["activation"]
            + breakdown.location * SCORE_WEIGHTS["location"]
            + breakdown.budget * SCORE_WEIGHTS["budget"]
        )

    raw_score = round(
        weighted_score * 100,
        2,
    )

    repetition_penalty = (
        calculate_repetition_penalty(
            activity.id,
            recent_history,
        )
    )

    final_score = round(
        max(
            raw_score - repetition_penalty,
            0.0,
        ),
        2,
    )

    reason_codes = build_reason_codes(
        time_score=breakdown.time,
        energy_score=breakdown.energy,
        activation_score=breakdown.activation,
        location_score=breakdown.location,
        budget_score=breakdown.budget,
        interest_score=breakdown.interest,
    )

    return RankedActivity(
        activity_id=activity.id,
        raw_score=raw_score,
        repetition_penalty=repetition_penalty,
        final_score=final_score,
        score_breakdown=breakdown,
        reason_codes=reason_codes,
    )


def rank_activities(
    activities: list[Activity],
    context: RecommendationContext,
    interests: list[Interest] | None = None,
    history: list[RecommendationHistoryItem] | None = None,
) -> list[RankedActivity]:
    eligible_activities = filter_candidates(
        activities,
        context,
    )

    ranked = [
        score_activity(
            activity,
            context,
            interests,
            history,
        )
        for activity in eligible_activities
    ]

    return sorted(
        ranked,
        key=lambda result: (
            -result.final_score,
            -result.raw_score,
            result.activity_id,
        ),
    )
