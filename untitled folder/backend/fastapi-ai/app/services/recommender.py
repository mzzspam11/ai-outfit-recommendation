# backend/fastapi-ai/app/services/recommender.py
from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import cdist
import logging

from ..utils import loader

logger = logging.getLogger(__name__)

# Global placeholders (will be set in init)
EMBS = None             # numpy array (N x D)
IDX_DF = None           # dataframe with 'id' and 'image_path' and metadata
NN = None               # sklearn NearestNeighbors object (optional)
KMEANS = None
VECTORIZER = None
TFIDF_MATRIX = None

def init(resources: Dict[str, Any]):
    global EMBS, IDX_DF, NN, KMEANS, VECTORIZER, TFIDF_MATRIX
    EMBS = resources.get("embeddings")
    IDX_DF = resources.get("index_df")
    NN = resources.get("nn")
    KMEANS = resources.get("kmeans")
    VECTORIZER = resources.get("vectorizer")
    TFIDF_MATRIX = resources.get("tfidf")

def recommend_similar(product_id: str, top_k: int = 10) -> List[Dict[str, Any]]:
    """
    Return top_k visually similar items to the product_id.
    """
    if IDX_DF is None or EMBS is None:
        raise RuntimeError("Recommender not initialized with embeddings/index")

    # find index of product_id
    matches = IDX_DF[IDX_DF['id'].astype(str) == str(product_id)]
    if matches.empty:
        return []

    idx = int(matches.index[0])
    emb = EMBS[idx:idx+1]

    # if NN index available, use it (sklearn NearestNeighbors)
    if NN is not None:
        distances, indices = NN.kneighbors(emb, n_neighbors=min(top_k+1, EMBS.shape[0]))
        results = []
        for d, i in zip(distances[0], indices[0]):
            pid = str(IDX_DF.iloc[i]['id'])
            if pid == str(product_id):
                continue
            results.append({
                "id": pid,
                "image_path": IDX_DF.iloc[i].get("image_path", ""),
                "score": float(1 - d)  # sklearn returns distance depending on metric; we use (1 - distance) as score
            })
            if len(results) >= top_k:
                break
        return results
    else:
        # fallback: compute cosine similarity brute-force
        sims = cosine_similarity(EMBS, emb).reshape(-1)
        # get top indices
        order = np.argsort(-sims)  # descending
        results = []
        for i in order:
            pid = str(IDX_DF.iloc[i]['id'])
            if pid == str(product_id):
                continue
            results.append({
                "id": pid,
                "image_path": IDX_DF.iloc[i].get("image_path", ""),
                "score": float(sims[i])
            })
            if len(results) >= top_k:
                break
        return results

def recommend_by_quiz(answers: List[str], gender: Optional[str] = None, top_k: int = 10) -> Dict[str, Any]:
    """
    Strategy:
     1) Use TF-IDF vectorizer to find top text-matching candidates.
     2) From these candidates, use image embeddings to find visually close items (NN).
     3) Return top_k ranked by combined score.
    """
    # Step 0: basic sanity
    if TFIDF_MATRIX is None or VECTORIZER is None:
        # no text model — fallback to returning top visual cluster centers or random
        logger.warning("No text vectorizer available; falling back to visual-only recommendations.")
        # Return top_k items from a random seed or cluster (simple)
        ids = IDX_DF['id'].astype(str).tolist()
        picks = ids[:top_k]
        return {"results": [{"id": pid, "image_path": IDX_DF[IDX_DF['id'].astype(str) == pid].iloc[0].get("image_path",""), "score": 0.0} for pid in picks],
                "used_text_candidates": 0, "used_visual_candidates": len(picks)}

    query_text = " ".join([a for a in answers if isinstance(a, str)])
    q_vec = VECTORIZER.transform([query_text])  # shape (1, V)

    # compute cosine similarity between q_vec and TFIDF_MATRIX
    text_sim = (TFIDF_MATRIX @ q_vec.T).toarray().reshape(-1)  # dot product approximates similarity
    # get top M text candidates (more than top_k to give visual re-ranking)
    M = max(200, top_k * 20)
    candidate_idxs = np.argsort(-text_sim)[:M]
    candidate_ids = IDX_DF.iloc[candidate_idxs]['id'].astype(str).tolist()

    # If gender filtering requested and metadata has gender-like column, filter candidates
    if gender:
        gender_cols = [c for c in IDX_DF.columns if 'gender' in c.lower() or 'usage' in c.lower()]
        if gender_cols:
            keep = []
            for ci in candidate_idxs:
                row = IDX_DF.iloc[ci]
                # basic match: if any gender column contains the requested gender string
                if any(str(row.get(gc,"")).lower().find(gender.lower()) != -1 for gc in gender_cols):
                    keep.append(ci)
            if keep:
                candidate_idxs = keep
                candidate_ids = IDX_DF.iloc[candidate_idxs]['id'].astype(str).tolist()

    # Visual re-ranking: compute similarity of candidate embeddings to a "query embedding"
    # Option 1: compute average embedding of top text candidates and find neighbors
    emb_candidates = EMBS[candidate_idxs]
    query_emb = emb_candidates.mean(axis=0, keepdims=True)
    # Use NN to get final ordering among full index (or among candidates only)
    # We'll compute cosine similarity between query_emb and candidate embeddings
    sims = cosine_similarity(emb_candidates, query_emb).reshape(-1)
    # combine text_sim (normalized) and visual sims with weights
    tnorm = (text_sim[candidate_idxs] - text_sim[candidate_idxs].min())
    if tnorm.max() > 0:
        tnorm = tnorm / tnorm.max()
    vnorm = (sims - sims.min())
    if vnorm.max() > 0:
        vnorm = vnorm / vnorm.max()
    alpha = 0.45  # weight for text, 0.55 for visual (tune later)
    combined = alpha * tnorm + (1 - alpha) * vnorm
    order = np.argsort(-combined)

    results = []
    for oi in order[:top_k]:
        idx_global = candidate_idxs[oi]
        pid = str(IDX_DF.iloc[idx_global]['id'])
        results.append({
            "id": pid,
            "image_path": IDX_DF.iloc[idx_global].get("image_path", ""),
            "score": float(combined[oi]),
            "metadata": IDX_DF.iloc[idx_global].to_dict()
        })

    return {"results": results, "used_text_candidates": len(candidate_idxs), "used_visual_candidates": len(results)}
