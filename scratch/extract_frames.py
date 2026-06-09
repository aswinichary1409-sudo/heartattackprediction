import cv2
import os

video_path = r"static/cly-health-2-animation.mp4"
output_dir = r"scratch/frames"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error opening video file")
    exit()

fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

print(f"Video stats: FPS={fps}, Total Frames={total_frames}, Width={width}, Height={height}")

# Extract frames at different percentages of the video
percentages = [0.0, 0.25, 0.5, 0.75, 0.9]
for p in percentages:
    frame_idx = int(p * total_frames)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
    ret, frame = cap.read()
    if ret:
        out_path = os.path.join(output_dir, f"frame_{int(p*100)}.png")
        cv2.imwrite(out_path, frame)
        print(f"Saved frame at {int(p*100)}% to {out_path}")
    else:
        print(f"Failed to read frame at {int(p*100)}%")

cap.release()
print("Frame extraction complete.")
