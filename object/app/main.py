import logging
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from prometheus_fastapi_instrumentator import Instrumentator

from . import model_loader, schemas

# --- Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_PREFIX = "/api"

# --- Lifespan (MODEL LOAD FIXED) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Object Detection Service...")

    try:
        model_loader.load_model()   # ✅ THIS IS THE FIX
        logger.info("✅ Model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Model loading failed: {e}")

    yield

    logger.info("🛑 Shutting down Object Detection Service...")


# --- App ---
app = FastAPI(
    title="Object Detection API",
    version="1.0",
    root_path=API_PREFIX,
    lifespan=lifespan
)

# --- Prometheus ---
Instrumentator().instrument(app).expose(app)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health ---
@app.get("/health")
def health():
    return {"status": "ok" if model_loader.model else "loading"}


# --- DETECTION API ---
@app.post("/object")
async def detect_objects(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Upload image only")

    if model_loader.model is None:
        raise HTTPException(503, "Model not loaded")

    try:
        image_bytes = await file.read()

        results = model_loader.detect_objects(image_bytes)

        return {
            "filename": file.filename,
            "objects": results
        }

    except Exception as e:
        logger.error(f"Detection error: {e}")
        raise HTTPException(500, str(e))