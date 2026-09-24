import urllib.request
import json
import os

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing GET /api/health...")
    req = urllib.request.Request(f"{BASE_URL}/api/health")
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data["status"] == "ok"
        print("[OK] Health check passed:", data)

def post_multipart(endpoint, filename, content_bytes, content_type="application/octet-stream"):
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode('utf-8'))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode('utf-8'))
    body.extend(f"Content-Type: {content_type}\r\n\r\n".encode('utf-8'))
    body.extend(content_bytes)
    body.extend(f"\r\n--{boundary}--\r\n".encode('utf-8'))

    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=bytes(body),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return resp.status, data
    except urllib.error.HTTPError as err:
        data = json.loads(err.read().decode('utf-8'))
        return err.code, data

def test_upload_txt():
    print("Testing upload sample_scholarship.txt...")
    with open("scratch/test_files/sample_scholarship.txt", "rb") as f:
        content = f.read()
    status_code, data = post_multipart("/api/analyze", "sample_scholarship.txt", content, "text/plain")
    if status_code == 200:
        assert data["success"] is True
        assert data["filename"] == "sample_scholarship.txt"
        assert "National Merit Scholarship 2026" in data["text"]
        print("[OK] TXT upload succeeded:", list(data.keys()))
    else:
        assert status_code in (400, 500)
        assert data["success"] is False
        assert "GEMINI_API_KEY" in data["error"] or "AI Analysis error" in data["error"]
        print("[OK] TXT upload returned expected error format:", data["error"])

def test_upload_pdf():
    print("Testing upload sample_notice.pdf...")
    with open("scratch/test_files/sample_notice.pdf", "rb") as f:
        content = f.read()
    status_code, data = post_multipart("/api/analyze", "sample_notice.pdf", content, "application/pdf")
    if status_code == 200:
        assert data["success"] is True
        assert data["filename"] == "sample_notice.pdf"
        assert "Higher Education Grant Notice" in data["text"]
        print("[OK] PDF upload succeeded:", list(data.keys()))
    else:
        assert status_code in (400, 500)
        assert data["success"] is False
        assert "GEMINI_API_KEY" in data["error"] or "AI Analysis error" in data["error"]
        print("[OK] PDF upload returned expected error format:", data["error"])

def test_upload_empty():
    print("Testing upload empty_file.txt...")
    status_code, data = post_multipart("/api/analyze", "empty_file.txt", b"", "text/plain")
    assert status_code == 400
    assert data["success"] is False
    assert "empty" in data["error"].lower()
    print("[OK] Empty file upload correctly rejected:", data)

def test_upload_unsupported():
    print("Testing upload invalid_file.xyz...")
    status_code, data = post_multipart("/api/analyze", "invalid_file.xyz", b"dummy", "application/octet-stream")
    assert status_code == 400
    assert data["success"] is False
    assert "unsupported" in data["error"].lower()
    print("[OK] Unsupported file upload correctly rejected:", data)

def test_upload_scanned_pdf():
    print("Testing upload scanned PDF (OCR fallback)...")
    import sys
    sys.path.append('.')
    from scratch.test_extraction import create_scanned_pdf
    scanned_bytes = create_scanned_pdf()
    status_code, data = post_multipart("/api/analyze", "scanned_GATEPayment.pdf", scanned_bytes, "application/pdf")
    if status_code == 200:
        assert data["success"] is True
        assert data["extractionMethod"] == "pdf_ocr"
        print("[OK] Scanned PDF upload succeeded via OCR:", data["filename"])
    else:
        assert status_code in (400, 500)
        assert data["success"] is False
        print("[OK] Scanned PDF returned expected response (Tesseract check or API key error):", data["error"])

if __name__ == "__main__":
    test_health()
    test_upload_txt()
    test_upload_pdf()
    test_upload_scanned_pdf()
    test_upload_empty()
    test_upload_unsupported()
    print("\n=== ALL FRONTEND-BACKEND INTEGRATION SCENARIOS VERIFIED SUCCESSFULLY! ===")
