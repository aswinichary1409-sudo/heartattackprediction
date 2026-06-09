import os

search_dir = r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction"
keywords = ["flowchart", "flow-chart", "diagram", "chart", "pie"]

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith((".html", ".js", ".py", ".md")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    for kw in keywords:
                        if kw in content.lower():
                            # Print matching file and a snippet
                            idx = content.lower().find(kw)
                            start = max(0, idx - 40)
                            end = min(len(content), idx + 60)
                            snippet = content[start:end].replace('\n', ' ')
                            print(f"{file} matches '{kw}': ... {snippet} ...")
            except:
                pass
