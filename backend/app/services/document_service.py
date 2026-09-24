import io
import os
import shutil
import logging
import pymupdf as fitz  # PyMuPDF
from PIL import Image
import pytesseract
from app.utils.text_cleaner import clean_text

logger = logging.getLogger("accessbridge.document_service")

# Check and set Windows Tesseract binary location if present in default install path
def _configure_tesseract_cmd() -> bool:
    if shutil.which("tesseract"):
        return True
    
    # Common Windows installation locations
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
    ]
    for p in possible_paths:
        if os.path.exists(p):
            pytesseract.pytesseract.tesseract_cmd = p
            return True
    return False

def extract_text_from_pdf(content_bytes: bytes) -> tuple[str, str]:
    """
    Extracts text from a PDF document.
    1. First attempts standard PyMuPDF text layer extraction.
    2. If text layer is missing or empty (< 20 chars), falls back to page rendering + Tesseract OCR.
    Returns tuple: (extracted_raw_text, extraction_method)
    """
    try:
        doc = fitz.open(stream=content_bytes, filetype="pdf")
    except Exception as e:
        raise ValueError(f"Failed to process PDF document: {str(e)}")

    text_pages = []
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        page_text = page.get_text("text")
        if page_text and page_text.strip():
            text_pages.append(page_text.strip())

    combined_text = "\n\n".join(text_pages).strip()

    # Step 1: If text layer contains valid text (> 20 chars), return text extraction method
    if len(combined_text) > 20:
        doc.close()
        return combined_text, "pdf_text"

    # Step 2: Scanned PDF detected (no text layer) -> Fallback to OCR
    logger.info("PDF text extraction returned no text. Starting OCR fallback...")
    print("PDF text extraction returned no text. Starting OCR fallback...")

    has_tesseract = _configure_tesseract_cmd()
    if not has_tesseract:
        doc.close()
        raise RuntimeError(
            "Tesseract OCR engine is not installed or not found on system PATH. "
            "This scanned PDF contains no text layer and requires Tesseract OCR for text extraction. "
            "To enable scanned PDF OCR on Windows, install Tesseract OCR from "
            "https://github.com/UB-Mannheim/tesseract/wiki and add its installation directory to your system PATH."
        )

    ocr_pages = []
    max_ocr_pages = min(len(doc), 10)  # OCR limit max 10 pages for performance

    try:
        for page_num in range(max_ocr_pages):
            page = doc.load_page(page_num)
            pix = page.get_pixmap(dpi=150)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            page_ocr_text = pytesseract.image_to_string(img)
            if page_ocr_text and page_ocr_text.strip():
                ocr_pages.append(page_ocr_text.strip())
        doc.close()
    except Exception as ocr_err:
        doc.close()
        raise RuntimeError(f"Failed to perform OCR on scanned PDF: {str(ocr_err)}")

    combined_ocr_text = "\n\n".join(ocr_pages).strip()
    ocr_char_count = len(combined_ocr_text)

    logger.info(f"OCR extracted {ocr_char_count} characters from {max_ocr_pages} pages.")
    print(f"OCR extracted {ocr_char_count} characters from {max_ocr_pages} pages.")

    if not combined_ocr_text:
        raise ValueError("Scanned PDF pages could not be recognized by OCR.")

    return combined_ocr_text, "pdf_ocr"

def extract_text_from_txt(content_bytes: bytes) -> tuple[str, str]:
    """Safely decodes and extracts text from a TXT file."""
    try:
        raw = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            raw = content_bytes.decode("latin-1")
        except Exception:
            raw = content_bytes.decode("utf-8", errors="replace")
    return raw, "text"

def extract_text_from_image(content_bytes: bytes) -> tuple[str, str]:
    """Performs OCR extraction on PNG/JPG/JPEG images using Pillow and pytesseract."""
    has_tesseract = _configure_tesseract_cmd()
    if not has_tesseract:
        raise RuntimeError(
            "Tesseract OCR engine is not installed or not found on system PATH. "
            "To enable image OCR on Windows, install Tesseract OCR from "
            "https://github.com/UB-Mannheim/tesseract/wiki and add its installation directory to your system PATH."
        )

    try:
        image = Image.open(io.BytesIO(content_bytes))
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        text = pytesseract.image_to_string(image)
        if not text.strip():
            raise ValueError("Image processed successfully, but no text could be recognized.")
        return text, "image_ocr"
    except pytesseract.TesseractNotFoundError:
        raise RuntimeError(
            "Tesseract OCR executable was not found. Please install Tesseract-OCR and configure PATH."
        )
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Failed to perform OCR on image: {str(e)}")

def extract_document_text(filename: str, content_bytes: bytes) -> tuple[str, str, str]:
    """
    Main extraction dispatcher based on file extension.
    Returns (file_type, cleaned_extracted_text, extraction_method).
    """
    if not filename:
        raise ValueError("Filename is missing")

    ext = filename.lower().split(".")[-1]

    if ext == "pdf":
        raw_text, method = extract_text_from_pdf(content_bytes)
        file_type = "pdf"
    elif ext == "txt":
        raw_text, method = extract_text_from_txt(content_bytes)
        file_type = "txt"
    elif ext in ("png", "jpg", "jpeg"):
        raw_text, method = extract_text_from_image(content_bytes)
        file_type = ext
    else:
        raise ValueError(f"Unsupported file extension '.{ext}'. Supported extensions: .pdf, .txt, .png, .jpg, .jpeg")

    cleaned = clean_text(raw_text)
    return file_type, cleaned, method
