# backend/fastapi-ai/app/main.py
from pathlib import Path
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routes import recommend  # relative import

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

app = FastAPI(title="Fashion Recommendation API (FastAPI)")

# CORS - allow everything for development; lock this down in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change to your frontend origin(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve the path to the processed images folder.
# app -> fastapi-ai -> backend -> fashion-recommendation-app (project root)
PROJECT_ROOT = Path(__file__).resolve().parents[3]
IMAGES_DIR = PROJECT_ROOT / "data" / "processed" / "images"

if IMAGES_DIR.exists():
    # mount static files at /static/images
    app.mount("/static/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")
    logger.info(f"Mounted static images directory at /static/images -> {IMAGES_DIR}")
else:
    logger.warning(f"Images directory not found, static mount skipped: {IMAGES_DIR}")

# include recommendation routes
app.include_router(recommend.router, prefix="/api/recommend", tags=["recommend"])


@app.get("/", tags=["root"])
def root():
    return {"status": "ok", "service": "fashion-recommendation-ai"}


def image_url_for(request: Request, image_filename: str) -> str:
    """
    Helper to produce a full URL for a mounted static image.
    Usage in a route: image_url = image_url_for(request, "12345.jpg")
    This will return something like: "http://localhost:8002/static/images/12345.jpg"
    """
    # If static mount exists, use url_for to build a correct path
    try:
        return request.url_for("images", path=image_filename)
    except Exception:
        # Fallback: build manually relative to base_url
        base = str(request.base_url).rstrip("/")
        return f"{base}/static/images/{image_filename}"
