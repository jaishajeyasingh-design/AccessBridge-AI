from fastapi import APIRouter, File, UploadFile, status
from fastapi.responses import JSONResponse
from app.services.document_service import extract_document_text

router = APIRouter(prefix="/api", tags=["Document Analysis"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_EXTENSIONS = {"pdf", "txt", "png", "jpg", "jpeg"}

@router.post("/analyze")
async def analyze_document(file: UploadFile = File(None)):
    """
    Document extraction endpoint for AccessBridge AI.
    Extracts text from PDF, TXT, PNG, JPG, and JPEG files.
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

    try:
        file_type, extracted_text = extract_document_text(filename, content_bytes)
        return {
            "success": True,
            "filename": filename,
            "fileType": file_type,
            "text": extracted_text
        }
    except RuntimeError as rerr:
        # Runtime errors (e.g. OCR missing)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(rerr)}
        )
    except ValueError as verr:
        # Validation / extraction formatting errors
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(verr)}
        )
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "error": f"An unexpected error occurred during document extraction: {str(err)}"}
        )
