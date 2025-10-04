import numpy as np
import cv2
from typing import Tuple
from PIL import Image
import tensorflow as tf

# Build a MobileNetV2 feature extractor
_mobilenet = None
_preprocess = tf.keras.applications.mobilenet_v2.preprocess_input

def _load_model():
    global _mobilenet
    if _mobilenet is None:
        base = tf.keras.applications.MobileNetV2(include_top=False, pooling='avg', weights='imagenet')
        _mobilenet = base
    return _mobilenet

def compute_image_embedding(image_path: str) -> np.ndarray:
    try:
        model = _load_model()
        img = Image.open(image_path).convert('RGB').resize((224, 224))
        x = np.array(img, dtype=np.float32)
        x = _preprocess(x)
        x = np.expand_dims(x, axis=0)
        feat = model(x).numpy().squeeze()
        return feat.astype(np.float32)
    except Exception:
        # If image fails, return zeros to avoid breaking pipeline
        return np.zeros((1280,), dtype=np.float32)

def compute_color_hist(image_path: str, bins: int = 16) -> np.ndarray:
    try:
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        hist = cv2.calcHist([img], [0,1,2], None, [bins,bins,bins], [0,180,0,256,0,256])
        hist = cv2.normalize(hist, hist).flatten()
        return hist.astype(np.float32)
    except Exception:
        return np.zeros((bins*bins*bins,), dtype=np.float32)
