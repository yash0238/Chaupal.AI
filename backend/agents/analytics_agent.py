"""
Analytics Agent
Handles BigQuery data ingestion and analytics
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import json

try:
    from google.cloud import bigquery
    BIGQUERY_AVAILABLE = True
except ImportError:
    BIGQUERY_AVAILABLE = False

from config import settings

class AnalyticsAgent:
    """Agent for analytics and BigQuery integration"""
    
    def __init__(self):
        if BIGQUERY_AVAILABLE and settings.BIGQUERY_CREDENTIALS_PATH:
            self.client = bigquery.Client.from_service_account_json(
                settings.BIGQUERY_CREDENTIALS_PATH
            )
            self.dataset_id = f"{settings.BIGQUERY_PROJECT_ID}.{settings.BIGQUERY_DATASET_ID}"
        else:
            self.client = None
    
    async def log_diagnosis_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Log diagnosis event to BigQuery"""
        
        if not self.client:
            return {"success": False, "error": "BigQuery not configured"}
        
        try:
            table_id = f"{self.dataset_id}.diagnosis_events"
            
            rows_to_insert = [{
                "event_id": event_data.get("id"),
                "user_id": event_data.get("userId"),
                "disease": event_data.get("disease"),
                "confidence": event_data.get("confidence"),
                "severity": event_data.get("severity"),
                "crop_type": event_data.get("cropType"),
                "location": json.dumps(event_data.get("location", {})),
                "timestamp": datetime.utcnow().isoformat()
            }]
            
            errors = self.client.insert_rows_json(table_id, rows_to_insert)
            
            if errors:
                return {"success": False, "error": str(errors)}
            
            return {"success": True}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def log_risk_score_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Log risk score event to BigQuery"""
        
        if not self.client:
            return {"success": False, "error": "BigQuery not configured"}
        
        try:
            table_id = f"{self.dataset_id}.risk_score_events"
            
            rows_to_insert = [{
                "event_id": event_data.get("id"),
                "user_id": event_data.get("userId"),
                "overall_score": event_data.get("overallScore"),
                "risk_level": event_data.get("riskLevel"),
                "weather_risk": event_data.get("weatherRisk"),
                "disease_risk": event_data.get("diseaseRisk"),
                "crop_health_risk": event_data.get("cropHealthRisk"),
                "location": json.dumps(event_data.get("location", {})),
                "timestamp": datetime.utcnow().isoformat()
            }]
            
            errors = self.client.insert_rows_json(table_id, rows_to_insert)
            
            if errors:
                return {"success": False, "error": str(errors)}
            
            return {"success": True}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def get_disease_trends(
        self,
        days: int = 30,
        location: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Get disease trends from BigQuery"""
        
        if not self.client:
            return {"success": False, "error": "BigQuery not configured"}
        
        try:
            query = f"""
            SELECT
                disease,
                COUNT(*) as count,
                AVG(confidence) as avg_confidence,
                DATE(timestamp) as date
            FROM `{self.dataset_id}.diagnosis_events`
            WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL {days} DAY)
            GROUP BY disease, date
            ORDER BY date DESC, count DESC
            """
            
            query_job = self.client.query(query)
            results = [dict(row) for row in query_job]
            
            return {
                "success": True,
                "data": results
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_farm_insights(self) -> Dict[str, Any]:
        """
        Aggregate insights over the bulk farm-performance dataset (the 500K
        synthetic rows loaded into BigQuery). Powers the main Analytics
        dashboard so it shows real charts immediately, without waiting for
        live user events to accumulate.

        Returns three aggregations:
          - yield_by_crop:    avg yield + farm count per crop
          - risk_by_state:    avg risk score per state (from location JSON)
          - disease_spread:   farm count grouped by number of diseases
        """

        if not self.client:
            return {"success": False, "error": "BigQuery not configured"}

        table = f"{self.dataset_id}.{settings.BIGQUERY_FARM_TABLE}"

        try:
            yield_by_crop = [
                dict(row)
                for row in self.client.query(f"""
                    SELECT
                        crop_type,
                        ROUND(AVG(yield_kg), 2) AS avg_yield,
                        COUNT(*) AS farms
                    FROM `{table}`
                    GROUP BY crop_type
                    ORDER BY avg_yield DESC
                """)
            ]

            risk_by_state = [
                dict(row)
                for row in self.client.query(f"""
                    SELECT
                        JSON_EXTRACT_SCALAR(location, '$.state') AS state,
                        ROUND(AVG(avg_risk_score), 1) AS avg_risk,
                        COUNT(*) AS farms
                    FROM `{table}`
                    GROUP BY state
                    HAVING state IS NOT NULL
                    ORDER BY avg_risk DESC
                """)
            ]

            disease_spread = [
                dict(row)
                for row in self.client.query(f"""
                    SELECT
                        diseases_count,
                        COUNT(*) AS farms
                    FROM `{table}`
                    GROUP BY diseases_count
                    ORDER BY diseases_count
                """)
            ]

            return {
                "success": True,
                "data": {
                    "yield_by_crop": yield_by_crop,
                    "risk_by_state": risk_by_state,
                    "disease_spread": disease_spread,
                },
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_risk_distribution(self, days: int = 30) -> Dict[str, Any]:
        """Get risk level distribution"""
        
        if not self.client:
            return {"success": False, "error": "BigQuery not configured"}
        
        try:
            query = f"""
            SELECT
                risk_level,
                COUNT(*) as count,
                AVG(overall_score) as avg_score
            FROM `{self.dataset_id}.risk_score_events`
            WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL {days} DAY)
            GROUP BY risk_level
            ORDER BY avg_score DESC
            """
            
            query_job = self.client.query(query)
            results = [dict(row) for row in query_job]
            
            return {
                "success": True,
                "data": results
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
