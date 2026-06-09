import os
import re

templates_dir = r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction\templates"
for filename in os.listdir(templates_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(templates_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            # find all img tags
            img_tags = re.findall(r'<img[^>]+>', content)
            if img_tags:
                print(f"--- {filename} ---")
                for img in img_tags:
                    print(img)
            # find any other references with url_for or URLs
            other_refs = re.findall(r'(?:src|href|background)=["\']([^"\']+\.(?:png|jpg|jpeg|gif|svg|mp4))["\']', content)
            if other_refs:
                print(f"Other file refs in {filename}:", other_refs)
