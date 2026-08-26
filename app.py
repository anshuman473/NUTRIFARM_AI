"""
NutriFarm AI — Flask Backend
--------------------------------
Serves the existing static frontend (index.html, farmer-*, person-*, etc.)
and exposes two APIs:

  POST /predict_crop     -> ML crop recommendation (RandomForest)
  POST /recommend_thali  -> rule-based nutrition/meal recommendation

Run:
    python app.py
Then open http://localhost:5000
"""

import os

import joblib
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = BASE_DIR
MODEL_PATH = os.path.join(BASE_DIR, "crop_model.pkl")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

# ------------------------------------------------------------------
# Load the trained crop model once at startup
# ------------------------------------------------------------------
_bundle = joblib.load(MODEL_PATH)
PIPELINE = _bundle["pipeline"]
CAT_FEATURES = _bundle["categorical_features"]
NUM_FEATURES = _bundle["numeric_features"]
CLASSES = _bundle["classes"]

VALID_CROPS = ["Wheat", "Rice", "Maize", "Cotton", "Groundnut", "Millet"]

# ------------------------------------------------------------------
# Normalisation: the frontend forms (land-details.html) use their own
# value vocab, which doesn't always match the dataset's category space.
# These maps translate raw form values into what the model was trained on.
# ------------------------------------------------------------------
WATER_SOURCE_MAP = {"Rainfed": "Rainfed", "Borewell": "Borewell", "Canal": "Canal", "Pond": "Canal"}
IRRIGATION_MAP = {"Yes": "Available", "Partial": "Limited", "No": "Limited",
                   "Available": "Available", "Limited": "Limited"}
SEASON_MAP = {"Kharif": "Kharif", "Rabi": "Rabi", "Zaid": "Summer", "Summer": "Summer"}
BUDGET_MAP = {"low": "Low", "medium": "Medium", "high": "High",
              "Low": "Low", "Medium": "Medium", "High": "High"}
# Frontend collects "fertilizer type" (organic/chemical/mixed); the model
# was trained on "resource_intensity" (Low/Fertilizer Usage/High Input) —
# related but not identical concepts, mapped by intensity of external input.
FERTILIZER_TO_INTENSITY = {
    "organic": "Low Input",
    "mixed": "Fertilizer Usage",
    "chemical": "High Input",
}


def normalize_crop_name(raw: str) -> str:
    """Best-effort match of free-text prev/curr crop input to a known crop."""
    if not raw:
        return "Wheat"
    raw_l = raw.strip().lower()
    for crop in VALID_CROPS:
        if crop.lower() == raw_l or crop.lower() in raw_l:
            return crop
    return "Wheat"  # neutral fallback


def compute_soil_health_score(ph: float) -> int:
    """Heuristic soil-health score: 6.0-7.0 pH is the optimal band for most
    of these crops; scores drop off outside it."""
    if 6.0 <= ph <= 7.0:
        return 85
    return 65


@app.route("/predict_crop", methods=["POST"])
def predict_crop():
    data = request.get_json(force=True, silent=True) or {}

    try:
        land_area = float(data.get("landArea", 1))
        soil_ph = float(data.get("soilPH", 6.5))
    except (TypeError, ValueError):
        return jsonify({"error": "landArea and soilPH must be numbers"}), 400

    soil_type = data.get("soilType", "Loamy")
    water_source = WATER_SOURCE_MAP.get(data.get("waterSource", "Rainfed"), "Rainfed")
    irrigation = IRRIGATION_MAP.get(data.get("irrigationAvail", "Available"), "Available")
    season = SEASON_MAP.get(data.get("season", "Kharif"), "Kharif")
    budget = BUDGET_MAP.get(data.get("investment", "Medium"), "Medium")
    intensity = FERTILIZER_TO_INTENSITY.get(data.get("fertilizer", "mixed"), "Fertilizer Usage")
    prev_crop = normalize_crop_name(data.get("prevCrop", ""))
    curr_crop = normalize_crop_name(data.get("currCrop", ""))

    if soil_type not in ["Clay", "Loamy", "Sandy"]:
        soil_type = "Loamy"

    health_score = compute_soil_health_score(soil_ph)

    row = pd.DataFrame([{
        "soil_type": soil_type,
        "water_source": water_source,
        "irrigation_availability": irrigation,
        "season": season,
        "investment_budget": budget,
        "resource_intensity": intensity,
        "previous_crop": prev_crop,
        "current_crop": curr_crop,
        "land_area_acres": land_area,
        "soil_ph": soil_ph,
        "soil_health_score": health_score,
    }])[CAT_FEATURES + NUM_FEATURES]

    proba = PIPELINE.predict_proba(row)[0]
    ranked = sorted(zip(PIPELINE.classes_, proba), key=lambda x: -x[1])
    top3 = [{"crop": crop, "match_percentage": round(float(p) * 100, 1)} for crop, p in ranked[:3]]

    return jsonify({
        "recommended_crop": top3[0]["crop"],
        "match_percentage": top3[0]["match_percentage"],
        "top_matches": top3,
        "soil_health_score": health_score,
        "inputs_used": {
            "soil_type": soil_type, "water_source": water_source,
            "irrigation_availability": irrigation, "season": season,
            "investment_budget": budget, "resource_intensity": intensity,
            "previous_crop": prev_crop, "current_crop": curr_crop,
            "land_area_acres": land_area, "soil_ph": soil_ph,
        },
    })


