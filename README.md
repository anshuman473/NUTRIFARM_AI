# NutriFarm AI — Backend

## What's here
- `generate_dataset.py` — builds `../crop_dataset_v2.csv`, a rule-encoded dataset
  based on real agronomic profiles (pH tolerance, water need, season fit) for 7 crops.
  **Use this instead of `full_synthetic_crop_prediction_dataset.csv`** — that original
  file's `recommended_crop` label has no relationship to any input column (verified:
  every input combination produces a uniform ~14.3%, i.e. random, label distribution).
- `train_model.py` — trains a RandomForestClassifier on `crop_dataset_v2.csv` and
  saves `model/crop_model.pkl` (~5.5MB). Test accuracy: **57%** vs a 14.3% random
  baseline (7 classes) — a real ~4x lift, with season and soil type as the top
  predictive features, matching real agronomy.
- `app.py` — Flask server. Serves the existing frontend (`index.html` etc. from the
  repo root) AND exposes:
  - `POST /predict_crop` — ML crop recommendation
  - `POST /recommend_thali` — rule-based nutrition/meal recommendation
  - `GET /health` — sanity check

## Setup

```bash
cd backend
pip install -r requirements.txt

# Only needed once, or if you want to regenerate/retrain:
python generate_dataset.py
python train_model.py

# Run the server (serves frontend + API on one origin):
python app.py
```

Open `http://localhost:5000` — this is now the single entry point for the whole
app (frontend forms will call the same-origin `/predict_crop` and
`/recommend_thali` automatically via `script.js`).

## API examples

```bash
curl -X POST http://localhost:5000/predict_crop \
  -H "Content-Type: application/json" \
  -d '{"landArea":3,"soilType":"Loamy","soilPH":6.5,"waterSource":"Canal",
       "irrigationAvail":"Yes","season":"Rabi","investment":"medium",
       "fertilizer":"mixed","prevCrop":"Wheat","currCrop":"Rice"}'

curl -X POST http://localhost:5000/recommend_thali \
  -H "Content-Type: application/json" \
  -d '{"healthCondition":"diabetes","allergies":"nuts","foodPreference":"veg",
       "mealType":"South Indian","budgetPref":"low","lifeStage":"standard"}'
```

## Known limitations (be ready to explain these if asked)
- `/recommend_thali` is rule-based, not ML — that's intentional. It's transparent,
  explainable, and correct by construction; a model trained on 4 fields with no
  labeled ground truth would be worse and unexplainable.
- `previous_crop`/`current_crop` inputs are constrained to 6 known crop names
  (dropdown in `land-details.html`) so they map cleanly to the trained model;
  they don't affect the prediction much (low feature importance) but are kept
  for future extension.
- 57% accuracy is real but not "impressive-sounding." That's honest — this is a
  7-class problem with meaningfully overlapping crop profiles (e.g. Cotton vs
  Groundnut have similar seasonal/soil needs). If asked, explain the baseline
  (14.3%) rather than the raw number in isolation.

## Deployment (quick options for a 2-day deadline)
- **Render / Railway (free tier)**: point at `backend/app.py`, add
  `requirements.txt`, set start command `python app.py` (or gunicorn for prod).
  Since Flask serves the frontend too, this is a single deployable service.
- Keep Supabase as-is for auth/DB — no changes needed there.
