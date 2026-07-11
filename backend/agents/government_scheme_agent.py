"""
Government Scheme Agent
RAG-based system for government scheme discovery and eligibility
"""

import google.generativeai as genai
from typing import Dict, Any, List, Optional
from config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)

class GovernmentSchemeAgent:
    """Agent for government scheme recommendations using RAG"""
    
    def __init__(self):
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL_PRO)
        # In production, load schemes from database or vector store
        self.schemes_db = self._load_schemes_db()
    
    def _load_schemes_db(self) -> List[Dict]:
        """Load government schemes database"""
        # Sample schemes - in production, load from Supabase/ChromaDB
        return [
            {
                "name": "PM-KISAN",
                "description": "Income support of ₹6000/year to all farmers",
                "eligibility": "All landholding farmers",
                "benefits": "₹2000 per installment, 3 times a year",
                "category": "income_support",
                "applicationUrl": "https://pmkisan.gov.in/"
            },
            {
                "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "description": "Crop insurance scheme",
                "eligibility": "All farmers growing notified crops",
                "benefits": "Comprehensive risk coverage at low premium",
                "category": "insurance",
                "applicationUrl": "https://pmfby.gov.in/"
            },
            {
                "name": "Kisan Credit Card (KCC)",
                "description": "Credit facility for farmers",
                "eligibility": "Farmers with landholding or tenant farmers",
                "benefits": "Short-term credit at low interest",
                "category": "credit",
                "applicationUrl": "https://www.india.gov.in/spotlight/kisan-credit-card-kcc"
            },
            {
                "name": "Soil Health Card Scheme",
                "description": "Soil testing and nutrient management",
                "eligibility": "All farmers",
                "benefits": "Free soil testing and fertilizer recommendations",
                "category": "support",
                "applicationUrl": "https://soilhealth.dac.gov.in/"
            }
        ]
    
    async def find_eligible_schemes(
        self,
        farmer_profile: Dict[str, Any],
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Find government schemes based on farmer profile
        
        Args:
            farmer_profile: Dict with farmSize, crops, state, landOwnership, etc.
            language: Response language
        """
        
        try:
            # Filter relevant schemes
            relevant_schemes = self._filter_schemes(farmer_profile)
            
            # Generate personalized recommendations using Gemini
            prompt = f"""You are a government agriculture scheme advisor.

Farmer Profile:
- Farm Size: {farmer_profile.get('farmSize', 'Unknown')} acres
- Crops: {farmer_profile.get('crops', [])}
- State: {farmer_profile.get('state', 'India')}
- Land Ownership: {farmer_profile.get('landOwnership', 'Owner')}

Available Schemes:
{self._format_schemes_for_prompt(relevant_schemes)}

For each scheme:
1. Explain eligibility in simple terms
2. List required documents
3. Explain application process (step-by-step)
4. Mention deadlines if any
5. Provide contact information

Respond in {language} language. Be clear and farmer-friendly."""
            
            response = self.model.generate_content(prompt)
            
            return {
                "success": True,
                "data": {
                    "schemes": relevant_schemes,
                    "guidance": response.text,
                    "totalSchemes": len(relevant_schemes)
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _filter_schemes(self, farmer_profile: Dict) -> List[Dict]:
        """Filter schemes based on farmer profile"""
        # In production, use vector similarity search
        # For now, return all schemes
        return self.schemes_db
    
    def _format_schemes_for_prompt(self, schemes: List[Dict]) -> str:
        """Format schemes for LLM prompt"""
        formatted = []
        for scheme in schemes:
            formatted.append(
                f"- {scheme['name']}: {scheme['description']} "
                f"(Eligibility: {scheme['eligibility']})"
            )
        return "\n".join(formatted)
    
    async def get_scheme_details(
        self,
        scheme_name: str,
        language: str = "en"
    ) -> Dict[str, Any]:
        """Get detailed information about a specific scheme"""
        
        # Find scheme
        scheme = next((s for s in self.schemes_db if s['name'].lower() == scheme_name.lower()), None)
        
        if not scheme:
            return {
                "success": False,
                "error": "Scheme not found"
            }
        
        prompt = f"""Provide detailed information about the government scheme: {scheme['name']}

Description: {scheme['description']}
Eligibility: {scheme['eligibility']}
Benefits: {scheme['benefits']}

Respond in {language} language.

Include:
1. What is this scheme?
2. Who can apply?
3. What documents are needed?
4. How to apply? (step-by-step)
5. Important deadlines
6. Contact information
7. Common mistakes to avoid

Make it easy to understand for farmers."""
        
        try:
            response = self.model.generate_content(prompt)
            
            return {
                "success": True,
                "data": {
                    "scheme": scheme,
                    "details": response.text
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
