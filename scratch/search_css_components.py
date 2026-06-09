with open(r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction\static\style.css", "r", encoding="utf-8") as f:
    content = f.read()
    for item in ["prediction-luxury-card", "cly-dashboard-container", "cly-main-content"]:
        idx = content.find(item)
        if idx != -1:
            print(f"=== {item} ===")
            print(content[idx:idx+250])
