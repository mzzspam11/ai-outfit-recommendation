#!/usr/bin/env python3
"""
preprocess_dataset.py

Robust preprocessing for the "fashion-product-images-small" Kaggle dataset.

What it does:
- Loads metadata (styles.csv) robustly (skips badly tokenized rows but logs them).
- Resolves image filenames using:
    * an 'image' / 'image_name' column if present,
    * images.csv mapping if present,
    * or by searching images/ for <id>.<ext> or files that contain the id.
- Validates images, converts to RGB, resizes to TARGET_SIZE (224x224) and creates THUMBNAILS (128x128).
- Writes a cleaned metadata CSV with new fields 'image_path' and 'thumb_path'.
- Writes `bad_rows.csv` logging rows skipped and reasons.
- Keeps a summarized log printed at the end.

Usage (from project root):
    python3 data/scripts/preprocess_dataset.py

You can also run with custom paths:
    python3 data/scripts/preprocess_dataset.py --raw data/raw --out data/processed

"""

from pathlib import Path
import argparse
import csv
import sys
import logging
from PIL import Image, ImageFile
import pandas as pd
from tqdm import tqdm
import shutil
import traceback
import glob

ImageFile.LOAD_TRUNCATED_IMAGES = True

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

def robust_read_csv(path: Path):
    """
    Read CSV robustly: try best-effort parses, skipping bad lines and logging problems.
    Returns dataframe and list of skipped line info (if any).
    """
    skipped = []
    # Try utf-8 then latin1 fallback
    for enc in ("utf-8", "latin1"):
        try:
            df = pd.read_csv(
                path,
                encoding=enc,
                engine="python",           # python engine is more tolerant
                on_bad_lines="skip",       # skip broken rows
                dtype=str,                 # read everything as strings (avoid dtype issues)
                quoting=csv.QUOTE_MINIMAL
            )
            logging.info(f"Loaded metadata {path} with encoding={enc}, shape={df.shape}")
            return df, skipped
        except Exception as e:
            logging.warning(f"Failed to read {path} with encoding={enc}: {e}")
            last_exc = e
    # If both fail, raise the last exception
    raise last_exc

def build_image_map_from_images_csv(images_csv: Path):
    """
    If dataset provides an images.csv mapping, build dict: id -> filename
    Expect images.csv has columns like 'id' and 'image_name' or similar.
    """
    mapping = {}
    if not images_csv.exists():
        return mapping
    try:
        df_images = pd.read_csv(images_csv, dtype=str, engine="python", on_bad_lines="skip")
        # try several likely column names
        id_cols = [c for c in df_images.columns if "id" in c.lower()]
        name_cols = [c for c in df_images.columns if "image" in c.lower() or "file" in c.lower()]
        if id_cols and name_cols:
            id_col = id_cols[0]
            name_col = name_cols[0]
            for _, r in df_images.iterrows():
                mapping[r[id_col]] = r[name_col]
            logging.info(f"Built image map from {images_csv} using columns ({id_col}, {name_col})")
        else:
            logging.info(f"images.csv found but could not auto-detect id/image columns: {df_images.columns.tolist()}")
    except Exception as e:
        logging.warning(f"Failed to read images.csv: {e}")
    return mapping

def find_image_file_by_id(images_dir: Path, id_str: str, images_map: dict = None):
    """
    Try multiple strategies to find an image file for a given id string:
    1) If images_map provided and contains id_str => use that filename
    2) Try <id>.<ext> where ext in jpg,jpeg,png
    3) Glob search for files that contain the id_str
    4) Return None if not found
    """
    if images_map and id_str in images_map and images_map[id_str]:
        candidate = images_dir / images_map[id_str]
        if candidate.exists():
            return candidate

    # direct name patterns
    for ext in (".jpg", ".jpeg", ".png", ".webp"):
        p = images_dir / f"{id_str}{ext}"
        if p.exists():
            return p

    # sometimes filenames include prefix/suffix; search for files that contain the id substring
    pattern1 = str(images_dir / f"*{id_str}*")
    matches = glob.glob(pattern1)
    if matches:
        # prefer jpg/jpeg/png
        for m in matches:
            if m.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                return Path(m)
        return Path(matches[0])

    return None

