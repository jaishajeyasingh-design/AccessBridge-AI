import os
from fastapi import APIRouter, File, UploadFile, status
from fastapi.responses import JSONResponse
from app.services.document_service import extract_document_text
from app.services.ai_service import analyze_document_text_with_gemini

router = APIRouter(prefix="/api", tags=["Document Analysis"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_EXTENSIONS = {"pdf", "txt", "png", "jpg", "jpeg"}

@router.post("/analyze")
async def analyze_document(file: UploadFile = File(None)):
    """
    Document analysis endpoint for AccessBridge AI.
    1. Extracts text from PDF, TXT, PNG, JPG, and JPEG files.
    2. Sends extracted text to Gemini AI to generate structured accessibility JSON guidance.
    """
    if file is None or not file.filename:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "No file uploaded. Please provide a document file."}
        )

    filename = file.filename
    ext = filename.lower().split(".")[-1] if "." in filename else ""

    if ext not in ALLOWED_EXTENSIONS:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": f"Unsupported file type '.{ext}'. Supported extensions: PDF, TXT, PNG, JPG, JPEG."
            }
        )

    try:
        content_bytes = await file.read()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": f"Could not read uploaded file: {str(e)}"}
        )

    if len(content_bytes) == 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Uploaded file is empty (0 bytes)."}
        )

    if len(content_bytes) > MAX_FILE_SIZE_BYTES:
        return JSONResponse(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            content={
                "success": False,
                "error": f"File size exceeds maximum allowed limit of 10 MB ({len(content_bytes) / (1024*1024):.2f} MB)."
            }
        )

    # 1. Document Text Extraction
    try:
        file_type, extracted_text = extract_document_text(filename, content_bytes)
    except RuntimeError as rerr:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(rerr)}
        )
    except ValueError as verr:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(verr)}
        )
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": f"An unexpected error occurred during document extraction: {str(err)}"}
        )

    # 2. AI Analysis via Gemini
    ai_analysis = None
    ai_error = None
    
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key and api_key != "your_api_key_here":
        try:
            ai_analysis = analyze_document_text_with_gemini(extracted_text, filename)
        except Exception as ai_err:
            ai_error = str(ai_err)
    else:
        ai_error = "GEMINI_API_KEY is missing or set to placeholder. Please configure GEMINI_API_KEY in backend/.env."

    response_payload = {
        "success": True,
        "filename": filename,
        "fileType": file_type,
        "text": extracted_text,
        "analysis": ai_analysis
    }
    
    if ai_error:
        response_payload["aiNotice"] = ai_error

    return response_payload
