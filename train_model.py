"""
NutriFarm AI — Crop Recommendation Model Training
---------------------------------------------------
Trains a RandomForestClassifier on full_synthetic_crop_prediction_dataset.csv
to predict `recommended_crop` from farm/soil/season inputs, and saves a
single deployable scikit-learn Pipeline (preprocessing + model) to
backend/model/crop_model.pkl.

Run:
    python train_model.py
"""

import os
import time
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "crop_dataset_v2.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "crop_model.pkl")

CATEGORICAL_FEATURES = [
    "soil_type",
    "water_source",
    "irrigation_availability",
    "season",
    "investment_budget",
    "resource_intensity",
    "previous_crop",
    "current_crop",
]
NUMERIC_FEATURES = ["land_area_acres", "soil_ph", "soil_health_score"]
TARGET = "recommended_crop"


def load_data() -> pd.DataFrame:
    print(f"Loading dataset from {DATA_PATH} ...")
    df = pd.read_csv(DATA_PATH)
    print(f"  {len(df):,} rows, {len(df.columns)} columns")
    assert df.isna().sum().sum() == 0, "Unexpected missing values in dataset"
    return df


def build_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ("num", "passthrough", NUMERIC_FEATURES),
        ]
    )
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=9,
        min_samples_leaf=20,
        n_jobs=-1,
        random_state=42,
        class_weight="balanced_subsample",
    )
    return Pipeline(steps=[("preprocess", preprocessor), ("model", model)])


def main() -> None:
    df = load_data()

    X = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Dataset is a large low-cardinality synthetic set (7 classes, 8 categorical
    # features). Cap training rows for a fast, memory-safe fit without losing
    # meaningful signal — stratified so class balance is preserved.
    MAX_TRAIN_ROWS = 120_000
    if len(X_train) > MAX_TRAIN_ROWS:
        X_train, _, y_train, _ = train_test_split(
            X_train, y_train,
            train_size=MAX_TRAIN_ROWS,
            random_state=42,
            stratify=y_train,
        )
    print(f"Train: {len(X_train):,} rows | Test: {len(X_test):,} rows")

    pipeline = build_pipeline()

    print("Training RandomForestClassifier ...")
    t0 = time.time()
    pipeline.fit(X_train, y_train)
    print(f"  done in {time.time() - t0:.1f}s")

    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTest accuracy: {acc:.4f}\n")
    print(classification_report(y_test, y_pred))

    # Feature importance (post one-hot) for a quick sanity check
    ohe = pipeline.named_steps["preprocess"].named_transformers_["cat"]
    feature_names = list(ohe.get_feature_names_out(CATEGORICAL_FEATURES)) + NUMERIC_FEATURES
    importances = pipeline.named_steps["model"].feature_importances_
    top = sorted(zip(feature_names, importances), key=lambda x: -x[1])[:10]
    print("Top 10 features:")
    for name, score in top:
        print(f"  {name:35s} {score:.4f}")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(
        {
            "pipeline": pipeline,
            "categorical_features": CATEGORICAL_FEATURES,
            "numeric_features": NUMERIC_FEATURES,
            "classes": sorted(y.unique().tolist()),
            "trained_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "test_accuracy": acc,
        },
        MODEL_PATH,
        compress=3,
    )
    size_mb = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    print(f"\nSaved model -> {MODEL_PATH} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
