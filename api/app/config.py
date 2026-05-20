import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL:   str = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")

settings = Settings()

# Scoring dimension weights — must sum to 1.0
# Change these here to adjust globally without touching scoring logic
SCORING_WEIGHTS = {
    "price":       0.30,
    "reliability": 0.25,
    "urgency":     0.20,
    "market":      0.15,
    "threshold":   0.10,
}