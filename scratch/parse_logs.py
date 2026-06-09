import json

log_path = r"C:\Users\aswin\.gemini\antigravity\brain\66cd10f7-d918-4848-9435-1110e0941c1a\.system_generated\logs\transcript.jsonl"

steps_found = []
with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get('content', '')
            if 'obesity' in content.lower() or 'smoking' in content.lower():
                step = data.get('step_index', '?')
                type_ = data.get('type', '')
                steps_found.append((step, type_))
        except Exception as e:
            pass

print("Steps containing obesity or smoking:", steps_found)
