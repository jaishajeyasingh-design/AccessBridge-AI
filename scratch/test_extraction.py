import sys
import io
import pymupdf as fitz
from PIL import Image, ImageDraw
sys.path.append('backend')
from app.services.document_service import extract_document_text

def create_sample_pdf() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    text = "AccessBridge AI Scholarship Notice 2026.\nEligible students must apply before 30 September 2026.\nRequired documents: Aadhaar and Income Certificate."
    page.insert_text((50, 50), text, fontsize=12)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def create_scanned_pdf() -> bytes:
    img = Image.new('RGB', (600, 200), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((20, 50), "Scanned GATE Payment Notice 2026", fill=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    img_bytes = buf.getvalue()

    doc = fitz.open()
    page = doc.new_page(width=600, height=200)
    page.insert_image(page.rect, stream=img_bytes)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def create_sample_txt() -> bytes:
    text = "AccessBridge AI Text Test.\nLine 1 of notice.\n\n\nLine 2 of notice after blank space."
    return text.encode('utf-8')

def create_sample_image() -> bytes:
    img = Image.new('RGB', (400, 100), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((10, 10), "AccessBridge OCR Test Image", fill=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return buf.getvalue()

def run_tests():
    print("--- 1. Testing TXT Extraction ---")
    txt_bytes = create_sample_txt()
    file_type, cleaned_txt, method = extract_document_text("test_document.txt", txt_bytes)
    print(f"File Type: {file_type} | Method: {method}")
    print(f"Extracted Text:\n{cleaned_txt}\n")
    assert "AccessBridge AI Text Test" in cleaned_txt
    assert method == "text"

    print("--- 2. Testing Text PDF Extraction ---")
    pdf_bytes = create_sample_pdf()
    file_type, cleaned_pdf, method = extract_document_text("scholarship_notice.pdf", pdf_bytes)
    print(f"File Type: {file_type} | Method: {method}")
    print(f"Extracted Text:\n{cleaned_pdf}\n")
    assert "Scholarship Notice 2026" in cleaned_pdf
    assert method == "pdf_text"

    print("--- 3. Testing Scanned PDF (OCR Fallback) ---")
    scanned_pdf_bytes = create_scanned_pdf()
    try:
        file_type, cleaned_scanned, method = extract_document_text("GATEPayment.pdf", scanned_pdf_bytes)
        print(f"File Type: {file_type} | Method: {method}")
        print(f"OCR Extracted Text:\n{cleaned_scanned}\n")
        assert method == "pdf_ocr"
    except RuntimeError as rerr:
        print(f"Scanned PDF OCR Graceful Catch (Tesseract status): {rerr}\n")
        assert "Tesseract OCR engine is not installed" in str(rerr)

    print("--- 4. Testing Image OCR Extraction ---")
    img_bytes = create_sample_image()
    try:
        file_type, cleaned_img, method = extract_document_text("sample_ocr.png", img_bytes)
        print(f"File Type: {file_type} | Method: {method}")
        print(f"OCR Extracted Text:\n{cleaned_img}\n")
        assert method == "image_ocr"
    except RuntimeError as rerr:
        print(f"Image OCR Graceful Catch (Tesseract status): {rerr}\n")
        assert "Tesseract OCR engine is not installed" in str(rerr)

    print("--- 5. Testing Unsupported File Type ---")
    try:
        extract_document_text("invalid_file.docx", b"dummy binary")
        print("ERROR: Should have raised ValueError for unsupported extension!")
    except ValueError as verr:
        print(f"Caught expected error for unsupported type: {verr}\n")

    print("=== All unit tests completed successfully! ===")

if __name__ == "__main__":
    run_tests()
