# backend/fastapi-ai/app/models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Any

class SimilarItem(BaseModel):
    id: str
    image_path: str
    score: float
    metadata: Optional[dict] = None

class SimilarResponse(BaseModel):
    query_id: str
    results: List[SimilarItem]

class QuizRequest(BaseModel):
    answers: List[str] = Field(..., description="List of quiz answer texts")
    gender: Optional[str] = Field(None, description="Optional: 'Male' or 'Female' or 'Other'")
    top_k: Optional[int] = Field(10, description="Number of results to return")

class QuizResponse(BaseModel):
    results: List[SimilarItem]
    used_text_candidates: int
    used_visual_candidates: int
