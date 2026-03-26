# Combined Python script: Face detection + Window check
import cv2
import time
from insightface.app import FaceAnalysis
import pygetwindow as gw
import serial

# ---------------- Arduino Setup ----------------
arduino = serial.Serial('COM3', 9600, timeout=1)
time.sleep(2)

def send_alarm(on):
    if on:
        arduino.write(b'1')
    else:
        arduino.write(b'0')

# ---------------- Face Detection Setup ----------------
app = FaceAnalysis(name='buffalo_sc', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(160, 160))

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_FPS, 60)

faces = []
frame_count = 0
scale_x, scale_y = 1, 1
prev_time = time.time()
last_state = None

# ---------------- Allowed Websites ----------------
allowed_sites = [
    "Khan Academy", "Coursera", "edX", "Quizlet", "WolframAlpha",
    "Overleaf", "Grammarly", "Notion", "Trello", "Google Drive",
    "Typing.com", "SparkNotes", "Chegg", "Pomofocus", "Google Docs"
]

while True:
    ret, frame = cap.read()
    if not ret:
        break

    if frame_count % 4 == 0:
        small = cv2.resize(frame, (320, 240))
        faces = app.get(small)
        scale_x = frame.shape[1] / 320
        scale_y = frame.shape[0] / 240

        # ---------------- Check active window ----------------
        try:
            active_win = gw.getActiveWindow()
            active_title = active_win.title if active_win else ""
        except:
            active_title = ""

        window_wrong = not any(site.lower() in active_title.lower() for site in allowed_sites)

        # ---------------- Trigger alarm logic ----------------
        if len(faces) == 0 or window_wrong:
            if last_state != 1:
                send_alarm(True)
                last_state = 1
        else:
            if last_state != 0:
                send_alarm(False)
                last_state = 0

    # Draw faces on frame
    for face in faces:
        box = face.bbox.astype(int)
        x1 = int(box[0] * scale_x)
        y1 = int(box[1] * scale_y)
        x2 = int(box[2] * scale_x)
        y2 = int(box[3] * scale_y)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{face.det_score:.2f}", (x1, y1-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

    # FPS
    curr_time = time.time()
    fps = 1 / (curr_time - prev_time)
    prev_time = curr_time
    cv2.putText(frame, f"FPS: {fps:.1f}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow("Face Detector", frame)
    frame_count += 1
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
arduino.close()