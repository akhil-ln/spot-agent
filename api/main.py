import sys, os, logging
sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s  %(message)s")

# Detect environment
ENV = os.getenv("ENV", "prod")

# Set prefix only in dev
API_PREFIX = "/api" if ENV == "dev" else ""

app = FastAPI(title="Spot Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.health import router as health_router
from app.routes.analyse import router as analyse_router

# Apply prefix conditionally
app.include_router(health_router, prefix=API_PREFIX)
app.include_router(analyse_router, prefix=API_PREFIX)

@app.get(f"{API_PREFIX}/")
def home():
    return {"message": "API working"}