from fastapi import APIRouter

from app.models.recommendation import (
    RecommendRequest,
    RecommendResponse,
)
from app.ranking.ranker import rank_activities


router = APIRouter(
    prefix="/v1",
    tags=["recommendations"],
)


@router.post(
    "/recommend",
    response_model=RecommendResponse,
)
def recommend(
    request: RecommendRequest,
) -> RecommendResponse:
    ranked = rank_activities(
        request.candidates,
        request.context,
    )

    return RecommendResponse(
        recommendations=ranked[: request.limit],
    )
