from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analyze import router as analyze_router

app = FastAPI(
    title="AccessBridge AI API",
    description="Backend API for AccessBridge AI platform",
    version="0.1.0",
)

# Configure CORS for local development
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze_router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "AccessBridge AI",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
