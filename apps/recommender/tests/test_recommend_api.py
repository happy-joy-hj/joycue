import json
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


REPO_ROOT = Path(__file__).resolve().parents[3]
STARTER_ACTIVITIES_PATH = REPO_ROOT / "data" / "starter_activities.json"

client = TestClient(app)


def make_candidate(
    activity_id: str,
    *,
    energy: str = "LOW",
    activation: str = "VERY_LOW",
    location: str = "STAY_IN",
    time_min: int = 5,
    time_max: int = 10,
    cost_min: float = 0,
    cost_max: float = 0,
) -> dict:
    return {
        "id": activity_id,
        "title": f"Activity {activity_id}",
        "first_step": "Start.",
        "category": "FUN",
        "time_min": time_min,
        "time_max": time_max,
        "energy_required": energy,
        "activation_effort": activation,
        "location_type": location,
        "cost_min": cost_min,
        "cost_max": cost_max,
    }


def make_context() -> dict:
    return {
        "time": "UNDER_10_MIN",
        "energy": "VERY_LOW",
        "location": "STAY_IN",
        "budget": "FREE",
    }


def test_recommend_returns_ranked_recommendations():
    response = client.post(
        "/v1/recommend",
        json={
            "context": make_context(),
            "candidates": [
                make_candidate(
                    "lower_match",
                    energy="MEDIUM",
                    activation="HIGH",
                ),
                make_candidate(
                    "best_match",
                    energy="VERY_LOW",
                ),
            ],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["recommendations"][0]["activity_id"] == "best_match"
    assert data["recommendations"][0]["raw_score"] == 100.0


def test_recommend_defaults_to_three_results():
    candidates = [
        make_candidate(f"activity_{index}")
        for index in range(5)
    ]

    response = client.post(
        "/v1/recommend",
        json={
            "context": make_context(),
            "candidates": candidates,
        },
    )

    assert response.status_code == 200
    assert len(response.json()["recommendations"]) == 3


def test_recommend_respects_requested_limit():
    candidates = [
        make_candidate(f"activity_{index}")
        for index in range(5)
    ]

    response = client.post(
        "/v1/recommend",
        json={
            "context": make_context(),
            "candidates": candidates,
            "limit": 2,
        },
    )

    assert response.status_code == 200
    assert len(response.json()["recommendations"]) == 2


def test_recommend_excludes_hard_constraint_violations():
    response = client.post(
        "/v1/recommend",
        json={
            "context": make_context(),
            "candidates": [
                make_candidate(
                    "valid",
                    energy="VERY_LOW",
                ),
                make_candidate(
                    "go_out",
                    location="GO_OUT",
                ),
                make_candidate(
                    "paid",
                    cost_min=5,
                    cost_max=20,
                ),
            ],
        },
    )

    assert response.status_code == 200

    recommendation_ids = [
        recommendation["activity_id"]
        for recommendation in response.json()["recommendations"]
    ]

    assert recommendation_ids == ["valid"]


def test_recommend_rejects_empty_candidate_list():
    response = client.post(
        "/v1/recommend",
        json={
            "context": make_context(),
            "candidates": [],
        },
    )

    assert response.status_code == 422

def test_recommend_ranks_real_starter_activities():
    with STARTER_ACTIVITIES_PATH.open(encoding="utf-8") as file:
        candidates = json.load(file)

    response = client.post(
        "/v1/recommend",
        json={
            "context": {
                "time": "AROUND_30_MIN",
                "energy": "MEDIUM",
                "location": "GO_OUT",
                "budget": "LOW_COST",
            },
            "candidates": candidates,
            "limit": 3,
        },
    )

    assert response.status_code == 200

    recommendations = response.json()["recommendations"]

    assert [
        recommendation["activity_id"]
        for recommendation in recommendations
    ] == [
        "act_006",
        "act_019",
        "act_020",
    ]

    assert recommendations[0]["raw_score"] == 96.0

    assert recommendations[0]["reason_codes"] == [
        "TIME_MATCH",
        "ENERGY_MATCH",
        "EASY_TO_START",
        "LOCATION_MATCH",
        "BUDGET_MATCH",
    ]

def test_recommend_uses_selected_interests():
    response = client.post(
        "/v1/recommend",
        json={
            "context": {
                "time": "ANY",
                "energy": "HIGH",
                "location": "EITHER",
                "budget": "ANY",
            },
            "interests": [
                "MOVEMENT",
            ],
            "candidates": [
                {
                    **make_candidate(
                        "activity_a",
                    ),
                    "tags": ["home"],
                },
                {
                    **make_candidate(
                        "activity_b",
                    ),
                    "tags": ["movement"],
                },
            ],
        },
    )

    assert response.status_code == 200

    recommendations = response.json()[
        "recommendations"
    ]

    assert (
        recommendations[0]["activity_id"]
        == "activity_b"
    )
    assert (
        recommendations[0]["score_breakdown"][
            "interest"
        ]
        == 1.0
    )
    assert (
        "INTEREST_MATCH"
        in recommendations[0]["reason_codes"]
    )

def test_recommend_applies_recent_history_penalty():
    response = client.post(
        "/v1/recommend",
        json={
            "context": {
                "time": "ANY",
                "energy": "HIGH",
                "location": "EITHER",
                "budget": "ANY",
            },
            "history": [
                {
                    "activity_id": "activity_a",
                    "sessions_ago": 1,
                },
            ],
            "candidates": [
                make_candidate("activity_a"),
                make_candidate("activity_b"),
            ],
        },
    )

    assert response.status_code == 200

    recommendations = response.json()[
        "recommendations"
    ]

    assert (
        recommendations[0]["activity_id"]
        == "activity_b"
    )

    activity_a = next(
        recommendation
        for recommendation in recommendations
        if recommendation["activity_id"]
        == "activity_a"
    )

    assert activity_a["repetition_penalty"] == 15.0
    assert (
        activity_a["final_score"]
        == activity_a["raw_score"] - 15.0
    )
