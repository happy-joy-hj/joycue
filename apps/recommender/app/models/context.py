from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.activity import EffortLevel, LocationType


class TimePreference(str, Enum):
    UNDER_10_MIN = "UNDER_10_MIN"
    AROUND_15_MIN = "AROUND_15_MIN"
    AROUND_30_MIN = "AROUND_30_MIN"
    AROUND_60_MIN = "AROUND_60_MIN"
    ANY = "ANY"


class BudgetPreference(str, Enum):
    FREE = "FREE"
    LOW_COST = "LOW_COST"
    ANY = "ANY"


class RecommendationContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    time: TimePreference
    energy: EffortLevel
    location: LocationType
    budget: BudgetPreference

    text: str | None = Field(default=None, max_length=500)

    @field_validator("text")
    @classmethod
    def normalize_text(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        return value or None
