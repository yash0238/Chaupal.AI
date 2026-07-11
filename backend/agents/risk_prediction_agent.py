"""
Risk Prediction Agent
Combines weather, disease, and crop data to calculate farm risk score
"""

import google.generativeai as genai
from typing import Dict, Any, List, Optional
from datetime import datetime
from config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)

class RiskPredictionAgent:
    """Agent for farm risk assessment and prediction"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL_FLASH)
    
    async def calculate_farm_risk_score(
        self,
        weather_data: Dict,
        disease_history: List[Dict],
        crop_info: Dict,
        location: Dict
    ) -> Dict[str, Any]:
        """
        Calculate comprehensive farm risk score (0-100)
        
        Components:
        - Weather Risk (40%)
        - Disease Risk (35%)
        - Crop Health Risk (25%)
        """
        
        try:
            # Calculate individual risk components
            weather_risk = self._calculate_weather_risk(weather_data)
            disease_risk = self._calculate_disease_risk(disease_history, weather_data)
            crop_risk = self._calculate_crop_health_risk(crop_info)
            
            # Weighted overall score
            overall_score = int(
                weather_risk * 0.40 +
                disease_risk * 0.35 +
                crop_risk * 0.25
            )
            
            # Determine risk level
            risk_level = self._get_risk_level(overall_score)
            
            # Generate actionable recommendations
            actions = await self._generate_actions(
                overall_score,
                weather_data,
                disease_history,
                crop_info
            )
            
            return {
                "success": True,
                "data": {
                    "overallScore": overall_score,
                    "riskLevel": risk_level,
                    "components": {
                        "weatherRisk": weather_risk,
                        "diseaseRisk": disease_risk,
                        "cropHealthRisk": crop_risk
                    },
                    "factors": self._get_contributing_factors(
                        weather_risk,
                        disease_risk,
                        crop_risk,
                        weather_data,
                        disease_history
                    ),
                    "actions": actions
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _calculate_weather_risk(self, weather_data: Dict) -> int:
        """Calculate weather-based risk (0-100)"""
        
        current = weather_data.get("current", {})
        forecast = weather_data.get("forecast", [])
        
        risk_score = 0
        
        # Temperature extremes
        temp = current.get("temperature", 25)
        if temp > 40 or temp < 10:
            risk_score += 30
        elif temp > 35 or temp < 15:
            risk_score += 15
        
        # Humidity
        humidity = current.get("humidity", 50)
        if humidity > 85:
            risk_score += 25
        elif humidity > 70:
            risk_score += 15
        elif humidity < 30:
            risk_score += 10
        
        # Rainfall
        upcoming_heavy_rain = sum(1 for day in forecast[:3] if day.get("rain", 0) > 50)
        if upcoming_heavy_rain >= 2:
            risk_score += 20
        elif upcoming_heavy_rain == 1:
            risk_score += 10
        
        # Wind
        wind_speed = current.get("windSpeed", 0)
        if wind_speed > 40:
            risk_score += 15
        
        return min(risk_score, 100)
    
    def _calculate_disease_risk(
        self,
        disease_history: List[Dict],
        weather_data: Dict
    ) -> int:
        """Calculate disease-based risk (0-100)"""
        
        # Base risk from weather-disease correlation
        disease_weather_risk = weather_data.get("diseaseRisk", {}).get("score", 0)
        
        # Recent disease history
        recent_diseases = [d for d in disease_history if self._is_recent(d.get("timestamp"))]
        
        if not recent_diseases:
            return int(disease_weather_risk * 0.5)  # Lower risk if no history
        
        # Severity scoring
        severity_map = {"low": 10, "medium": 25, "high": 40, "critical": 60}
        max_severity_score = max(
            severity_map.get(d.get("severity", "low"), 0)
            for d in recent_diseases
        )
        
        # Combine weather and history
        combined_risk = int((disease_weather_risk * 0.6) + (max_severity_score * 0.4))
        
        return min(combined_risk, 100)
    
    def _calculate_crop_health_risk(self, crop_info: Dict) -> int:
        """Calculate crop health risk (0-100)"""
        
        # Crop stage
        stage = crop_info.get("stage", "vegetative")
        stage_risk = {
            "seedling": 40,
            "vegetative": 20,
            "flowering": 50,
            "fruiting": 60,
            "maturity": 30
        }.get(stage, 30)
        
        # Crop age
        age_days = crop_info.get("ageDays", 30)
        if age_days < 15:
            age_risk = 30  # Vulnerable seedlings
        elif age_days > 100:
            age_risk = 20  # Near harvest
        else:
            age_risk = 10
        
        return min(stage_risk + age_risk, 100)
    
    def _get_risk_level(self, score: int) -> str:
        """Map score to risk level"""
        if score >= 70:
            return "critical"
        elif score >= 50:
            return "high"
        elif score >= 30:
            return "medium"
        else:
            return "low"
    
    def _is_recent(self, timestamp: str, days: int = 14) -> bool:
        """Check if timestamp is within last N days"""
        try:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            return (datetime.now() - dt).days <= days
        except:
            return False
    
    def _get_contributing_factors(
        self,
        weather_risk: int,
        disease_risk: int,
        crop_risk: int,
        weather_data: Dict,
        disease_history: List[Dict]
    ) -> Dict[str, List[str]]:
        """Get human-readable contributing factors"""
        
        factors = {
            "weather": [],
            "disease": [],
            "crop": []
        }
        
        # Weather factors
        current = weather_data.get("current", {})
        if current.get("temperature", 0) > 35:
            factors["weather"].append("High temperature stress")
        if current.get("humidity", 0) > 80:
            factors["weather"].append("Very high humidity")
        if any(d.get("rain", 0) > 50 for d in weather_data.get("forecast", [])[:3]):
            factors["weather"].append("Heavy rain expected")
        
        # Disease factors
        if disease_history:
            factors["disease"].append(f"{len(disease_history)} disease incidents recorded")
        disease_risk_factors = weather_data.get("diseaseRisk", {}).get("factors", [])
        factors["disease"].extend(disease_risk_factors[:3])
        
        # Crop factors
        factors["crop"].append("Crop in vulnerable stage")
        
        return factors
    
    async def _generate_actions(
        self,
        risk_score: int,
        weather_data: Dict,
        disease_history: List[Dict],
        crop_info: Dict
    ) -> Dict[str, List[str]]:
        """Generate AI-powered action recommendations"""
        
        risk_level = self._get_risk_level(risk_score)
        
        prompt = f"""You are an agricultural advisor. Based on the farm risk assessment, provide specific actionable recommendations.

