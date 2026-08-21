from fastapi import FastAPI

from app.api.recommend import router as recommend_router


app = FastAPI(
    title="JoyCue Recommender",
    version="0.1.0",
)

app.include_router(recommend_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
