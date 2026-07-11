"""
Chat API Routes
Multilingual AI chat assistant
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
from config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    context: dict = {}
    sessionId: str = None

@router.post("/message")
async def send_chat_message(request: ChatRequest):
    """Send chat message to KrisiSar AI Assistant"""
    
    try:
        language_map = {
            "en": "English",
            "hi": "Hindi (हिंदी)",
            "mr": "Marathi (मराठी)",
            "ta": "Tamil (தமிழ்)",
            "te": "Telugu (తెలుగు)"
        }
        
        model = genai.GenerativeModel(settings.GEMINI_MODEL_FLASH)
        
        system_prompt = f"""You are KrisiSar AI, a helpful agricultural assistant for farmers.

Respond in {language_map.get(request.language, 'English')}.

Context:
- Farmer's location: {request.context.get('location', 'Unknown')}
- Current crop: {request.context.get('crop', 'Unknown')}
- Farm size: {request.context.get('farmSize', 'Unknown')} acres

Guidelines:
- Be friendly, simple, and farmer-friendly
- Provide practical, actionable advice
- If you don't know, say so
- For complex questions, break down the answer
- Use local context when available

Farmer's Question: {request.message}"""
        
        response = model.generate_content(system_prompt)
        
        return JSONResponse(content={
            "success": True,
            "data": {
                "response": response.text,
                "language": request.language,
                "sessionId": request.sessionId
            }
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chat"}
