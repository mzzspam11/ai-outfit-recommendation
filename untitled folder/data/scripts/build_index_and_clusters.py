#!/usr/bin/env python3
"""
build_index_and_clusters.py
- Loads embeddings.npy and builds an index (sklearn NearestNeighbors by default)
- Optionally builds a FAISS index or Annoy for production
- Runs KMeans (k configurable) and saves cluster labels
Outputs:
- data/processed/nn_index.pkl  (sklearn)
- data/processed/faiss.index  (optional)
- data/processed/cluster_labels.csv
"""

import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.neighbors import NearestNeighbors
from sklearn.cluster import KMeans
import joblib

ROOT = Path(__file__).resolve().parent.parent
PROCESSED = ROOT / "processed"
EMB_PATH = PROCESSED / "embeddings.npy"
IDX_CSV = PROCESSED / "embeddings_index.csv"

embs = np.load(EMB_PATH)
meta = pd.read_csv(IDX_CSV)

# 1) sklearn NN for development
nn = NearestNeighbors(n_neighbors=30, algorithm='auto', metric='cosine').fit(embs)
joblib.dump(nn, PROCESSED / "nn_index.pkl")
print("Saved sklearn nn index")

# 2) KMeans clustering
k = 20
kmeans = KMeans(n_clusters=k, random_state=42).fit(embs)
meta['cluster'] = kmeans.labels_
meta.to_csv(PROCESSED / "embeddings_index_with_clusters.csv", index=False)
joblib.dump(kmeans, PROCESSED / "kmeans_model.pkl")
print("Saved clusters and model")
