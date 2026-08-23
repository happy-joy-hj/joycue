from pydantic import BaseModel, ConfigDict, Field
from app.explanations.reason_codes import ReasonCode
from app.models.activity import Activity
from app.models.context import RecommendationContext
from app.models.interest import Interest
from app.models.history import RecommendationHistoryItem


class ScoreBreakdown(BaseModel):
    model_config = ConfigDict(extra="forbid")

    time: float = Field(ge=0, le=1)
    energy: float = Field(ge=0, le=1)
    activation: float = Field(ge=0, le=1)
    location: float = Field(ge=0, le=1)
    budget: float = Field(ge=0, le=1)
    interest: float | None = Field(default=None, ge=0, le=1)


class RankedActivity(BaseModel):
    model_config = ConfigDict(extra="forbid")

    activity_id: str = Field(min_length=1)
    raw_score: float = Field(ge=0, le=100)
    repetition_penalty: float = Field(ge=0, le=100)
    final_score: float = Field(ge=0, le=100)
    score_breakdown: ScoreBreakdown
    reason_codes: list[ReasonCode] = Field(default_factory=list)

class RecommendRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    context: RecommendationContext
    interests: list[Interest] = Field(default_factory=list)
    history: list[RecommendationHistoryItem] = Field(
        default_factory=list
    )
    candidates: list[Activity] = Field(min_length=1)
    limit: int = Field(default=3, ge=1, le=10)


class RecommendResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommendations: list[RankedActivity]
