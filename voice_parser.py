"""
NutriFarm AI — Voice Transcript Field Extraction
------------------------------------------------------
Takes the free-text transcript already produced client-side by the browser's
Web Speech API (land-details.html) and pulls out structured land-details
fields using keyword/regex matching. Deliberately NOT an LLM call — this
needs to work with zero external dependency, zero API key, and zero network
risk during a live demo, and the extracted values are always shown back to
the farmer in the actual form fields so they can correct any misparse
before submitting.

If you later want sharper extraction (e.g. handling more natural phrasing,
multiple Indian languages beyond keyword coverage), swap parse_transcript's
body for a call to an LLM with a structured-output prompt — the function
signature and return shape can stay identical.
"""

import re

VALID_CROPS = ["Wheat", "Rice", "Maize", "Cotton", "Groundnut", "Millet"]

SOIL_KEYWORDS = {
    "Loamy": ["loamy", "loam"],
    "Clay": ["clay", "clayey", "black soil", "black cotton"],
    "Sandy": ["sandy", "sand", "red soil"],
}
WATER_KEYWORDS = {
    "Canal": ["canal"],
    "Borewell": ["borewell", "bore well", "tube well", "tubewell"],
    "Pond": ["pond", "tank"],
    "Rainfed": ["rainfed", "rain fed", "rain-fed", "no irrigation", "only rain"],
}
IRRIGATION_KEYWORDS = {
    "No": ["no irrigation", "rainfed only", "not irrigated", "no water available"],
    "Partial": ["partial irrigation", "sometimes irrigate", "limited water", "partly irrigated"],
    "Yes": ["full irrigation", "always irrigate", "canal water available", "well irrigated", "good irrigation"],
}
SEASON_KEYWORDS = {
    "Kharif": ["kharif", "monsoon"],
    "Rabi": ["rabi", "winter season"],
    "Zaid": ["zaid", "summer season", "summer crop"],
}
INVESTMENT_KEYWORDS = {
    "low": ["low budget", "limited money", "low capacity", "less investment", "cannot afford much"],
    "high": ["high budget", "good investment", "high capacity", "can invest a lot"],
}
FERTILIZER_KEYWORDS = {
    "organic": ["organic", "natural fertilizer", "no chemical", "cow dung", "compost"],
    "chemical": ["chemical fertilizer", "urea", "dap fertilizer", "pesticide"],
}
LAND_AREA_RE = re.compile(r"(\d+(?:\.\d+)?)\s*(acre|acres|bigha|bighas|hectare|hectares)")
WORD_NUMBERS = {
    "half": 0.5, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
    "twenty": 20,
}
LAND_AREA_WORD_RE = re.compile(
    r"(" + "|".join(WORD_NUMBERS.keys()) + r")\s*(acre|acres|bigha|bighas|hectare|hectares)"
)
PH_RE = re.compile(r"(?:ph|p\.?h\.?)\D{0,20}?(\d(?:\.\d)?)")
CROP_PREV_HINT = ["last season", "previous season", "last year", "earlier", "before this"]
CROP_CURR_HINT = ["this season", "this year", "currently", "now growing", "right now"]


def _find_keyword(text: str, keyword_map: dict):
    for value, keywords in keyword_map.items():
        for kw in keywords:
            if kw in text:
                return value
    return None


def _find_crops(text: str):
    """Best-effort: look for known crop names near 'last season'/'this season'
    style hints; fall back to first-mention-is-previous, second-is-current."""
    text_l = text.lower()
    mentions = []
    for crop in VALID_CROPS:
        idx = text_l.find(crop.lower())
        if idx != -1:
            mentions.append((idx, crop))
    mentions.sort()

    prev_crop, curr_crop = None, None
    for idx, crop in mentions:
        window = text_l[max(0, idx - 30):idx]
        if any(h in window for h in CROP_PREV_HINT) and prev_crop is None:
            prev_crop = crop
        elif any(h in window for h in CROP_CURR_HINT) and curr_crop is None:
            curr_crop = crop

    # Fall back to positional guess if hint words weren't found
    remaining = [c for _, c in mentions if c not in (prev_crop, curr_crop)]
    if prev_crop is None and remaining:
        prev_crop = remaining.pop(0)
    if curr_crop is None and remaining:
        curr_crop = remaining.pop(0)

    return prev_crop, curr_crop


def parse_transcript(transcript: str) -> dict:
    text = (transcript or "").strip().lower()
    if not text:
        return {"matched_fields": [], "raw_transcript": transcript or ""}

    result = {}

    soil = _find_keyword(text, SOIL_KEYWORDS)
    if soil:
        result["soilType"] = soil

    water = _find_keyword(text, WATER_KEYWORDS)
    if water:
        result["waterSource"] = water

    irrigation = _find_keyword(text, IRRIGATION_KEYWORDS)
    if irrigation:
        result["irrigationAvail"] = irrigation
    elif water and water != "Rainfed":
        # A named water source with no explicit irrigation statement implies availability
        result["irrigationAvail"] = "Yes"

    season = _find_keyword(text, SEASON_KEYWORDS)
    if season:
        result["season"] = season

    investment = _find_keyword(text, INVESTMENT_KEYWORDS)
    if investment:
        result["investment"] = investment

    fertilizer_hit = _find_keyword(text, FERTILIZER_KEYWORDS)
    if fertilizer_hit:
        result["fertilizer"] = fertilizer_hit if fertilizer_hit != "chemical" else "chemical"
    if "mixed" in text or ("organic" in text and "chemical" in text):
        result["fertilizer"] = "mixed"

    ph_match = PH_RE.search(text)
    if ph_match:
        try:
            ph_val = float(ph_match.group(1))
            if 3.0 <= ph_val <= 10.0:
                result["soilPH"] = ph_val
        except ValueError:
            pass

    area_match = LAND_AREA_RE.search(text)
    if area_match:
        try:
            result["landArea"] = float(area_match.group(1))
        except ValueError:
            pass
    else:
        word_match = LAND_AREA_WORD_RE.search(text)
        if word_match:
            result["landArea"] = WORD_NUMBERS[word_match.group(1)]

    prev_crop, curr_crop = _find_crops(text)
    if prev_crop:
        result["prevCrop"] = prev_crop
    if curr_crop:
        result["currCrop"] = curr_crop

    result["matched_fields"] = list(result.keys())
    result["raw_transcript"] = transcript
    return result
