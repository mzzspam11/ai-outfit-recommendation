import os
import pandas as pd
from typing import Tuple

def load_styles_csv(data_root: str) -> pd.DataFrame:
    styles_path = os.path.join(data_root, 'styles.csv')
    if not os.path.exists(styles_path):
        raise FileNotFoundError(f"styles.csv not found at {styles_path}")
    df = pd.read_csv(styles_path, on_bad_lines='skip')
    # Normalize column names
    rename = { 'id':'id', 'gender':'gender', 'masterCategory':'masterCategory',
               'subCategory':'subCategory', 'articleType':'articleType',
               'baseColour':'baseColour', 'season':'season', 'year':'year',
               'usage':'usage', 'productDisplayName':'productDisplayName' }
    df = df.rename(columns=rename)
    # Image path mapping: images/<id>.jpg
    df['image_path'] = df['id'].apply(lambda x: os.path.join(data_root, 'images', f'{x}.jpg'))
    df['has_image'] = df['image_path'].apply(os.path.exists)
    # Basic cleaning
    df = df.dropna(subset=['id', 'productDisplayName'])
    return df

def filter_by_gender(df: pd.DataFrame, gender: str) -> pd.DataFrame:
    g = 'Men' if gender.lower() == 'male' else 'Women'
    return df[df['gender'].str.lower().str.contains(g.lower(), na=False)]
