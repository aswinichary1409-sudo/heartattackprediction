import shutil
import os

src = r"C:\Users\aswin\.gemini\antigravity\brain\66cd10f7-d918-4848-9435-1110e0941c1a\media__1781013104700.png"
dst = r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction\static\images\3d_anatomical_heart.png"

print("Copying heart image...")
try:
    shutil.copy(src, dst)
    print("Heart image copied successfully!")
    print("Size of copied file:", os.path.getsize(dst), "bytes")
except Exception as e:
    print("Error copying heart image:", e)