Risk Score: {risk_score}/100 ({risk_level} risk)
Current Weather: {weather_data.get('current', {})}
Recent Diseases: {len(disease_history)} incidents
Crop: {crop_info.get('type', 'Unknown')}

Provide recommendations in the following categories:
1. Immediate Actions (next 24-48 hours)
2. Short-term Actions (next week)
3. Long-term Actions (this season)

Format as JSON:
{{
    "immediate": ["action1", "action2", ...],
    "shortTerm": ["action1", "action2", ...],
    "longTerm": ["action1", "action2", ...]
}}

Be specific, practical, and farmer-friendly. Focus on risk mitigation."""
        
        try:
            response = self.model.generate_content(prompt)
            import json
            import re
            
            json_match = re.search(r'```json\n(.*?)\n```', response.text, re.DOTALL)
            if json_match:
                actions = json.loads(json_match.group(1))
            else:
                actions = json.loads(response.text)
            
            return actions
            
        except:
            # Fallback actions
            if risk_level == "critical":
                return {
                    "immediate": [
                        "Inspect crops for disease symptoms",
                        "Avoid irrigation if rain is expected",
                        "Prepare preventive pesticide spray"
                    ],
                    "shortTerm": [
                        "Monitor weather daily",
                        "Ensure drainage systems are working",
                        "Stock necessary pesticides"
                    ],
                    "longTerm": [
                        "Consider resistant crop varieties next season",
                        "Improve farm drainage infrastructure"
                    ]
                }
            else:
                return {
                    "immediate": ["Regular crop monitoring"],
                    "shortTerm": ["Maintain normal farming operations"],
                    "longTerm": ["Continue best practices"]
                }
