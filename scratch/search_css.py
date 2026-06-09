with open(r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction\static\style.css", "r", encoding="utf-8") as f:
    content = f.read()
    idx = content.find("my-heart-body")
    if idx != -1:
        print(content[idx:idx+300])
    else:
        print("Not found")
