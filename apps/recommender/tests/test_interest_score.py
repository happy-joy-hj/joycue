from app.models.interest import Interest
from app.scoring.interest_score import score_interest


def test_no_interests_returns_zero():
    assert (
        score_interest(
            ["movement", "outdoors"],
            [],
        )
        == 0.0
    )


def test_no_matching_interest_returns_zero():
    assert (
        score_interest(
            ["movement", "outdoors"],
            [Interest.CAREER],
        )
        == 0.0
    )


def test_single_selected_interest_full_match():
    assert (
        score_interest(
            ["movement", "outdoors"],
            [Interest.MOVEMENT],
        )
        == 1.0
    )


def test_one_of_multiple_interests_is_partial_match():
    assert (
        score_interest(
            ["movement", "outdoors"],
            [
                Interest.MOVEMENT,
                Interest.EXPLORATION,
            ],
        )
        == 0.5
    )


def test_two_matching_interests_is_full_match():
    assert (
        score_interest(
            [
                "movement",
                "outdoors",
                "exploration",
            ],
            [
                Interest.MOVEMENT,
                Interest.EXPLORATION,
            ],
        )
        == 1.0
    )


def test_more_than_two_selected_interests_does_not_dilute_score():
    assert (
        score_interest(
            [
                "movement",
                "exploration",
            ],
            [
                Interest.MOVEMENT,
                Interest.EXPLORATION,
                Interest.FUN,
                Interest.LEARNING,
            ],
        )
        == 1.0
    )


def test_duplicate_activity_tags_do_not_inflate_score():
    assert (
        score_interest(
            [
                "movement",
                "movement",
                "outdoors",
            ],
            [
                Interest.MOVEMENT,
                Interest.EXPLORATION,
            ],
        )
        == 0.5
    )
