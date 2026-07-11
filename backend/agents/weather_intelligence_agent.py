"""
Weather Intelligence Agent
Fetches weather data and predicts disease risk based on weather patterns
"""

import httpx
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from config import settings

class WeatherIntelligenceAgent:
    """Agent for weather intelligence and disease risk prediction"""
    
    def __init__(self):
        self.api_url = settings.OPEN_METEO_API_URL
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def get_weather_data(
        self,
        latitude: float,
        longitude: float,
        forecast_days: int = 7
    ) -> Dict[str, Any]:
        """
        Fetch weather data and forecast from Open-Meteo
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            forecast_days: Number of days to forecast (default 7)
            
        Returns:
            Dict with current weather and forecast
        """
        
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,pressure_msl,cloud_cover",
                "hourly": "temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,wind_speed_10m",
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,wind_speed_10m_max",
                "forecast_days": forecast_days,
                "timezone": "Asia/Kolkata"
            }
            
            response = await self.client.get(self.api_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Process data
            weather_data = self._process_weather_data(data)
            
            # Calculate disease risk
            disease_risk = self._calculate_disease_risk(weather_data)
            
            return {
                "success": True,
                "data": {
                    "current": weather_data["current"],
                    "forecast": weather_data["forecast"],
                    "diseaseRisk": disease_risk
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _process_weather_data(self, raw_data: Dict) -> Dict[str, Any]:
        """Process raw weather data into structured format"""
        
        current = raw_data.get("current", {})
        daily = raw_data.get("daily", {})
        
        processed = {
            "current": {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "precipitation": current.get("precipitation", 0),
                "rain": current.get("rain", 0),
                "windSpeed": current.get("wind_speed_10m"),
                "pressure": current.get("pressure_msl"),
                "cloudCover": current.get("cloud_cover"),
                "timestamp": current.get("time")
            },
            "forecast": []
        }
        
        # Process daily forecast
        if daily:
            times = daily.get("time", [])
            temp_max = daily.get("temperature_2m_max", [])
            temp_min = daily.get("temperature_2m_min", [])
            precip = daily.get("precipitation_sum", [])
            rain = daily.get("rain_sum", [])
            wind = daily.get("wind_speed_10m_max", [])
            
            for i in range(len(times)):
                processed["forecast"].append({
                    "date": times[i],
                    "tempMax": temp_max[i] if i < len(temp_max) else None,
                    "tempMin": temp_min[i] if i < len(temp_min) else None,
                    "precipitation": precip[i] if i < len(precip) else 0,
                    "rain": rain[i] if i < len(rain) else 0,
                    "windSpeed": wind[i] if i < len(wind) else None
                })
        
        return processed
    
    def _calculate_disease_risk(self, weather_data: Dict) -> Dict[str, Any]:
        """
        Calculate disease risk based on weather patterns
        
        High risk conditions:
        - High humidity (>80%) + moderate temperature (20-30°C)
        - Recent rainfall + high humidity
        - Low wind speed with high humidity
        """
        
        current = weather_data["current"]
        forecast = weather_data["forecast"]
        
        humidity = current.get("humidity", 0)
        temperature = current.get("temperature", 0)
        rain = current.get("rain", 0)
        wind_speed = current.get("windSpeed", 0)
        
        risk_score = 0
        risk_factors = []
        
        # Humidity risk (40 points max)
        if humidity > 85:
            risk_score += 40
            risk_factors.append("Very high humidity (>85%)")
        elif humidity > 70:
            risk_score += 25
            risk_factors.append("High humidity (>70%)")
        elif humidity > 60:
            risk_score += 15
            risk_factors.append("Moderate humidity")
        
        # Temperature risk (30 points max)
        if 20 <= temperature <= 30:
            risk_score += 30
            risk_factors.append("Optimal temperature for pathogens (20-30°C)")
        elif 15 <= temperature <= 35:
            risk_score += 15
            risk_factors.append("Favorable temperature for some pathogens")
        
        # Rain risk (20 points max)
        if rain > 0:
            risk_score += 20
            risk_factors.append("Recent rainfall")
        
        # Check upcoming rain
        upcoming_rain = sum(1 for day in forecast[:3] if day.get("rain", 0) > 0)
        if upcoming_rain >= 2:
            risk_score += 10
            risk_factors.append(f"Rain expected in {upcoming_rain} of next 3 days")
        
        # Wind risk (10 points max)
        if wind_speed < 5:
            risk_score += 10
            risk_factors.append("Low wind speed (<5 km/h)")
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = "critical"
            recommendation = "Immediate preventive action required"
        elif risk_score >= 50:
            risk_level = "high"
            recommendation = "Monitor crops closely, prepare preventive measures"
        elif risk_score >= 30:
            risk_level = "medium"
            recommendation = "Regular monitoring recommended"
        else:
            risk_level = "low"
            recommendation = "Normal farming operations"
        
        return {
            "score": min(risk_score, 100),
            "level": risk_level,
            "factors": risk_factors,
            "recommendation": recommendation
        }
    
    async def get_irrigation_recommendation(
        self,
        latitude: float,
        longitude: float,
        crop_type: str,
        soil_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get irrigation recommendations based on weather forecast"""
        
        try:
            weather_result = await self.get_weather_data(latitude, longitude, forecast_days=3)
            
            if not weather_result["success"]:
                return weather_result
            
            weather_data = weather_result["data"]
            current = weather_data["current"]
            forecast = weather_data["forecast"]
            
            # Check upcoming rain
            total_rain_forecast = sum(day.get("rain", 0) for day in forecast[:3])
            
            # Decision logic
            if total_rain_forecast > 10:  # More than 10mm in next 3 days
                should_irrigate = False
                reason = f"Rain expected ({total_rain_forecast:.1f}mm in next 3 days)"
                timing = None
            elif current.get("humidity", 0) > 80:
                should_irrigate = False
                reason = "High humidity, soil moisture likely adequate"
                timing = "Check after 24 hours"
            elif current.get("temperature", 0) > 35:
                should_irrigate = True
                reason = "High temperature, crops need water"
                timing = "Early morning (5-7 AM) or evening (6-8 PM)"
            else:
                should_irrigate = True
                reason = "Normal irrigation schedule"
                timing = "Early morning preferred"
            
            return {
                "success": True,
                "data": {
                    "shouldIrrigate": should_irrigate,
                    "reason": reason,
                    "timing": timing,
                    "weatherContext": {
                        "temperature": current.get("temperature"),
                        "humidity": current.get("humidity"),
                        "upcomingRain": total_rain_forecast
                    }
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()
