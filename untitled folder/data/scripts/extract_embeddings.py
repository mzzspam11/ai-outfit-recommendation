#!/usr/bin/env python3
"""
extract_embeddings.py
- Loads processed images and metadata_clean.csv
- Uses pretrained ResNet50 (no top FC) to extract 2048-d embeddings
- Saves embeddings as numpy file and a CSV mapping (id -> embedding index)
Outputs:
- data/processed/embeddings.npy
- data/processed/embeddings_index.csv
"""

import torch
import torchvision.transforms as T
from torchvision import models
from PIL import Image
import numpy as np
import pandas as pd
from pathlib import Path
from tqdm import tqdm

ROOT = Path(__file__).resolve().parent.parent
PROCESSED = ROOT / "processed"
METADATA_CLEAN = PROCESSED / "metadata_clean.csv"
IMAGES_DIR = PROCESSED / "images"
EMB_PATH = PROCESSED / "embeddings.npy"
IDX_CSV = PROCESSED / "embeddings_index.csv"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# Load data
df = pd.read_csv(METADATA_CLEAN)
image_ids = df['id'].tolist()

# Create model
model = models.resnet50(pretrained=True)
# remove final fully connected layer
model = torch.nn.Sequential(*list(model.children())[:-1])
model.eval().to(device)

transform = T.Compose([
    T.Resize((224,224)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]),
])

embs = []
meta_rows = []
with torch.no_grad():
    for rid in tqdm(image_ids):
        img_path = IMAGES_DIR / f"{rid}.jpg"
        try:
            im = Image.open(img_path).convert('RGB')
            x = transform(im).unsqueeze(0).to(device)
            feat = model(x)  # shape [1, 2048, 1, 1]
            feat = feat.view(feat.size(0), -1).cpu().numpy()  # [1,2048]
            embs.append(feat[0])
            meta_rows.append({'id': rid, 'image_path': str(img_path)})
        except Exception as e:
            print("failed on", img_path, e)

embs = np.vstack(embs)
print("emb shape", embs.shape)
np.save(EMB_PATH, embs)
pd.DataFrame(meta_rows).to_csv(IDX_CSV, index=False)
print("Saved:", EMB_PATH, IDX_CSV)
