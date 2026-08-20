from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ActivityCategory(str, Enum):
    REST = "REST"
    MOVEMENT = "MOVEMENT"
    AWARENESS = "AWARENESS"
    HOME = "HOME"
    FUN = "FUN"
    SOCIAL = "SOCIAL"
    LEARNING = "LEARNING"
    CAREER = "CAREER"
    CREATIVE = "CREATIVE"
    EXPLORATION = "EXPLORATION"


class EffortLevel(str, Enum):
    VERY_LOW = "VERY_LOW"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class LocationType(str, Enum):
    STAY_IN = "STAY_IN"
    GO_OUT = "GO_OUT"
    EITHER = "EITHER"


class EnvironmentType(str, Enum):
    QUIET = "QUIET"
    FLEXIBLE = "FLEXIBLE"
    LIVELY = "LIVELY"


class SocialMode(str, Enum):
    SOLO = "SOLO"
    WITH_OTHERS = "WITH_OTHERS"
    EITHER = "EITHER"


class ScreenMode(str, Enum):
    SCREEN_FREE = "SCREEN_FREE"
    SCREEN_OPTIONAL = "SCREEN_OPTIONAL"
    SCREEN_REQUIRED = "SCREEN_REQUIRED"


class Activity(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)

    title: str = Field(min_length=1)
    description: str | None = None
    first_step: str = Field(min_length=1)
    plan_steps: list[str] | None = None

    category: ActivityCategory
    tags: list[str] = Field(default_factory=list)

    time_min: int | None = Field(default=None, ge=1)
    time_max: int | None = Field(default=None, ge=1)

    energy_required: EffortLevel | None = None
    activation_effort: EffortLevel | None = None
    mental_effort: EffortLevel | None = None
    physical_effort: EffortLevel | None = None

    location_type: LocationType | None = None
    environment: EnvironmentType | None = None
    social_mode: SocialMode | None = None
    screen_mode: ScreenMode | None = None

    cost_min: float | None = Field(default=None, ge=0)
    cost_max: float | None = Field(default=None, ge=0)

    @model_validator(mode="after")
    def validate_ranges(self):
        if (
            self.time_min is not None
            and self.time_max is not None
            and self.time_max < self.time_min
        ):
            raise ValueError(
                "time_max must be greater than or equal to time_min"
            )

        if (
            self.cost_min is not None
            and self.cost_max is not None
            and self.cost_max < self.cost_min
        ):
            raise ValueError(
                "cost_max must be greater than or equal to cost_min"
            )

        return self
