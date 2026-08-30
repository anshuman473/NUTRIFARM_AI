"""
NutriFarm AI — Soil Photo Analysis (color heuristic)
------------------------------------------------------
IMPORTANT — be upfront about what this is: this is NOT a trained CNN /
deep-learning soil classifier. It's a dominant-color heuristic loosely based
on the real principle agronomists use with Munsell soil color charts — soil
color correlates with organic matter, drainage, and composition. It gives a
reasonable, explainable first guess, always shown back to the farmer in the
actual dropdown so they can correct it — same safety pattern as the voice
parser.

Upgrade path if you have time before judging: fine-tune a small image
classifier (e.g. MobileNet) on a labeled Indian-soil-types image dataset, or
call a vision-capable LLM API for a genuine visual read. Both are drop-in
replacements for analyze_soil_photo's body — the return shape can stay the
same.
"""

import base64
import colorsys
import io

from PIL import Image


def _decode_image(image_b64: str) -> Image.Image:
    if "," in image_b64 and image_b64.strip().startswith("data:"):
        image_b64 = image_b64.split(",", 1)[1]
    raw = base64.b64decode(image_b64)
    return Image.open(io.BytesIO(raw)).convert("RGB")


def _dominant_color(img: Image.Image, sample_size: int = 64) -> tuple:
    small = img.resize((sample_size, sample_size))
    pixels = list(small.getdata())
    r = sum(p[0] for p in pixels) / len(pixels)
    g = sum(p[1] for p in pixels) / len(pixels)
    b = sum(p[2] for p in pixels) / len(pixels)
    return round(r), round(g), round(b)


def classify_soil_from_color(rgb: tuple) -> dict:
    r, g, b = rgb
    brightness = (r + g + b) / 3
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    hue_deg = h * 360

    if brightness < 90:
        soil_type, reason = "Clay", "dark tone — often higher organic matter / clay-rich soils"
        confidence = "medium" if brightness < 70 else "low"
    elif hue_deg < 22 and s > 0.45:
        # Low hue + high saturation = a genuinely vivid red/orange, distinct
        # from an ordinary muted brown — this is what separates lateritic
        # red soils from everyday tan loam (both have R > G > B).
        soil_type, reason = "Sandy", "vivid reddish tone — typical of lateritic / sandy-loam soils"
        confidence = "medium" if s > 0.55 else "low"
    else:
        soil_type, reason = "Loamy", "mid-brown/tan tone — typical of general agricultural loam"
        confidence = "low"

    return {"soil_type": soil_type, "reason": reason, "confidence": confidence}


def analyze_soil_photo(image_b64: str) -> dict:
    img = _decode_image(image_b64)
    rgb = _dominant_color(img)
    classification = classify_soil_from_color(rgb)
    return {
        "soil_type_guess": classification["soil_type"],
        "confidence": classification["confidence"],
        "reason": classification["reason"],
        "dominant_color_rgb": list(rgb),
        "method": "color-heuristic (not a trained CNN) — verify against the dropdown",
    }
