import io
import pymupdf as fitz
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    print("Testing GET /api/health...")
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["service"] == "AccessBridge AI"
    print("[OK] GET /api/health passed:", data)

def test_analyze_txt_endpoint():
    print("Testing POST /api/analyze with TXT file...")
    txt_content = b"AccessBridge AI Test Document Text.\nLine 2 content."
    files = {"file": ("notice.txt", txt_content, "text/plain")}
    res = client.post("/api/analyze", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["filename"] == "notice.txt"
    assert data["fileType"] == "txt"
    assert "AccessBridge AI Test Document Text." in data["text"]
    print("[OK] POST /api/analyze (TXT) passed:", data)

def test_analyze_pdf_endpoint():
    print("Testing POST /api/analyze with PDF file...")
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "PDF Test Extraction Content for AccessBridge AI", fontsize=12)
    pdf_bytes = doc.tobytes()
    doc.close()

    files = {"file": ("scholarship.pdf", pdf_bytes, "application/pdf")}
    res = client.post("/api/analyze", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["filename"] == "scholarship.pdf"
    assert data["fileType"] == "pdf"
    assert "PDF Test Extraction Content" in data["text"]
    print("[OK] POST /api/analyze (PDF) passed:", data)

def test_analyze_unsupported_file_endpoint():
    print("Testing POST /api/analyze with unsupported file type...")
    files = {"file": ("document.docx", b"dummy content", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    res = client.post("/api/analyze", files=files)
    assert res.status_code == 400
    data = res.json()
    assert data["success"] is False
    assert "Unsupported file type" in data["error"]
    print("[OK] POST /api/analyze (Unsupported file) passed:", data)

def test_analyze_missing_file_endpoint():
    print("Testing POST /api/analyze with missing file...")
    res = client.post("/api/analyze")
    assert res.status_code == 400
    data = res.json()
    assert data["success"] is False
    assert "No file uploaded" in data["error"]
    print("[OK] POST /api/analyze (Missing file) passed:", data)

def test_analyze_large_file_endpoint():
    print("Testing POST /api/analyze with oversized file (>10MB)...")
    large_bytes = b"0" * (11 * 1024 * 1024)
    files = {"file": ("large.pdf", large_bytes, "application/pdf")}
    res = client.post("/api/analyze", files=files)
    assert res.status_code == 413
    data = res.json()
    assert data["success"] is False
    assert "exceeds maximum allowed limit" in data["error"]
    print("[OK] POST /api/analyze (Oversized file) passed:", data)

if __name__ == "__main__":
    test_health_endpoint()
    test_analyze_txt_endpoint()
    test_analyze_pdf_endpoint()
    test_analyze_unsupported_file_endpoint()
    test_analyze_missing_file_endpoint()
    test_analyze_large_file_endpoint()
    print("\n=== ALL FASTAPI API ENDPOINT TESTS PASSED SUCCESSFULLY! ===")
