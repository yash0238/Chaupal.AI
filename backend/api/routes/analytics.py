"""
Analytics API Routes
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional

from agents import AnalyticsAgent

router = APIRouter()
analytics_agent = AnalyticsAgent()

@router.get("/disease-trends")
async def get_disease_trends(
    days: int = Query(30, ge=1, le=365, description="Number of days"),
    state: Optional[str] = Query(None, description="Filter by state")
):
    """Get disease trends from analytics data"""
    
    try:
        result = await analytics_agent.get_disease_trends(days=days)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/risk-distribution")
async def get_risk_distribution(
    days: int = Query(30, ge=1, le=365, description="Number of days")
):
    """Get risk level distribution"""
    
    try:
        result = await analytics_agent.get_risk_distribution(days=days)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/farm-insights")
async def get_farm_insights():
    """
    Aggregated insights over the bulk farm-performance dataset in BigQuery.
    Powers the main Analytics dashboard (yield by crop, risk by state,
    disease spread) using the 500K synthetic rows.
    """

    try:
        result = await analytics_agent.get_farm_insights()

        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])

        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "analytics"}
