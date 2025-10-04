import os, json, pickle

def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)

def save_pickle(obj, path: str):
    ensure_dir(os.path.dirname(path))
    with open(path, 'wb') as f:
        pickle.dump(obj, f)

def load_pickle(path: str):
    with open(path, 'rb') as f:
        return pickle.load(f)
