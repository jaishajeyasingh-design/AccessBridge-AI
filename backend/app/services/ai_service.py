import os
import json
import re
from typing import Dict, Any, List
from pathlib import Path
from dotenv import load_dotenv

# Ensure backend/.env or root .env is loaded regardless of working directory
_env_file = Path(__file__).resolve().parent.parent.parent / ".env"
if _env_file.exists():
    load_dotenv(dotenv_path=_env_file)
else:
    load_dotenv()

SYSTEM_INSTRUCTION = """
AccessBridge AI is an accessibility assistant that transforms complicated documents into simple, understandable and actionable information.

Your task is to analyze the extracted document text and convert it into structured accessibility guidance.

RULES FOR GUIDANCE EXTRACTION:
1. Identify the purpose of the document (e.g. Payment Receipt / Confirmation, Scholarship Notice, Government Form, Legal Notice, Utility Bill, General Document).
2. For payment or transaction documents, explicitly extract:
   - Payment / transaction status (e.g. "Payment Successful", "Confirmed", "Pending", "Failed") if explicitly stated.
   - Transaction, reference, or application numbers if present.
   - Payment amount and currency if present.
   - Payment date if present.
3. For "steps", ALWAYS provide clear, actionable steps for the user:
   - If the document lists future actions, deadlines, or submission requirements, list them in sequential order.
   - If the document is a completed payment receipt, confirmation slip, or informative notice, provide 2 practical, user-friendly steps based on the document (e.g. "Keep this payment receipt for your records", "Use reference / application number XYZ to verify status on the official portal if needed").
   - NEVER return an empty list [] for "steps" if text was extracted from the document.
4. For "importantPoints", include 2-4 concise, key facts explicitly found in the document (e.g. Amount paid, Transaction ID, Application number, Payment status, Subject/Category).
5. For "deadline", if an explicit date or deadline is stated in the document, return it. If no deadline exists in the document, return "Not specified in document".
6. For "warnings", include explicit notices, penalties, conditions, or non-refundable notes found in the document (e.g. "Fees are non-refundable"). If no warnings exist in the document, return [].
7. For "eligibility" and "requiredDocuments", list criteria or documents if explicitly present in the document. If not present, return [].
8. NEVER invent facts, deadlines, or numbers. Preserve exact dates, amounts, reference numbers, application numbers, URLs, and proper names.
9. Return ONLY a single, valid JSON object with NO markdown formatting, NO backticks, and NO extra conversational text.

REQUIRED JSON SCHEMA:
{
  "title": "Title of document or main subject",
  "documentType": "Category (e.g. Education / Scholarship, Government Form, Legal Notice, Utility Bill, General Document)",
  "simpleExplanation": "Plain language explanation of what this document is about and what the user needs to know.",
  "eligibility": ["Criteria 1"],
  "deadline": "Exact date or 'Not specified in document'",
  "requiredDocuments": ["Document 1"],
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
        models_to_try = [
            'gemini-3.6-flash',
            'gemini-2.5-flash',
            'gemini-3.5-flash-lite',
            'gemini-2.5-flash-lite',
        ]
        last_error = None
        for mod in models_to_try:
            try:
                response = client.models.generate_content(
                    model=mod,
                    contents=user_prompt,
                    config={'system_instruction': SYSTEM_INSTRUCTION, 'temperature': 0.2}
                )
                raw_response_text = response.text
                if raw_response_text and raw_response_text.strip():
                    break
            except Exception as m_err:
                last_error = m_err
                continue
        if not raw_response_text and last_error:
            raise last_error
    except Exception as genai_err:
        # Attempt 2: Fallback to google-generativeai SDK
        try:
            import google.generativeai as legacy_genai
            legacy_genai.configure(api_key=api_key)
            model = legacy_genai.GenerativeModel(
                model_name='gemini-3.6-flash',
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

    # Validate / ensure all required fields exist and have correct types
    array_keys = ["eligibility", "requiredDocuments", "steps", "warnings", "importantPoints"]
    string_keys = ["title", "documentType", "simpleExplanation", "deadline"]

    for key in string_keys:
        if key not in data or not isinstance(data[key], str):
            data[key] = str(data.get(key, "")) if data.get(key) is not None else "Not specified"

    for key in array_keys:
        if key not in data or not isinstance(data[key], list):
            if isinstance(data.get(key), str) and data[key].strip():
                data[key] = [data[key].strip()]
            else:
                data[key] = []
        else:
            # Clean array elements to strings
            data[key] = [str(item).strip() for item in data[key] if item and str(item).strip()]

    # Fallback if steps list is empty
    if not data["steps"]:
        data["steps"] = [
            "Keep a copy of this document for your official records.",
            "Verify reference numbers or application details on the official portal if required."
        ]

    return data


LANGUAGE_MAP = {
    "en": "English",
    "english": "English",
    "ta": "Tamil",
    "tamil": "Tamil",
    "hi": "Hindi",
    "hindi": "Hindi",
    "te": "Telugu",
    "telugu": "Telugu",
    "ml": "Malayalam",
    "malayalam": "Malayalam",
}

def translate_content_with_gemini(text: str, target_language: str) -> Dict[str, Any]:
    """
    Translates document text or structured analysis JSON into target_language (English, Tamil, Hindi, Telugu, Malayalam).
    Preserves exact dates, deadlines, numbers, monetary amounts, names, URLs, and document names.
    """
    if not text or not text.strip():
        raise ValueError("Field 'text' cannot be empty.")

    target_lang_clean = target_language.strip()
    target_lang_lower = target_lang_clean.lower()

    mapped_lang = LANGUAGE_MAP.get(target_lang_lower)
    if not mapped_lang:
        raise ValueError(
            f"Unsupported or missing targetLanguage '{target_language}'. "
            f"Supported languages: English, Tamil, Hindi, Telugu, Malayalam (or codes: en, ta, hi, te, ml)."
        )

    # 1. English shortcut optimization - do not call Gemini API unnecessarily
    if mapped_lang == "English":
        try:
            parsed = json.loads(text)
            return {
                "success": True,
                "targetLanguage": "English",
                "translatedText": text,
                "translatedAnalysis": parsed
            }
        except Exception:
            return {
                "success": True,
                "targetLanguage": "English",
                "translatedText": text
            }

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() in ("", "your_api_key_here"):
        raise ValueError(
            "GEMINI_API_KEY environment variable is missing or unconfigured. "
            "Please set a valid GEMINI_API_KEY in backend/.env file."
        )

    is_json = False
    json_obj = None
    try:
        json_obj = json.loads(text)
        is_json = True
    except Exception:
        is_json = False

    if is_json and isinstance(json_obj, dict):
        user_prompt = f"Target Language: {mapped_lang}\n\nJSON Content to Translate:\n{json.dumps(json_obj, ensure_ascii=False)}"
        system_instruction = f"""
