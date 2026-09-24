import os
from typing import Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from app.services.ai_service import ask_question_about_document_with_gemini

router = APIRouter(prefix="/api", tags=["Document Question Answering"])


class AskRequest(BaseModel):
    question: str
    documentText: str
    analysis: Optional[Dict[str, Any]] = {}
    language: Optional[str] = "English"


@router.post("/ask")
async def ask_document_question(req: AskRequest):
    """
    Document Question-Answering endpoint for AccessBridge AI.
    Answers natural-language user questions strictly grounded in the extracted document text and analysis.
    """
    if not req.question or not req.question.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Question cannot be empty."}
        )

    if not req.documentText or not req.documentText.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Document text cannot be empty."}
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
        result = await run_in_threadpool(
            ask_question_about_document_with_gemini,
            req.question,
            req.documentText,
            req.analysis or {},
            req.language or "English"
        )
        return result
    except ValueError as verr:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(verr)}
        )
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": f"Question answering error: {str(err)}"}
        )