# ------------------------------------------------------------------
# Rule-based Thali / nutrition recommendation
# ------------------------------------------------------------------
CONDITION_RULES = {
    "diabetes": {
        "avoid": ["white rice", "sugar-heavy sweets", "refined flour (maida)"],
        "favor": ["millets (ragi/jowar/bajra)", "leafy greens", "whole moong dal", "bitter gourd"],
        "note": "Low glycemic-index grains and high fibre help manage blood sugar spikes.",
    },
    "hypertension": {
        "avoid": ["extra salt/pickles", "papad", "processed snacks"],
        "favor": ["banana", "spinach", "low-sodium dal", "curd (unsalted)"],
        "note": "Reducing sodium and adding potassium-rich foods supports healthy blood pressure.",
    },
    "anemia": {
        "avoid": ["tea/coffee immediately with meals (inhibits iron absorption)"],
        "favor": ["spinach/leafy greens", "jaggery", "ragi", "beetroot", "moong/chana dal"],
        "note": "Iron-rich foods paired with vitamin C (lemon, amla) improve absorption.",
    },
    "thyroid": {
        "avoid": ["excess raw cruciferous veg (cabbage/cauliflower) in large amounts"],
        "favor": ["iodised salt in moderation", "nuts", "dairy", "whole grains"],
        "note": "Balanced iodine and selenium intake supports thyroid function.",
    },
    "none": {"avoid": [], "favor": ["a balanced regional thali"], "note": "No specific medical restriction identified."},
}

REGIONAL_STAPLES = {
    "North Indian": {"grain": "Wheat roti", "dal": "Dal Makhani / Moong Dal", "veg": "Seasonal sabzi", "extra": "Curd"},
    "South Indian": {"grain": "Rice / Ragi mudde", "dal": "Sambar", "veg": "Poriyal (stir-fry veg)", "extra": "Buttermilk"},
    "Local": {"grain": "Millet roti (Bajra/Jowar)", "dal": "Local dal preparation", "veg": "Indigenous seasonal greens", "extra": "Local fermented side"},
}

LIFE_STAGE_NOTES = {
    "pregnancy": "Add extra folate (leafy greens), iron, and calcium (dairy/ragi).",
    "lactation": "Increase overall calorie and fluid intake; include galactagogue foods like fenugreek and garlic.",
    "standard": None,
}


@app.route("/recommend_thali", methods=["POST"])
def recommend_thali():
    data = request.get_json(force=True, silent=True) or {}

    condition = (data.get("healthCondition") or "none").lower()
    allergies_raw = (data.get("allergies") or "").lower()
    allergies = [a.strip() for a in allergies_raw.split(",") if a.strip()]
    food_pref = data.get("foodPreference", "veg")
    meal_type = data.get("mealType", "North Indian")
    if meal_type not in REGIONAL_STAPLES:
        meal_type = "Local"
    life_stage = data.get("lifeStage", "standard")

    rules = CONDITION_RULES.get(condition, CONDITION_RULES["none"])
    staple = dict(REGIONAL_STAPLES[meal_type])

    if food_pref == "non-veg":
        staple["protein"] = "Lean meat/fish/egg curry (in moderation)"
    else:
        staple["protein"] = "Paneer / extra dal / sprouts"

    # Remove/flag anything the person is allergic to (simple substring match)
    warnings = []
    for item_key, item_val in list(staple.items()):
        for allergen in allergies:
            if allergen and allergen in item_val.lower():
                warnings.append(f"{item_val} contains a flagged allergen ({allergen}) — substitute recommended.")

    favor_items = list(rules["favor"])
    avoid_items = list(rules["avoid"])

    stage_note = LIFE_STAGE_NOTES.get(life_stage)

    thali_plan = {
        "grain": staple["grain"],
        "dal_or_curry": staple["dal"],
        "vegetable": staple["veg"],
        "protein": staple["protein"],
        "side": staple["extra"],
    }

    return jsonify({
        "region_style": meal_type,
        "thali_plan": thali_plan,
        "health_condition": condition,
        "favor_foods": favor_items,
        "avoid_foods": avoid_items,
        "health_note": rules["note"],
        "life_stage_note": stage_note,
        "allergy_warnings": warnings,
        "budget_tier": data.get("budgetPref", "medium"),
    })


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "model_classes": CLASSES})


# ------------------------------------------------------------------
# Serve the existing static frontend from the repo root
# ------------------------------------------------------------------
@app.route("/")
def serve_index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)


if __name__ == "__main__":
    app.run(debug=False, port=5000)