AccessBridge AI Multilingual Translator.
Your task is to translate all text content inside the provided JSON into {mapped_lang}.

CRITICAL RULES:
1. Translate simple explanations, titles, action steps, eligibility requirements, document labels, warnings, and important points into natural, clear, culturally accurate {mapped_lang}.
2. PRESERVE EXACTLY WITHOUT ALTERATION OR NUMERAL TRANSLITERATION:
   - All dates and deadlines (e.g. "30 September 2026", "10 October 2026")
   - All numbers, percentages, and monetary amounts (e.g. "INR 1800", "10MB", "50%")
   - Proper names, official organization names, URLs, reference numbers
   - Document names (e.g. "Aadhaar Card", "Income Certificate", "GATE 2026")
3. Do NOT invent, remove, or alter any facts, steps, or requirements.
4. Return ONLY a single valid JSON object with the exact same keys and structure.
5. Do NOT include markdown backticks ```json ... ``` or extra conversational text.
"""
    else:
        user_prompt = f"Target Language: {mapped_lang}\n\nText to Translate:\n{text}"
        system_instruction = f"""
AccessBridge AI Multilingual Translator.
Your task is to translate the provided document text into {mapped_lang}.

CRITICAL RULES:
1. Translate text into clear, simple, accessible {mapped_lang}.
2. PRESERVE EXACTLY WITHOUT ALTERATION OR NUMERAL TRANSLITERATION:
   - All dates and deadlines (e.g. "30 September 2026", "10 October 2026")
   - All numbers, percentages, and monetary amounts (e.g. "INR 1800", "10MB", "50%")
   - Proper names, official organization names, URLs, reference numbers
   - Document names (e.g. "Aadhaar Card", "Income Certificate", "GATE 2026")
