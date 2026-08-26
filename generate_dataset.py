"""
NutriFarm AI — Realistic Crop-Recommendation Dataset Generator
------------------------------------------------------------------
The original full_synthetic_crop_prediction_dataset.csv has NO learnable
relationship between farm inputs and `recommended_crop` (verified: every
input combination shows a perfectly uniform ~14.3% = 1/7 label share,
i.e. the label was assigned at random). A model trained on it can't beat
random guessing, no matter the algorithm.

This script generates a new dataset from real agronomic profiles for the
same 7 crops, so `recommended_crop` is an actual function of soil pH,
soil type, water source, irrigation, season, and input intensity —
with realistic noise so it isn't trivially separable either.

Run:
    python generate_dataset.py
"""

import os
import random

import numpy as np
import pandas as pd

random.seed(42)
np.random.seed(42)

N_ROWS = 150_000

SOIL_TYPES = ["Clay", "Loamy", "Sandy"]
WATER_SOURCES = ["Rainfed", "Canal", "Borewell"]
IRRIGATION = ["Available", "Limited"]
SEASONS = ["Kharif", "Rabi", "Summer"]
BUDGETS = ["Low", "Medium", "High"]
INTENSITY = ["Low Input", "Fertilizer Usage", "High Input"]
CROPS = ["Wheat", "Rice", "Maize", "Cotton", "Groundnut", "Millet"]

# Agronomic profile per recommended crop: ideal pH range, preferred soil
# types, water needs, best seasons, and typical input intensity. Ranges are
# approximate real-world figures used for scoring, not literal thresholds.
CROP_PROFILES = {
    "Basmati Rice": {
        "ph_range": (5.5, 7.0),
        "soil_type": {"Clay": 1.0, "Loamy": 0.8, "Sandy": 0.2},
        "water_need": "high",
        "season": {"Kharif": 1.0, "Rabi": 0.2, "Summer": 0.1},
        "intensity": {"High Input": 1.0, "Fertilizer Usage": 0.7, "Low Input": 0.3},
    },
    "Cotton": {
        "ph_range": (6.0, 7.5),
        "soil_type": {"Clay": 0.9, "Loamy": 0.8, "Sandy": 0.3},
        "water_need": "medium",
        "season": {"Kharif": 1.0, "Rabi": 0.1, "Summer": 0.2},
        "intensity": {"High Input": 1.0, "Fertilizer Usage": 0.8, "Low Input": 0.2},
    },
    "Green Gram (Moong)": {
        "ph_range": (6.2, 7.2),
        "soil_type": {"Loamy": 1.0, "Sandy": 0.8, "Clay": 0.3},
        "water_need": "low",
        "season": {"Kharif": 0.7, "Summer": 1.0, "Rabi": 0.2},
        "intensity": {"Low Input": 1.0, "Fertilizer Usage": 0.6, "High Input": 0.2},
    },
    "Groundnut": {
        "ph_range": (6.0, 7.0),
        "soil_type": {"Sandy": 1.0, "Loamy": 0.8, "Clay": 0.2},
        "water_need": "medium",
        "season": {"Kharif": 1.0, "Rabi": 0.2, "Summer": 0.4},
        "intensity": {"Fertilizer Usage": 1.0, "Low Input": 0.6, "High Input": 0.6},
    },
    "Millet": {
        "ph_range": (5.5, 7.5),
        "soil_type": {"Sandy": 1.0, "Loamy": 0.7, "Clay": 0.3},
        "water_need": "low",
        "season": {"Kharif": 0.9, "Rabi": 0.6, "Summer": 0.3},
        "intensity": {"Low Input": 1.0, "Fertilizer Usage": 0.5, "High Input": 0.2},
    },
    "Mustard": {
        "ph_range": (6.0, 7.5),
        "soil_type": {"Loamy": 1.0, "Clay": 0.6, "Sandy": 0.4},
        "water_need": "low",
        "season": {"Rabi": 1.0, "Kharif": 0.1, "Summer": 0.1},
        "intensity": {"Low Input": 0.9, "Fertilizer Usage": 1.0, "High Input": 0.5},
    },
    "Sunflower": {
        "ph_range": (6.0, 7.5),
        "soil_type": {"Loamy": 1.0, "Sandy": 0.7, "Clay": 0.4},
        "water_need": "medium",
        "season": {"Rabi": 0.8, "Summer": 1.0, "Kharif": 0.3},
        "intensity": {"Fertilizer Usage": 1.0, "High Input": 0.7, "Low Input": 0.4},
    },
}

