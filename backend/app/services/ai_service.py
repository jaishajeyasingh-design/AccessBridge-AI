import os
import json
import re
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

SYSTEM_INSTRUCTION = """
AccessBridge AI is an accessibility assistant that transforms complicated documents into simple, understandable and actionable information.

Your task is to analyze the extracted document text and convert it into structured accessibility guidance.

STRICT RULES:
1. Use ONLY information contained in the uploaded document text.
2. NEVER invent facts, deadlines, eligibility requirements, or required documents.
3. If specific information (e.g., deadline, eligibility, documents) is missing from the document, return "Not specified" for string fields or an empty list [] for array fields.
4. Preserve dates and numbers exactly as stated in the document.
5. Identify difficult terminology and explain it simply.
6. Convert instructions into clear, actionable steps.
7. Preserve all warnings, conditions, and important notices.
8. Use simple, direct language suitable for users with limited digital literacy.
9. Return ONLY a single, valid JSON object with NO markdown formatting, NO backticks, and NO extra conversational text.

REQUIRED JSON SCHEMA:
{
  "title": "Title of document or main subject",
  "documentType": "Category (e.g. Education / Scholarship, Government Form, Legal Notice, Utility Bill, General Document)",
  "simpleExplanation": "Plain language explanation of what this document is about and what the user needs to know.",
  "eligibility": ["Criteria 1", "Criteria 2"],
  "deadline": "Exact date or 'Not specified'",
  "requiredDocuments": ["Document 1", "Document 2"],
  "steps": ["Action step 1", "Action step 2"],
  "warnings": ["Warning 1"],
  "importantPoints": ["Important point 1"]
}
"""

def _clean_json_response(raw_text: str) -> str:
    """Strips Markdown backticks and extraneous wrapping from Gemini response."""
    text = raw_text.strip()
    # Remove ```json ... ``` or ``` ... ``` wrappers
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    
    # If starting with ``` or ```json
    if text.startswith('```'):
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
    
    # Extract first { ... } block
    start_idx = text.find('{')
    end_idx = text.rfind('}')
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        return text[start_idx:end_idx+1]

    return text

def _format_fallback_response(title: str, text_excerpt: str, error_msg: str) -> Dict[str, Any]:
    """Generates a safe structured response if AI service is unconfigured or fails."""
    return {
        "title": title or "Document Summary",
        "documentType": "General Document",
        "simpleExplanation": f"Document extracted successfully. AI analysis notice: {error_msg}",
        "eligibility": ["Not specified"],
        "deadline": "Not specified",
        "requiredDocuments": [],
        "steps": ["Review extracted document text"],
        "warnings": [error_msg],
        "importantPoints": ["Original document text has been extracted."]
    }

def analyze_document_text_with_gemini(document_text: str, filename: str = "Document") -> Dict[str, Any]:
    """
    Sends extracted document text to Gemini AI and returns structured accessibility JSON.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or api_key.strip() == "your_api_key_here":
        raise ValueError(
            "GEMINI_API_KEY environment variable is missing or unconfigured. "
            "Please set a valid GEMINI_API_KEY in backend/.env file."
        )

    user_prompt = f"Document Filename: {filename}\n\nDocument Text:\n{document_text}"

    raw_response_text = ""

    # Attempt 1: Try modern google-genai SDK
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config={'system_instruction': SYSTEM_INSTRUCTION, 'temperature': 0.2}
        )
        raw_response_text = response.text
    except Exception as genai_err:
        # Attempt 2: Fallback to google-generativeai SDK
        try:
            import google.generativeai as legacy_genai
            legacy_genai.configure(api_key=api_key)
            model = legacy_genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=SYSTEM_INSTRUCTION
            )
            response = model.generate_content(
                user_prompt,
                generation_config=legacy_genai.types.GenerationConfig(temperature=0.2)
            )
            raw_response_text = response.text
        except Exception as legacy_err:
            raise RuntimeError(f"Gemini API request failed: {str(genai_err)} | Legacy fallback: {str(legacy_err)}")

    if not raw_response_text or not raw_response_text.strip():
        raise RuntimeError("Received empty response from Gemini API.")

    cleaned_json_str = _clean_json_response(raw_response_text)

    try:
        data = json.loads(cleaned_json_str)
    except json.JSONDecodeError as err:
        raise RuntimeError(f"Failed to parse JSON response from Gemini: {str(err)}. Raw output: {raw_response_text[:200]}")

    # Validate / ensure all required fields exist
    required_keys = ["title", "documentType", "simpleExplanation", "eligibility", "deadline", "requiredDocuments", "steps", "warnings", "importantPoints"]
    for key in required_keys:
        if key not in data:
            if key in ["eligibility", "requiredDocuments", "steps", "warnings", "importantPoints"]:
                data[key] = []
            else:
                data[key] = "Not specified"

    return data
