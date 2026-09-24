# AccessBridge AI

AccessBridge AI is an accessibility transformation platform designed to empower users by simplifying complex documents, extracting actionable steps, providing multilingual translations, and offering voice assistance.

## Core Workflow

Upload → Extract → Understand → Transform → Act → Listen

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Python, FastAPI, Uvicorn
- **AI**: Gemini API (planned)
- **Document Processing**: PDF Text Extraction & OCR (planned)
- **Voice**: Browser Web Speech API (planned)

## Current Development Status

- **Stage**: Initial MVP Foundation & Skeleton
- **Completed**:
  - Root project structure setup
  - React + TypeScript + Vite frontend skeleton configured with Tailwind CSS
  - FastAPI backend skeleton configured with `/api/health` endpoint and CORS middleware
  - Environment templates (`.env.example`) and `.gitignore` setup

---

## Local Setup Instructions

### Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.9+ recommended)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The API will be available at `http://localhost:8000`. Health check: `http://localhost:8000/api/health`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be running at `http://localhost:5173`.
