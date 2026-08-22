import pytest

from app.models.interest import Interest


def test_interest_values_are_stable():
    assert Interest.FRIENDS.value == "FRIENDS"
    assert Interest.FUN.value == "FUN"
    assert Interest.MOVEMENT.value == "MOVEMENT"
    assert Interest.CAREER.value == "CAREER"
    assert Interest.LEARNING.value == "LEARNING"
    assert Interest.CREATIVITY.value == "CREATIVITY"
    assert Interest.EXPLORATION.value == "EXPLORATION"
    assert Interest.HOME.value == "HOME"
    assert Interest.REST.value == "REST"
    assert Interest.PERSONAL_PROJECTS.value == "PERSONAL_PROJECTS"
    assert Interest.NEW_EXPERIENCES.value == "NEW_EXPERIENCES"


def test_invalid_interest_is_rejected():
    with pytest.raises(ValueError):
        Interest("INVALID_INTEREST")
