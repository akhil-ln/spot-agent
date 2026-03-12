from fastapi import APIRouter
router = APIRouter()

@router.post("/api/analyse")
def analyse(payload: dict):
    return {"status": "stub - Team A will implement this"}