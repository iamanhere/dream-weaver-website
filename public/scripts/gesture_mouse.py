import cv2
import mediapipe as mp
from pynput.mouse import Controller, Button
from pynput.keyboard import Controller as KBController, Key
import pyautogui
import time
import os
import subprocess

mouse = Controller()
keyboard = KBController()

mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)

screen_w, screen_h = pyautogui.size()

prev_x, prev_y = 0, 0
smoothening = 5

# Gesture flags
palm_triggered = False
fist_triggered = False
scroll_triggered = False
screenshot_triggered = False
volume_triggered = False
brightness_triggered = False

gesture_text = "No Gesture Detected"

cap = cv2.VideoCapture(0)

# -----------------------------
# MAC VOLUME CONTROL
# -----------------------------
def volume_up():
    subprocess.call([
        "osascript",
        "-e",
        "set volume output volume ((output volume of (get volume settings)) + 10)"
    ])

def volume_down():
    subprocess.call([
        "osascript",
        "-e",
        "set volume output volume ((output volume of (get volume settings)) - 10)"
    ])

# -----------------------------
# MAC BRIGHTNESS CONTROL
# -----------------------------
def brightness_up():
    subprocess.call([
        "osascript",
        "-e",
        'tell application "System Events" to key code 144'
    ])

def brightness_down():
    subprocess.call([
        "osascript",
        "-e",
        'tell application "System Events" to key code 145'
    ])

while True:

    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame,1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    result = hands.process(rgb)

    if result.multi_hand_landmarks:

        for hand_landmarks in result.multi_hand_landmarks:

            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # -----------------------------
            # CURSOR MOVEMENT
            # -----------------------------
            index_x = int(hand_landmarks.landmark[8].x * screen_w)
            index_y = int(hand_landmarks.landmark[8].y * screen_h)

            curr_x = prev_x + (index_x - prev_x) / smoothening
            curr_y = prev_y + (index_y - prev_y) / smoothening

            mouse.position = (curr_x, curr_y)
            prev_x, prev_y = curr_x, curr_y

            # -----------------------------
            # FINGER STATUS
            # -----------------------------
            index_ext  = hand_landmarks.landmark[8].y < hand_landmarks.landmark[6].y
            middle_ext = hand_landmarks.landmark[12].y < hand_landmarks.landmark[10].y
            ring_ext   = hand_landmarks.landmark[16].y < hand_landmarks.landmark[14].y
            pinky_ext  = hand_landmarks.landmark[20].y < hand_landmarks.landmark[18].y
            thumb_ext  = hand_landmarks.landmark[4].x < hand_landmarks.landmark[3].x

            # -----------------------------
            # OPEN PALM → DOUBLE CLICK
            # -----------------------------
            if thumb_ext and index_ext and middle_ext and ring_ext and pinky_ext and not palm_triggered:

                mouse.click(Button.left,2)
                gesture_text = "Open Palm → Double Click"
                palm_triggered = True
                time.sleep(0.4)2

            elif not (thumb_ext and index_ext and middle_ext and ring_ext and pinky_ext):

                palm_triggered = False

            # -----------------------------
            # FIST → CLOSE WINDOW
            # -----------------------------
            if not thumb_ext and not index_ext and not middle_ext and not ring_ext and not pinky_ext and not fist_triggered:

                keyboard.press(Key.cmd)
                keyboard.press('w')

                keyboard.release('w')
                keyboard.release(Key.cmd)

                gesture_text = "Fist → Close Window"
                fist_triggered = True

            elif thumb_ext or index_ext or middle_ext or ring_ext or pinky_ext:

                fist_triggered = False

            # -----------------------------
            # SCROLL DOWN
            # -----------------------------
            if index_ext and middle_ext and ring_ext and not pinky_ext and not scroll_triggered:

                pyautogui.scroll(-300)
                gesture_text = "Scroll Down"
                scroll_triggered = True

            # -----------------------------
            # SCROLL UP
            # -----------------------------
            elif not index_ext and middle_ext and ring_ext and pinky_ext and not scroll_triggered:

                pyautogui.scroll(300)
                gesture_text = "Scroll Up"
                scroll_triggered = True

            elif not ((index_ext and middle_ext and ring_ext) or (not index_ext and middle_ext and ring_ext and pinky_ext)):

                scroll_triggered = False

            # -----------------------------
            # SCREENSHOT
            # -----------------------------
            if index_ext and thumb_ext and not middle_ext and not ring_ext and not pinky_ext and not screenshot_triggered:

                filename = f"screenshot_{int(time.time())}.png"
                save_path = os.path.join(os.path.expanduser("~/Desktop"), filename)

                pyautogui.screenshot(save_path)

                gesture_text = "Screenshot Saved"
                screenshot_triggered = True
                time.sleep(0.4)

            elif not (index_ext and thumb_ext and not middle_ext and not ring_ext and not pinky_ext):

                screenshot_triggered = False

            # -----------------------------
            # VOLUME CONTROL
            # -----------------------------
            if index_ext and middle_ext and not ring_ext and not pinky_ext and not volume_triggered:

                volume_up()
                gesture_text = "Volume Up"
                volume_triggered = True
                time.sleep(0.4)

            elif ring_ext and pinky_ext and not index_ext and not middle_ext and not volume_triggered:

                volume_down()
                gesture_text = "Volume Down"
                volume_triggered = True
                time.sleep(0.4)

            else:

                volume_triggered = False

            # -----------------------------
            # BRIGHTNESS CONTROL
            # -----------------------------
            if thumb_ext and pinky_ext and not index_ext and not middle_ext and not ring_ext and not brightness_triggered:

                brightness_up()
                gesture_text = "Brightness Up"
                brightness_triggered = True
                time.sleep(0.4)

            elif thumb_ext and index_ext and not middle_ext and not ring_ext and not pinky_ext and not brightness_triggered:

                brightness_down()
                gesture_text = "Brightness Down"
                brightness_triggered = True
                time.sleep(0.4)

            else:

                brightness_triggered = False

    # -----------------------------
    # DISPLAY TEXT
    # -----------------------------
    cv2.putText(frame, gesture_text, (10,50),
                cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)

    cv2.imshow("Gesture Mouse", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()