"""
Vercel Python serverless function: POST /api/predict

Loads the trained crop-recommendation pipeline (model.pkl, bundled next
to this file) once per warm instance, and returns ranked crop matches
for the land/soil details submitted from the farmer forms.

Expected JSON body (all optional except noted; sensible defaults are
used for anything missing so the endpoint never hard-fails on a
partial form submission):

{
  "land_area_acres": 4,            # number
  "soil_type": "Loamy",            # Sandy | Clay | Loamy
  "soil_ph": 6.8,                  # number
  "water_source": "Canal",         # Rainfed | Canal | Borewell
  "irrigation_availability": "Available",  # Available | Limited
  "season": "Kharif",              # Summer | Rabi | Kharif
  "investment_budget": "Medium",   # Low | Medium | High
  "resource_intensity": "Low Input",  # Low Input | High Input | Fertilizer Usage
  "previous_crop": "Wheat",        # Rice | Wheat | Millet | Maize | Cotton | Groundnut
  "current_crop": "Wheat",         # same set as previous_crop
  "soil_health_score": 80          # number, 0-100
}

Response:
{
  "predictions": [
    {"crop": "Millet", "match_percentage": 61.4},
    {"crop": "Sunflower", "match_percentage": 22.1},
    {"crop": "Cotton", "match_percentage": 9.8}
  ]
}
"""

import json
import os
from http.server import BaseHTTPRequestHandler

import joblib
import pandas as pd

_MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
_bundle = joblib.load(_MODEL_PATH)
_pipeline = _bundle["pipeline"]
_numeric_features = _bundle["numeric_features"]
_categorical_features = _bundle["categorical_features"]

_DEFAULTS = {
    "land_area_acres": 3,
    "soil_type": "Loamy",
    "soil_ph": 6.8,
    "water_source": "Rainfed",
    "irrigation_availability": "Available",
    "season": "Kharif",
    "investment_budget": "Medium",
    "resource_intensity": "Low Input",
    "previous_crop": "Wheat",
    "current_crop": "Wheat",
    "soil_health_score": 70,
}

_TOP_N = 3


def _predict(payload: dict) -> dict:
    row = {**_DEFAULTS, **{k: v for k, v in payload.items() if v is not None}}
    columns = _numeric_features + _categorical_features
    X = pd.DataFrame([[row[c] for c in columns]], columns=columns)

    probs = _pipeline.predict_proba(X)[0]
    classes = _pipeline.classes_

    ranked = sorted(zip(classes, probs), key=lambda p: float(p[1]), reverse=True)[:_TOP_N]
    total = float(sum(float(p) for _, p in ranked)) or 1.0

    return {
        "predictions": [
            {"crop": str(crop), "match_percentage": round(float(p) / total * 100, 1)}
            for crop, p in ranked
        ]
    }


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, body: dict):
        payload = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self._send_json(200, {"status": "ok", "message": "POST land details to this endpoint."})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw or b"{}")
            if not isinstance(payload, dict):
                raise ValueError("Request body must be a JSON object")
            result = _predict(payload)
            self._send_json(200, result)
        except Exception as exc:  # noqa: BLE001 - return the error to the client for now
            self._send_json(400, {"error": str(exc)})
