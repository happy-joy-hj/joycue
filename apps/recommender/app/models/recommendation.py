from pydantic import BaseModel, ConfigDict, Field
from app.explanations.reason_codes import ReasonCode
from app.models.activity import Activity
from app.models.context import RecommendationContext


class ScoreBreakdown(BaseModel):
    model_config = ConfigDict(extra="forbid")

    time: float = Field(ge=0, le=1)
    energy: float = Field(ge=0, le=1)
    activation: float = Field(ge=0, le=1)
    location: float = Field(ge=0, le=1)
    budget: float = Field(ge=0, le=1)


class RankedActivity(BaseModel):
    model_config = ConfigDict(extra="forbid")

    activity_id: str = Field(min_length=1)
    raw_score: float = Field(ge=0, le=100)
    score_breakdown: ScoreBreakdown
    reason_codes: list[ReasonCode] = Field(default_factory=list)

class RecommendRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    context: RecommendationContext
    candidates: list[Activity] = Field(min_length=1)
    limit: int = Field(default=3, ge=1, le=10)


class RecommendResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommendations: list[RankedActivity]
