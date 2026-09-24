import os
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

TEST_DOCUMENT_TEXT = """
GATE 2026 Payment Confirmation Receipt
Application Number: 2026GATE991823
Candidate Name: Priya Sharma
Payment Amount: INR 1800
Payment Status: Successful
Transaction Reference Number: TXN8877665544
Payment Date: 15 September 2026
Deadline to upload category certificate: 30 October 2026
Required Documents: Aadhaar Card, Degree Certificate, Caste Certificate
Important Note: Payment once submitted is non-refundable.
"""

TEST_ANALYSIS = {
    "title": "GATE 2026 Payment Receipt",
    "documentType": "Payment Confirmation",
    "simpleExplanation": "Payment of INR 1800 for GATE 2026 was successful.",
    "eligibility": ["Registered Candidates"],
    "deadline": "30 October 2026",
    "requiredDocuments": ["Aadhaar Card", "Degree Certificate", "Caste Certificate"],
    "steps": ["Upload category certificate before deadline", "Keep receipt for records"],
    "warnings": ["Fees are non-refundable"],
    "importantPoints": ["Transaction ID: TXN8877665544", "Amount: INR 1800"]
}


def test_empty_question():
    response = client.post("/api/ask", json={
        "question": "   ",
        "documentText": TEST_DOCUMENT_TEXT,
        "analysis": TEST_ANALYSIS
    })
    print("Test empty question status:", response.status_code)
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "Question cannot be empty" in json_data["error"]
    print("PASS: empty question validation")


def test_empty_document():
    response = client.post("/api/ask", json={
        "question": "What is my transaction number?",
        "documentText": "   ",
        "analysis": TEST_ANALYSIS
    })
    print("Test empty document status:", response.status_code)
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "Document text cannot be empty" in json_data["error"]
    print("PASS: empty document validation")


def test_missing_fields():
    response = client.post("/api/ask", json={
        "question": "What is my name?"
        # missing documentText
    })
    print("Test missing documentText status:", response.status_code)
    assert response.status_code in (400, 422)
    print("PASS: missing fields validation")


def test_valid_question_with_gemini():
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key.strip() in ("", "your_api_key_here"):
        print("Skipping live Gemini test due to missing API key.")
        return

    # Test 1: Valid question present in doc
    response = client.post("/api/ask", json={
        "question": "What is my transaction number?",
        "documentText": TEST_DOCUMENT_TEXT,
        "analysis": TEST_ANALYSIS,
        "language": "English"
    })
    print("Test valid question status:", response.status_code)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "TXN8877665544" in json_data["answer"] or "8877665544" in json_data["answer"]
    assert json_data["source"] == "document"
    print("PASS: valid question response:", json_data["answer"])

    # Test 2: Question whose answer is absent
    response_absent = client.post("/api/ask", json={
        "question": "What is my passport number?",
        "documentText": TEST_DOCUMENT_TEXT,
        "analysis": TEST_ANALYSIS,
        "language": "English"
    })
    print("Test absent question status:", response_absent.status_code)
    assert response_absent.status_code == 200
    json_data_absent = response_absent.json()
    assert json_data_absent["success"] is True
    assert "could not find" in json_data_absent["answer"].lower() or "not" in json_data_absent["answer"].lower()
    print("PASS: absent question response:", json_data_absent["answer"])


if __name__ == "__main__":
    print("Running Ask AccessBridge tests...")
    test_empty_question()
    test_empty_document()
    test_missing_fields()
    test_valid_question_with_gemini()
    print("ALL ASK TESTS PASSED SUCCESSFULLY!")
