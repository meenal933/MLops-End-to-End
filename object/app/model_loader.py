import logging
from io import BytesIO
from PIL import Image
import torch
import numpy as np
from ultralytics import YOLO

logger = logging.getLogger(__name__)

# --- Config ---
MODEL_NAME = "yolov8n.pt"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
CONFIDENCE_THRESHOLD = 0.4

# --- Global model ---
model = None


# ✅ LOAD MODEL
def load_model():
    global model

    if model is not None:
        logger.info("Model already loaded.")
        return

    try:
        logger.info(f"Loading YOLO model on {DEVICE}...")
        model = YOLO(MODEL_NAME)
        logger.info("Model loaded successfully.")
    except Exception as e:
        logger.error(f"Model loading failed: {e}")
        model = None


# ✅ DETECTION
def detect_objects(image_bytes: bytes):
    global model

    if model is None:
        return [{"error": "Model not loaded"}]

    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(image)

        results = model.predict(
            source=img_np,
            conf=CONFIDENCE_THRESHOLD,
            device=DEVICE,
            verbose=False
        )

        output = []

        if results and results[0].boxes is not None:
            r = results[0]

            for box, score, cls in zip(
                r.boxes.xyxy.cpu().numpy(),
                r.boxes.conf.cpu().numpy(),
                r.boxes.cls.cpu().numpy().astype(int)
            ):
                output.append({
                    "label": r.names[int(cls)],
                    "score": float(score),
                    "box": [int(x) for x in box]
                })

        return output

    except Exception as e:
        logger.error(f"Detection failed: {e}")
        return [{"error": str(e)}]