import sys
import os
import json
sys.path.append('backend')
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_translation_english():
    print("Testing POST /api/translate with English target language...")
    payload = {
        "text": "Scholarship Notice 2026. Application deadline is 30 September 2026.",
        "targetLanguage": "English"
    }
    res = client.post("/api/translate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["targetLanguage"] == "English"
    assert "Scholarship Notice" in data["translatedText"]
    print("[OK] English translation shortcut test passed!")

def test_translation_tamil():
    print("Testing POST /api/translate with Tamil target language...")
    sample_analysis = {
        "title": "Scholarship Application Notice",
        "simpleExplanation": "Application deadline is 30 September 2026.",
        "deadline": "30 September 2026"
    }
    payload = {
        "text": json.dumps(sample_analysis),
        "targetLanguage": "Tamil"
    }
    res = client.post("/api/translate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["targetLanguage"] == "Tamil"
    assert "translatedAnalysis" in data or "translatedText" in data
    print("[OK] Tamil translation test passed!")

def test_translation_hindi():
    print("Testing POST /api/translate with Hindi target language...")
    sample_analysis = {
        "title": "Scholarship Application Notice",
        "simpleExplanation": "Application deadline is 30 September 2026.",
        "deadline": "30 September 2026"
    }
    payload = {
        "text": json.dumps(sample_analysis),
        "targetLanguage": "Hindi"
    }
    res = client.post("/api/translate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["targetLanguage"] == "Hindi"
    assert "translatedAnalysis" in data or "translatedText" in data
    print("[OK] Hindi translation test passed!")

def test_translation_invalid_language():
    print("Testing POST /api/translate with invalid target language...")
    payload = {
        "text": "Sample text",
        "targetLanguage": "French"
    }
    res = client.post("/api/translate", json=payload)
    assert res.status_code == 400
    data = res.json()
    assert data["success"] is False
    assert "Invalid targetLanguage" in data["error"]
    print("[OK] Invalid language rejection test passed!")

def test_translation_empty_text():
    print("Testing POST /api/translate with empty text...")
    payload = {
        "text": "   ",
        "targetLanguage": "Tamil"
    }
    res = client.post("/api/translate", json=payload)
    assert res.status_code == 400
    data = res.json()
    assert data["success"] is False
    assert "cannot be empty" in data["error"]
    print("[OK] Empty text rejection test passed!")

if __name__ == "__main__":
    test_translation_english()
    test_translation_tamil()
    test_translation_hindi()
    test_translation_invalid_language()
    test_translation_empty_text()
    print("\n=== ALL TRANSLATION ENDPOINT TESTS PASSED SUCCESSFULLY! ===")
