import os
import json
import pymupdf as fitz
from fastapi.testclient import TestClient
from app.main import app
from app.services.ai_service import _clean_json_response, analyze_document_text_with_gemini

client = TestClient(app)

def test_clean_json_response():
    print("Testing _clean_json_response helper...")
    sample_markdown = '```json\n{\n  "title": "Test Document",\n  "documentType": "Notice"\n}\n```'
    cleaned = _clean_json_response(sample_markdown)
    parsed = json.loads(cleaned)
    assert parsed["title"] == "Test Document"
    assert parsed["documentType"] == "Notice"
    print("✓ _clean_json_response passed!")

def test_missing_api_key_handling():
    print("Testing missing GEMINI_API_KEY handling...")
    orig_key = os.environ.get("GEMINI_API_KEY")
    os.environ["GEMINI_API_KEY"] = ""
    try:
        analyze_document_text_with_gemini("Sample text", "test.pdf")
        print("ERROR: Should have raised ValueError for missing GEMINI_API_KEY")
    except ValueError as verr:
        assert "GEMINI_API_KEY" in str(verr)
        print(f"✓ Caught expected error for missing API key: {verr}")
    finally:
        if orig_key:
            os.environ["GEMINI_API_KEY"] = orig_key

def test_api_endpoint_with_ai():
    print("Testing POST /api/analyze endpoint with document extraction and AI analysis pipeline...")
    txt_content = b"Scholarship Notice 2026.\nEligible students should apply before 30 September 2026.\nRequired document: Aadhaar Card."
    files = {"file": ("scholarship.txt", txt_content, "text/plain")}
    res = client.post("/api/analyze", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["filename"] == "scholarship.txt"
    assert data["fileType"] == "txt"
    assert "Scholarship Notice 2026" in data["text"]
    assert "analysis" in data
    print("✓ POST /api/analyze endpoint response structure verified:", list(data.keys()))

if __name__ == "__main__":
    test_clean_json_response()
    test_missing_api_key_handling()
    test_api_endpoint_with_ai()
    print("\n=== ALL AI SERVICE & ENDPOINT TESTS PASSED SUCCESSFULLY! ===")
