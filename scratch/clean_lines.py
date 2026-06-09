import re

with open('scratch/original_index.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

cleaned_lines = []
for line in lines:
    # Match pattern like "123: text" or "  123: text"
    m = re.match(r'^\s*\d+:\s*(.*)', line)
    if m:
        cleaned_lines.append(m.group(1) + '\n')
    else:
        cleaned_lines.append(line)

with open('scratch/cleaned_original_index.html', 'w', encoding='utf-8') as out:
    out.writelines(cleaned_lines)

print("Original index.html cleaned and saved!")
