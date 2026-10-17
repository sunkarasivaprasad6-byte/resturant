from PIL import Image

im5 = Image.open('reference/WhatsApp Image 2026-09-18 at 5.40.27 PM.jpeg')
print(f'=== Ref 5 Component Breakdown ({im5.size}) ===')

def scan_h_range(y_start, y_end):
    bright_xs = []
    for y in range(y_start, y_end):
        for x in range(100, 900):
            r, g, b = im5.getpixel((x, y))[:3]
            if r > 150 or (r > 120 and g > 100):
                bright_xs.append(x)
    if bright_xs:
        cx = sum(bright_xs)/len(bright_xs)
        return min(bright_xs), max(bright_xs), cx
    return None, None, None

# 1. Eyebrow: A TASTE BEYOND ORDINARY
x1, x2, cx = scan_h_range(160, 180)
print(f'Eyebrow: y=160..180, x={x1}..{x2}, center X={cx:.1f}')

# 2. Headline Line 1: It\'s not just
x1, x2, cx = scan_h_range(200, 265)
print(f'Headline Line 1: y=200..265, x={x1}..{x2}, center X={cx:.1f}')

# 3. Headline Line 2: Food, It\'s an
x1, x2, cx = scan_h_range(270, 345)
print(f'Headline Line 2: y=270..345, x={x1}..{x2}, center X={cx:.1f}')

# 4. Headline Line 3: Experience.
x1, x2, cx = scan_h_range(345, 470)
print(f'Headline Line 3: y=345..470, x={x1}..{x2}, center X={cx:.1f}')

# 5. Divider
x1, x2, cx = scan_h_range(490, 520)
print(f'Divider: y=490..520, x={x1}..{x2}, center X={cx:.1f}')

# 6. Paragraph: From aromatic biryanis...
x1, x2, cx = scan_h_range(540, 615)
print(f'Paragraph: y=540..615, x={x1}..{x2}, center X={cx:.1f}')

# 7. Button 1: EXPLORE MENU ->
x1, x2, cx = scan_h_range(640, 715)
print(f'Buttons: y=640..715, x={x1}..{x2}, center X={cx:.1f}')
