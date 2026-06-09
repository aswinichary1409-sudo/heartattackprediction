with open(r"C:\Users\aswin\.gemini\antigravity\brain\66cd10f7-d918-4848-9435-1110e0941c1a\.system_generated\tasks\task-700.log", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for line in lines[-50:]:
        print(line, end="")
