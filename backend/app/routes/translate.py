import os
from pydantic import BaseModel
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from app.services.ai_service import translate_content_with_gemini, LANGUAGE_MAP

router = APIRouter(prefix="/api", tags=["Translation"])

class TranslationRequest(BaseModel):
    text: str
    targetLanguage: str

@router.post("/translate")
async def translate_document(req: TranslationRequest):
    """
    Multilingual translation endpoint for AccessBridge AI.
    Translates document text or structured guidance into Indian regional languages (Tamil, Hindi, Telugu, Malayalam, English).
    Preserves dates, deadlines, monetary amounts, numbers, URLs, and document names.
    """
    if not req.text or not req.text.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Field 'text' cannot be empty."}
        )

    if not req.targetLanguage or not req.targetLanguage.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Field 'targetLanguage' is required."}
        )

    target_lang_clean = req.targetLanguage.strip()
    if target_lang_clean.lower() not in LANGUAGE_MAP:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": f"Invalid targetLanguage '{target_lang_clean}'. Supported languages: English, Tamil, Hindi, Telugu, Malayalam (or codes: en, ta, hi, te, ml)."
            }
        )

    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key.strip() in ("", "your_api_key_here"):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": "GEMINI_API_KEY is missing or set to placeholder. Please configure GEMINI_API_KEY in backend/.env."
            }
        )

    try:
        result = await run_in_threadpool(translate_content_with_gemini, req.text, target_lang_clean)
        return result
    except ValueError as verr:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(verr)}
        )
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": f"Translation error: {str(err)}"}
        )
