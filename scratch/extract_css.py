with open("static/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

found = []
in_block = False
brace_count = 0
current_block = []

# Search for classes related to results dashboard
target_keywords = ['glass-dashboard', 'visual-panel', 'analytics-panel', 'concerns-card', 'care-strategy', 'hologram-heart', 'telemetry-overlay']

for idx, line in enumerate(lines):
    if any(kw in line for kw in target_keywords) or (in_block and brace_count > 0):
        if not in_block:
            in_block = True
            brace_count = 0
            current_block = []
        
        current_block.append(f"{idx+1}: {line}")
        brace_count += line.count('{')
        brace_count -= line.count('}')
        
        if brace_count == 0:
            in_block = False
            found.append("".join(current_block))
            current_block = []

print(f"Found {len(found)} rule blocks:")
for f in found[:20]:
    print(f)
    print("-"*40)
