# backend/fastapi-ai/app/utils/loader.py
import os
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# IMPORTANT: from app/utils -> go up 4 levels to reach project root:
# app/utils -> app (1) -> fastapi-ai (2) -> backend (3) -> fashion-recommendation-app (4)
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/processed"))

# Expected filenames (adjust if yours differ)
METADATA_FNAME = "metadata_clean.csv"
EMBEDDINGS_FNAME = "embeddings.npy"
EMB_INDEX_FNAME = "embeddings_index.csv"
NN_INDEX_FNAME = "nn_index.pkl"
KMEANS_FNAME = "kmeans_model.pkl"

def _resolve(path: str) -> str:
    p = os.path.join(DATA_DIR, path)
    return p

def _ensure_exists(path: str):
    if not os.path.exists(path):
        raise FileNotFoundError(f"{path} not found. Ensure preprocessing outputs are in {DATA_DIR}")

def load_metadata(metadata_filename: str = METADATA_FNAME) -> pd.DataFrame:
    logger.info(f"DATA_DIR resolved to: {DATA_DIR}")
    path = _resolve(metadata_filename)
    _ensure_exists(path)
    # Use pandas read_csv with python engine for robustness
    df = pd.read_csv(path, dtype=str, engine="python", on_bad_lines="skip")
    df.fillna("", inplace=True)
    logger.info(f"Loaded metadata: {path} ({len(df)} rows)")
    return df

def load_embeddings(emb_filename: str = EMBEDDINGS_FNAME) -> np.ndarray:
    path = _resolve(emb_filename)
    _ensure_exists(path)
    embs = np.load(path)
    logger.info(f"Loaded embeddings: {path} shape={embs.shape}")
    return embs

def load_index_map(index_csv: str = EMB_INDEX_FNAME) -> pd.DataFrame:
    path = _resolve(index_csv)
    _ensure_exists(path)
    idx_df = pd.read_csv(path, dtype=str, engine="python", on_bad_lines="skip")
    idx_df.reset_index(drop=True, inplace=True)
    logger.info(f"Loaded embeddings index map: {path} ({len(idx_df)} rows)")
    return idx_df

def load_nn_index(nn_filename: str = NN_INDEX_FNAME):
    path = _resolve(nn_filename)
    if not os.path.exists(path):
        logger.warning(f"NN index file not found at {path}; returning None")
        return None
    nn = joblib.load(path)
    logger.info(f"Loaded NN index: {path}")
    return nn

def load_kmeans(kmeans_filename: str = KMEANS_FNAME):
    path = _resolve(kmeans_filename)
    if not os.path.exists(path):
        logger.warning(f"KMeans model file not found at {path}; returning None")
        return None
    k = joblib.load(path)
    logger.info(f"Loaded KMeans model: {path}")
    return k

def build_text_matrix(metadata_df: pd.DataFrame):
    """
    Build a TF-IDF matrix from textual metadata fields.
    Returns (vectorizer, tfidf_matrix).
    This function is intentionally lightweight in case the
    dataset is large — adjust vectorizer params as needed.
    """
    from sklearn.feature_extraction.text import TfidfVectorizer

    # pick text columns (object dtype)
    text_cols = [c for c in metadata_df.columns if metadata_df[c].dtype == object or metadata_df[c].dtype == "string"]
    if not text_cols:
        # fallback: all columns
        text_cols = list(metadata_df.columns)

    combined = metadata_df[text_cols].astype(str).agg(" ".join, axis=1)
    vectorizer = TfidfVectorizer(max_features=20000, ngram_range=(1, 2))
    tfidf = vectorizer.fit_transform(combined)
    logger.info(f"Built TF-IDF matrix: shape={tfidf.shape}")
    return vectorizer, tfidf