WATER_NEED_SCORE = {
    # (water_need, water_source, irrigation_availability) -> fit score 0..1
    "high": {("Canal", "Available"): 1.0, ("Borewell", "Available"): 0.9,
             ("Canal", "Limited"): 0.5, ("Borewell", "Limited"): 0.4,
             ("Rainfed", "Available"): 0.4, ("Rainfed", "Limited"): 0.15},
    "medium": {("Canal", "Available"): 0.9, ("Borewell", "Available"): 0.9,
               ("Canal", "Limited"): 0.7, ("Borewell", "Limited"): 0.6,
               ("Rainfed", "Available"): 0.6, ("Rainfed", "Limited"): 0.4},
    "low": {("Canal", "Available"): 0.7, ("Borewell", "Available"): 0.7,
            ("Canal", "Limited"): 0.8, ("Borewell", "Limited"): 0.8,
            ("Rainfed", "Available"): 0.9, ("Rainfed", "Limited"): 0.85},
}


def ph_fit(ph: float, ph_range: tuple[float, float]) -> float:
    lo, hi = ph_range
    if lo <= ph <= hi:
        return 1.0
    dist = (lo - ph) if ph < lo else (ph - hi)
    return max(0.0, 1.0 - dist / 1.5)


def soil_health_score(ph: float, rng: np.random.Generator) -> int:
    base = 85 if 6.0 <= ph <= 7.0 else 65
    return int(np.clip(base + rng.normal(0, 6), 40, 98))


def score_crop(profile: dict, ph: float, soil_type: str, water_source: str,
                irrigation: str, season: str, intensity: str) -> float:
    s = ph_fit(ph, profile["ph_range"])
    s += profile["soil_type"].get(soil_type, 0.3)
    s += WATER_NEED_SCORE[profile["water_need"]][(water_source, irrigation)]
    s += profile["season"].get(season, 0.1)
    s += profile["intensity"].get(intensity, 0.3) * 0.5
    return s


def generate(n_rows: int = N_ROWS) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    rows = []
    crop_names = list(CROP_PROFILES.keys())

    for _ in range(n_rows):
        land_area = int(rng.integers(1, 11))
        soil_type = random.choice(SOIL_TYPES)
        soil_ph = round(float(rng.uniform(5.5, 7.5)), 1)
        water_source = random.choice(WATER_SOURCES)
        irrigation = random.choice(IRRIGATION)
        season = random.choice(SEASONS)
        budget = random.choice(BUDGETS)
        intensity = random.choice(INTENSITY)
        prev_crop = random.choice(CROPS)
        curr_crop = random.choice(CROPS)
        health = soil_health_score(soil_ph, rng)

        scores = {
            crop: score_crop(profile, soil_ph, soil_type, water_source, irrigation, season, intensity)
            + rng.normal(0, 0.35)  # realistic noise so it's not trivially separable
            for crop, profile in CROP_PROFILES.items()
        }
        best_crop = max(scores, key=scores.get)
        # Normalise scores to a 70-98 "match percentage" for the top pick
        max_possible = 3.5
        match_pct = int(np.clip(70 + (scores[best_crop] / max_possible) * 28, 70, 98))

        rows.append([
            land_area, soil_type, soil_ph, water_source, irrigation, season,
            budget, intensity, prev_crop, curr_crop, health, best_crop, match_pct,
        ])

    return pd.DataFrame(rows, columns=[
        "land_area_acres", "soil_type", "soil_ph", "water_source",
        "irrigation_availability", "season", "investment_budget",
        "resource_intensity", "previous_crop", "current_crop",
        "soil_health_score", "recommended_crop", "match_percentage",
    ])


def main():
    df = generate()
    out_path = os.path.join(os.path.dirname(__file__), "crop_dataset_v2.csv")
    df.to_csv(out_path, index=False)
    print(f"Wrote {len(df):,} rows -> {out_path}")
    print(df["recommended_crop"].value_counts())


if __name__ == "__main__":
    main()
