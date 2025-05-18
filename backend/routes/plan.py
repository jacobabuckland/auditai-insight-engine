from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

class PlanRequest(BaseModel):
    goal: str
    shopDomain: str

class PlanResponse(BaseModel):
    reasoning: str
    suggestions: Dict[str, list]

@router.post("/agent/plan", response_model=PlanResponse)
def generate_plan(req: PlanRequest):
    return {
        "reasoning": f"To accomplish your goal of '{req.goal}', we analysed your site and stock levels.",
        "suggestions": {
            "Product": [
                {
                    "title": "Feature high-stock jumpers on homepage",
                    "description": "Move blue cotton jumpers into homepage hero to boost exposure."
                }
            ],
            "Merch": [],
            "Lifecycle": []
        }
    }