3. Do NOT invent, remove, or alter any facts.
4. Return ONLY the translated text without markdown wrappers or conversational text.
"""

    raw_response_text = ""

    # Attempt modern google-genai SDK first with fallback models
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        models_to_try = ['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite']
        last_err = None
        for mod in models_to_try:
            try:
                response = client.models.generate_content(
                    model=mod,
                    contents=user_prompt,
                    config={'system_instruction': system_instruction, 'temperature': 0.1}
                )
                raw_response_text = response.text
                if raw_response_text and raw_response_text.strip():
                    break
            except Exception as m_err:
                last_err = m_err
                continue
        if not raw_response_text and last_err:
            raise last_err
    except Exception as genai_err:
        try:
            import google.generativeai as legacy_genai
            legacy_genai.configure(api_key=api_key)
            model = legacy_genai.GenerativeModel(
                model_name='gemini-3.5-flash-lite',
                system_instruction=system_instruction
            )
            response = model.generate_content(
                user_prompt,
                generation_config=legacy_genai.types.GenerationConfig(temperature=0.1)
            )
            raw_response_text = response.text
        except Exception as legacy_err:
            raise RuntimeError(f"Gemini Translation failed: {str(genai_err)} | Legacy fallback: {str(legacy_err)}")

    if not raw_response_text or not raw_response_text.strip():
        raise RuntimeError(f"Received empty translation response from Gemini for language {mapped_lang}.")

    if is_json:
        cleaned_json_str = _clean_json_response(raw_response_text)
        try:
            translated_analysis = json.loads(cleaned_json_str)
            return {
                "success": True,
                "targetLanguage": mapped_lang,
                "translatedText": cleaned_json_str,
                "translatedAnalysis": translated_analysis
            }
        except json.JSONDecodeError:
            return {
                "success": True,
                "targetLanguage": mapped_lang,
                "translatedText": raw_response_text
            }
    else:
        return {
            "success": True,
            "targetLanguage": mapped_lang,
            "translatedText": raw_response_text.strip()
        }


ASK_SYSTEM_INSTRUCTION = """You are AccessBridge AI's document question-answering assistant.

Answer ONLY using information contained in the provided document text and structured analysis.

Do not use outside knowledge.
Do not guess.
Do not invent missing information.

If the answer is not present in the document, clearly say:
'I could not find that information in the uploaded document.'

Preserve exact:
- dates
- amounts
- transaction numbers
- enrollment IDs
- application numbers
- names
- URLs

Give concise, easy-to-understand answers suitable for users with limited digital literacy."""


def ask_question_about_document_with_gemini(
    question: str,
    document_text: str,
    analysis: Dict[str, Any] = None,
    language: str = "English"
) -> Dict[str, Any]:
    """
    Answers natural-language user questions strictly grounded in the extracted document text and analysis.
    """
    if not question or not question.strip():
        raise ValueError("Question cannot be empty.")

    if not document_text or not document_text.strip():
        raise ValueError("Document text cannot be empty.")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() in ("", "your_api_key_here"):
        raise ValueError(
            "GEMINI_API_KEY environment variable is missing or unconfigured. "
            "Please set a valid GEMINI_API_KEY in backend/.env file."
        )

    target_lang_clean = (language or "English").strip().lower()
    mapped_lang = LANGUAGE_MAP.get(target_lang_clean, "English")

    system_instruction = ASK_SYSTEM_INSTRUCTION
    if mapped_lang != "English":
        system_instruction += f"\n\nIMPORTANT: Answer the user's question in {mapped_lang} while still grounding the answer strictly in the provided document text and structured analysis."

    analysis_str = json.dumps(analysis, ensure_ascii=False) if analysis else "{}"
    user_prompt = f"""Structured Document Analysis:
{analysis_str}

Extracted Document Text:
{document_text}

User Question:
{question}"""

    raw_response_text = ""

    # Attempt 1: Try modern google-genai SDK
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        models_to_try = [
            'gemini-3.6-flash',
            'gemini-2.5-flash',
            'gemini-3.5-flash-lite',
            'gemini-2.5-flash-lite',
        ]
        last_err = None
        for mod in models_to_try:
            try:
                response = client.models.generate_content(
                    model=mod,
                    contents=user_prompt,
                    config={'system_instruction': system_instruction, 'temperature': 0.1}
                )
                raw_response_text = response.text
                if raw_response_text and raw_response_text.strip():
                    break
            except Exception as m_err:
                last_err = m_err
                continue
        if not raw_response_text and last_err:
            raise last_err
    except Exception as genai_err:
        # Attempt 2: Fallback to google-generativeai SDK
        try:
            import google.generativeai as legacy_genai
            legacy_genai.configure(api_key=api_key)
            model = legacy_genai.GenerativeModel(
                model_name='gemini-2.5-flash',
                system_instruction=system_instruction
            )
            response = model.generate_content(
                user_prompt,
                generation_config=legacy_genai.types.GenerationConfig(temperature=0.1)
            )
            raw_response_text = response.text
        except Exception as legacy_err:
            raise RuntimeError(f"Gemini Q&A request failed: {str(genai_err)} | Legacy fallback: {str(legacy_err)}")

    if not raw_response_text or not raw_response_text.strip():
        raise RuntimeError("Received empty response from Gemini Q&A API.")

    return {
        "success": True,
        "answer": raw_response_text.strip(),
        "source": "document"
    }

