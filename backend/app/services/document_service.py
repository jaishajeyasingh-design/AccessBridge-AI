import io
import os
import shutil
import pymupdf as fitz  # PyMuPDF
from PIL import Image
import pytesseract
from app.utils.text_cleaner import clean_text

# Check and set Windows Tesseract binary location if present in default install path
def _configure_tesseract_cmd():
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

def extract_text_from_pdf(content_bytes: bytes) -> str:
    """Extracts text from all pages of a PDF document using PyMuPDF (fitz)."""
    try:
        doc = fitz.open(stream=content_bytes, filetype="pdf")
        text_pages = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")
            if page_text and page_text.strip():
                text_pages.append(page_text.strip())
        doc.close()

        combined_text = "\n\n".join(text_pages)
        if not combined_text.strip():
            return "Notice: PDF file opened successfully but contains no extractable text layer (scanned or empty PDF)."
        return combined_text
    except Exception as e:
        raise ValueError(f"Failed to process PDF document: {str(e)}")

def extract_text_from_txt(content_bytes: bytes) -> str:
    """Safely decodes and extracts text from a TXT file."""
    try:
        return content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            return content_bytes.decode("latin-1")
        except Exception:
            return content_bytes.decode("utf-8", errors="replace")

def extract_text_from_image(content_bytes: bytes) -> str:
    """Performs OCR extraction on PNG/JPG/JPEG images using Pillow and pytesseract."""
    has_tesseract = _configure_tesseract_cmd()
    if not has_tesseract:
        raise RuntimeError(
            "Tesseract OCR engine is not installed or not found on system PATH. "
            "To enable image OCR on Windows, install Tesseract OCR from "
            "https://github.com/UB-Mannheim/tesseract/wiki and add its directory to your PATH environment variable."
        )

    try:
        image = Image.open(io.BytesIO(content_bytes))
        # Convert image mode if needed
        if image.mode not in ("RBG", "L"):
            image = image.convert("RGB")
        text = pytesseract.image_to_string(image)
        if not text.strip():
            return "Notice: Image processed successfully, but no text could be recognized."
        return text
    except pytesseract.TesseractNotFoundError:
        raise RuntimeError(
            "Tesseract OCR executable was not found. Please install Tesseract-OCR and configure PATH."
        )
    except Exception as e:
        raise ValueError(f"Failed to perform OCR on image: {str(e)}")

def extract_document_text(filename: str, content_bytes: bytes) -> tuple[str, str]:
    """
    Main extraction dispatcher based on file extension.
    Returns (file_type, cleaned_extracted_text).
    """
    if not filename:
        raise ValueError("Filename is missing")

    ext = filename.lower().split(".")[-1]

    if ext == "pdf":
        raw_text = extract_text_from_pdf(content_bytes)
        file_type = "pdf"
    elif ext == "txt":
        raw_text = extract_text_from_txt(content_bytes)
        file_type = "txt"
    elif ext in ("png", "jpg", "jpeg"):
        raw_text = extract_text_from_image(content_bytes)
        file_type = ext
    else:
        raise ValueError(f"Unsupported file extension '.{ext}'. Supported extensions: .pdf, .txt, .png, .jpg, .jpeg")

    cleaned = clean_text(raw_text)
    return file_type, cleaned
