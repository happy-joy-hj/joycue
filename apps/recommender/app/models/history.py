from pydantic import BaseModel, ConfigDict, Field


class RecommendationHistoryItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    activity_id: str = Field(min_length=1)
    sessions_ago: int = Field(ge=1)
