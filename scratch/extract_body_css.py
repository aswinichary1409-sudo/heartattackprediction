with open("static/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if ".my-heart-body" in line:
        print(f"Line {idx+1}: {line.strip()}")
        # print subsequent lines
        for j in range(1, 15):
            print(f"Line {idx+1+j}: {lines[idx+j].strip()}")
        break
