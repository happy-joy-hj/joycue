from pydantic import BaseModel, ConfigDict, Field
from app.explanations.reason_codes import ReasonCode


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
