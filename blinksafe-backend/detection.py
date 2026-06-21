import os
import time

import cv2
import numpy as np
import mediapipe as mp

# MediaPipe Face Mesh landmark indices for eyes
# Left eye: 6 points (outer, upper-outer, upper-inner, inner, lower-inner, lower-outer)
LEFT_EYE = [362, 385, 387, 263, 373, 380]
# Right eye: 6 points
RIGHT_EYE = [33, 160, 158, 133, 153, 144]

EAR_THRESHOLD = 0.25
ALERT_DURATION = 2.0  # seconds

MODEL_PATH = os.path.join(os.path.dirname(__file__), "face_landmarker.task")


def _ear(landmarks, eye_indices):
    """Compute Eye Aspect Ratio for one eye from 6 landmark points.

    EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
    """
    pts = np.array([(landmarks[i].x, landmarks[i].y) for i in eye_indices])
    vertical_1 = np.linalg.norm(pts[1] - pts[5])
    vertical_2 = np.linalg.norm(pts[2] - pts[4])
    horizontal = np.linalg.norm(pts[0] - pts[3])
    if horizontal == 0:
        return 0.0
    return (vertical_1 + vertical_2) / (2.0 * horizontal)


class DrowsinessDetector:
    def __init__(self):
        options = mp.tasks.vision.FaceLandmarkerOptions(
            base_options=mp.tasks.BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=mp.tasks.vision.RunningMode.IMAGE,
            num_faces=1,
            min_face_detection_confidence=0.5,
            min_face_presence_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        self.landmarker = mp.tasks.vision.FaceLandmarker.create_from_options(options)
        self.eyes_closed_since: float | None = None

    def process_frame(self, frame: np.ndarray) -> dict:
        """Process a BGR frame and return detection result.

        Returns:
            {"state": "SAFE"|"DROWSY"|"ALERT", "ear": float|None}
        """
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = self.landmarker.detect(mp_image)

        if not result.face_landmarks:
            self.eyes_closed_since = None
            return {"state": "SAFE", "ear": None}

        landmarks = result.face_landmarks[0]
        left_ear = _ear(landmarks, LEFT_EYE)
        right_ear = _ear(landmarks, RIGHT_EYE)
        avg_ear = round((left_ear + right_ear) / 2.0, 4)

        now = time.time()

        if avg_ear < EAR_THRESHOLD:
            if self.eyes_closed_since is None:
                self.eyes_closed_since = now
            elapsed = now - self.eyes_closed_since
            state = "ALERT" if elapsed >= ALERT_DURATION else "DROWSY"
        else:
            self.eyes_closed_since = None
            state = "SAFE"

        return {"state": state, "ear": avg_ear}