def preprocess(
    raw_dir: Path,
    out_dir: Path,
    target_size=(224,224),
    thumb_size=(128,128),
    metadata_filename="styles.csv",
    images_csv_name="images.csv",
):
    raw_dir = raw_dir.resolve()
    out_dir = out_dir.resolve()
    processed_images_dir = out_dir / "images"
    thumbs_dir = out_dir / "thumbs"
    processed_images_dir.mkdir(parents=True, exist_ok=True)
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    out_dir.mkdir(parents=True, exist_ok=True)

    metadata_raw = raw_dir / metadata_filename
    if not metadata_raw.exists():
        raise FileNotFoundError(f"{metadata_raw} not found. Check raw dataset folder.")

    # read metadata robustly
    df, skipped_info = robust_read_csv(metadata_raw)
    # standardize column names to lowercase stripped
    df.columns = [c.strip() for c in df.columns]

    # load images.csv map if present
    images_map = build_image_map_from_images_csv(raw_dir / images_csv_name)

    # detect candidate id column names
    id_col = None
    for candidate in ("id", "product_id", "image_id", "pid"):
        if candidate in df.columns:
            id_col = candidate
            break
    # if not found, try first numeric-like column
    if id_col is None:
        for c in df.columns:
            sample = df[c].dropna().astype(str).iloc[0] if not df[c].dropna().empty else ""
            if sample.isdigit():
                id_col = c
                break

    if id_col is None:
        # fallback: try the first column
        id_col = df.columns[0]
        logging.warning(f"Could not auto-detect id column; using first column '{id_col}'")

    logging.info(f"Using id column: '{id_col}'")

    valid_rows = []
    bad_rows = []
    total = len(df)
    logging.info(f"Processing {total} metadata rows...")

    for idx, row in tqdm(df.iterrows(), total=total):
        try:
            raw_id = row.get(id_col, "")
            if pd.isna(raw_id) or str(raw_id).strip() == "":
                bad_rows.append({**row.to_dict(), "__reason": "missing_id"})
                continue
            id_str = str(int(float(raw_id))) if str(raw_id).replace('.','',1).isdigit() else str(raw_id).strip()

            # If metadata has explicit image filename column, try to use it
            possible_image_cols = [c for c in df.columns if "image" in c.lower() or "img" in c.lower() or "file" in c.lower()]
            img_path = None
            for c in possible_image_cols:
                val = row.get(c)
                if pd.notna(val) and str(val).strip() != "":
                    candidate = raw_dir / "images" / str(val)
                    if candidate.exists():
                        img_path = candidate
                        break

            # otherwise find by id
            if img_path is None:
                img_path = find_image_file_by_id(raw_dir / "images", id_str, images_map)

            if img_path is None:
                bad_rows.append({**row.to_dict(), "__reason": "no_image_found"})
                continue

            # Open and process image
            try:
                with Image.open(img_path) as im:
                    im = im.convert("RGB")
                    im_proc = im.resize(target_size, Image.LANCZOS)
                    proc_filename = f"{id_str}.jpg"
                    proc_path = processed_images_dir / proc_filename
                    im_proc.save(proc_path, quality=90)

                    thumb = im.resize(thumb_size, Image.LANCZOS)
                    thumb_path = thumbs_dir / proc_filename
                    thumb.save(thumb_path, quality=85)

                    out_row = row.to_dict()
                    # store relative paths (relative to project root)
                    out_row['image_path'] = str(proc_path.relative_to(Path.cwd()))
                    out_row['thumb_path'] = str(thumb_path.relative_to(Path.cwd()))
                    valid_rows.append(out_row)
            except Exception as e_img:
                bad_rows.append({**row.to_dict(), "__reason": f"image_read_error: {e_img}"})
                continue

        except Exception as e:
            # catch-all for unexpected errors per-row
            trace = traceback.format_exc()
            bad_rows.append({**row.to_dict(), "__reason": f"unexpected_error: {e}", "__trace": trace})
            continue

    # Save cleaned metadata and bad rows
    metadata_clean_csv = out_dir / "metadata_clean.csv"
    bad_rows_csv = out_dir / "bad_rows.csv"
    if valid_rows:
        pd.DataFrame(valid_rows).to_csv(metadata_clean_csv, index=False)
        logging.info(f"Saved cleaned metadata: {metadata_clean_csv} ({len(valid_rows)} rows)")
    else:
        logging.warning("No valid rows processed; cleaned metadata not created.")

    if bad_rows:
        pd.DataFrame(bad_rows).to_csv(bad_rows_csv, index=False)
        logging.info(f"Saved bad rows log: {bad_rows_csv} ({len(bad_rows)} rows)")

    logging.info("Preprocessing complete.")
    logging.info(f"Valid items: {len(valid_rows)} | Bad/skipped items: {len(bad_rows)}")

    return {
        "valid_count": len(valid_rows),
        "bad_count": len(bad_rows),
        "metadata_clean_csv": str(metadata_clean_csv) if valid_rows else None,
        "bad_rows_csv": str(bad_rows_csv) if bad_rows else None,
        "images_dir": str(processed_images_dir),
        "thumbs_dir": str(thumbs_dir),
    }

def parse_args():
    p = argparse.ArgumentParser(description="Preprocess Fashion Product Images dataset")
    p.add_argument("--raw", default="data/raw", help="raw dataset directory (contains styles.csv and images/)")
    p.add_argument("--out", default="data/processed", help="output processed directory")
    p.add_argument("--target-size", nargs=2, type=int, default=(224,224), help="target image size (W H)")
    p.add_argument("--thumb-size", nargs=2, type=int, default=(128,128), help="thumbnail size (W H)")
    p.add_argument("--metadata-filename", default="styles.csv", help="metadata CSV filename in raw dir")
    p.add_argument("--images-csv", default="images.csv", help="images CSV mapping filename (optional)")
    return p.parse_args()

if __name__ == "__main__":
    args = parse_args()
    raw_dir = Path(args.raw)
    out_dir = Path(args.out)

    logging.info(f"RAW dir: {raw_dir.resolve()}")
    logging.info(f"OUT dir: {out_dir.resolve()}")

    result = preprocess(
        raw_dir=raw_dir,
        out_dir=out_dir,
        target_size=tuple(args.target_size),
        thumb_size=tuple(args.thumb_size),
        metadata_filename=args.metadata_filename,
        images_csv_name=args.images_csv,
    )

    logging.info("Result summary:")
    for k,v in result.items():
        logging.info(f"  {k}: {v}")
