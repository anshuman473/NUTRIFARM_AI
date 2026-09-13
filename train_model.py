"""
Train a crop recommendation model for NutriFarm AI.

Reads crop_dataset_v2.csv, trains a RandomForestClassifier to predict
`recommended_crop` from land/soil/farming-practice features, and saves
the fitted pipeline (preprocessing + model) to model.pkl so it can be
loaded directly by the Flask API at inference time.
"""

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

DATA_PATH = "crop_dataset_v2.csv"
MODEL_PATH = "model.pkl"

NUMERIC_FEATURES = ["land_area_acres", "soil_ph", "soil_health_score"]
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
TARGET = "recommended_crop"


def main():
    df = pd.read_csv(DATA_PATH)

    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
        ]
    )

    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_leaf=40,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])

    print("Training model on", len(X_train), "rows...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTest accuracy: {acc:.4f}\n")
    print(classification_report(y_test, y_pred))

    joblib.dump(
        {
            "pipeline": pipeline,
            "numeric_features": NUMERIC_FEATURES,
            "categorical_features": CATEGORICAL_FEATURES,
            "classes": list(pipeline.classes_) if hasattr(pipeline, "classes_") else list(model.classes_),
        },
        MODEL_PATH,
        compress=3,
    )
    print(f"Saved trained pipeline to {MODEL_PATH}")


if __name__ == "__main__":
    main()
