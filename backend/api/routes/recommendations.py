"""
Recommendations API Routes
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any

from agents import RecommendationAgent

router = APIRouter()
recommendation_agent = RecommendationAgent()

class DecisionCardRequest(BaseModel):
    question: str
    context: Dict[str, Any]
    language: str = "en"

class ComprehensiveRecommendationRequest(BaseModel):
    farmData: Dict[str, Any]
    language: str = "en"

@router.post("/decision-card")
async def get_decision_card(request: DecisionCardRequest):
    """Get decision card for specific question"""
    
    try:
        result = await recommendation_agent.get_decision_card(
            question=request.question,
            context=request.context,
            language=request.language
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/comprehensive")
async def get_comprehensive_recommendations(request: ComprehensiveRecommendationRequest):
    """Get comprehensive farming recommendations"""
    
    try:
        result = await recommendation_agent.get_comprehensive_recommendations(
            farm_data=request.farmData,
            language=request.language
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "recommendations"}
