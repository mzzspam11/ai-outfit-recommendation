# backend/fastapi-ai/app/routes/recommend.py
from fastapi import APIRouter, HTTPException, Request
import logging
from pathlib import Path
from typing import List

from ..models.schemas import SimilarResponse, SimilarItem, QuizRequest, QuizResponse  # relative import
from ..services import recommender  # relative import
from ..utils import loader  # relative import

logger = logging.getLogger(__name__)
router = APIRouter()


@router.on_event("startup")
def startup_event():
    metadata_df = loader.load_metadata()
    embeddings = loader.load_embeddings()
    index_df = loader.load_index_map()
    nn = loader.load_nn_index()
    kmeans = loader.load_kmeans()
    vectorizer, tfidf = loader.build_text_matrix(metadata_df)

    resources = {
        "embeddings": embeddings,
        "index_df": index_df,
        "nn": nn,
        "kmeans": kmeans,
        "vectorizer": vectorizer,
        "tfidf": tfidf,
    }
    recommender.init(resources)
    logger.info("Recommender initialized on startup.")


def _build_image_url_safe(request: Request, local_image_path: str) -> str:
    """
    Convert a local image path (filesystem path or relative path) to a full URL.
    Uses request.url_for to reference the mounted StaticFiles with name 'images'.
    Falls back to constructing a URL from request.base_url.
    """
    try:
        filename = Path(local_image_path).name if local_image_path else ""
        if not filename:
            return ""
        # Use the mounted static files name "images" to build correct path
        try:
            return request.url_for("images", path=filename)
        except Exception:
            # url_for might fail if the mount isn't present; fallback below
            base = str(request.base_url).rstrip("/")
            return f"{base}/static/images/{filename}"
    except Exception as e:
        logger.warning(f"Failed to build image URL for {local_image_path}: {e}")
        try:
            base = str(request.base_url).rstrip("/")
            return f"{base}/static/images/{Path(local_image_path).name}"
        except Exception:
            return ""


@router.get("/similar/{product_id}", response_model=SimilarResponse)
def get_similar(product_id: str, request: Request, top_k: int = 10):
    try:
        results = recommender.recommend_similar(product_id=product_id, top_k=top_k)
        items: List[SimilarItem] = []
        for r in results:
            local_path = r.get("image_path", "") or ""
            image_url = _build_image_url_safe(request, local_path)
            items.append(
                SimilarItem(
                    id=r["id"],
                    image_path=image_url,
                    score=r.get("score", 0.0)
                )
            )
        return SimilarResponse(query_id=product_id, results=items)
    except Exception as e:
        logger.exception("Error in get_similar")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/by-quiz", response_model=QuizResponse)
def post_by_quiz(req: QuizRequest, request: Request):
    try:
        out = recommender.recommend_by_quiz(
            answers=req.answers,
            gender=req.gender,
            top_k=req.top_k or 10
        )
        items: List[SimilarItem] = []
        for r in out.get("results", []):
            local_path = r.get("image_path", "") or ""
            image_url = _build_image_url_safe(request, local_path)
            items.append(
                SimilarItem(
                    id=r["id"],
                    image_path=image_url,
                    score=r.get("score", 0.0),
                    metadata=r.get("metadata")
                )
            )
        return QuizResponse(
            results=items,
            used_text_candidates=out.get("used_text_candidates", 0),
            used_visual_candidates=out.get("used_visual_candidates", 0)
        )
    except Exception as e:
        logger.exception("Error in post_by_quiz")
        raise HTTPException(status_code=500, detail=str(e))
