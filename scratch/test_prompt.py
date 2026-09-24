import os
import json
import sys
sys.path.append('backend')
from dotenv import load_dotenv
from pathlib import Path
from google import genai

env_file = Path('backend/.env')
load_dotenv(dotenv_path=env_file, override=True)
key = os.getenv('GEMINI_API_KEY')

client = genai.Client(api_key=key)

payment_doc_text = """
GATE 2026 Payment Receipt
Transaction ID: TXN987654321
Application No: GATE2026-881234
Payment Date: 22 September 2026
Category: General
Amount Paid: INR 1800
Status: Payment Successful / Confirmed
Note: Fees are non-refundable. Please keep this receipt for future reference.
"""

sys_inst = """
AccessBridge AI is an accessibility assistant that transforms complicated documents into simple, understandable and actionable information.

Your task is to analyze the document text and convert it into structured accessibility guidance.

RULES FOR GUIDANCE EXTRACTION:
1. Identify the purpose of the document (e.g. Payment Receipt / Confirmation, Scholarship Notice, Government Form, Legal Notice, Utility Bill).
2. For payment or transaction documents, explicitly extract:
   - Payment status (e.g. Payment Successful / Confirmed)
   - Transaction/Application reference numbers
   - Payment amount and currency
   - Payment date
3. For "steps", ALWAYS provide clear, actionable steps for the user:
   - If the document lists future actions or submission requirements, list them in order.
   - If the document is a completed receipt, confirmation, or notice, provide 2 practical record-keeping steps based on the document (e.g. "Keep this payment receipt for your records", "Use Application No GATE2026-881234 to track status on the official portal if required").
   - NEVER return an empty list [] for "steps" if text was extracted.
4. For "importantPoints", include 2-4 concise, key facts explicitly found in the document (e.g. Amount paid, Transaction ID, Payment status, Date).
5. For "deadline", if a date is stated return it. If no deadline exists, return "Not specified in document".
6. For "warnings", include explicit notices (e.g. "Fees are non-refundable"). If none, return [].
7. For "eligibility" and "requiredDocuments", list them if present; if not present, return [].
8. NEVER invent facts or dates. Preserve exact numbers, dates, IDs, amounts, and names.
9. Return ONLY a single valid JSON object.

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

models_to_try = ['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite']
res_text = ""
for m in models_to_try:
    try:
        res = client.models.generate_content(
            model=m,
            contents=f'Analyze document:\n{payment_doc_text}',
            config={'system_instruction': sys_inst, 'temperature': 0.1}
        )
        res_text = res.text
        if res_text:
            print(f"SUCCESS using model {m}!")
            break
    except Exception as e:
        print(f"Model {m} failed: {e}")
        continue

print("AI PROMPT TEST OUTPUT:")
print(res_text)
