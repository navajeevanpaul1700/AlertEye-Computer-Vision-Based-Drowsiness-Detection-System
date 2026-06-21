import base64
import json

import cv2
import numpy as np
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from detection import DrowsinessDetector

app = FastAPI(title="BlinkSafe Backend")
PORT = 8001

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    detector = DrowsinessDetector()

    try:
        while True:
            data = await ws.receive_text()

            # Strip data-URL prefix if present (e.g. "data:image/jpeg;base64,...")
            if "," in data:
                data = data.split(",", 1)[1]

            img_bytes = base64.b64decode(data)
            np_arr = np.frombuffer(img_bytes, dtype=np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                await ws.send_text(json.dumps({"state": "SAFE", "ear": None}))
                continue

            result = detector.process_frame(frame)
            await ws.send_text(json.dumps(result))

    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
