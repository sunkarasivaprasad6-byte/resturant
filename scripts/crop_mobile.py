from PIL import Image

im = Image.open('reference/WhatsApp Image 2026-09-18 at 5.39.12 PM.jpeg')
w, h = im.size
print(f'Mobile reference dimensions: {w} x {h}')

# Let's see the layout:
# It has 2 rows and 3 columns of phone screens:
# Col 1: 0..w/3, Col 2: w/3..2w/3, Col 3: 2w/3..w
# Row 1: 0..h/2, Row 2: h/2..h
col_w = w // 3
row_h = h // 2

# Row 1:
# Panel 1: 1. INTRO
# Panel 2: 2. AROMA
# Panel 3: 3. AUTHENTIC
# Row 2:
# Panel 4: 4. JOURNEY
# Panel 5: 5. CUISINE
# Panel 6: 6. FINAL HERO

crops = [
    ('mobile_panel_1_intro', (0, 0, col_w, row_h)),
    ('mobile_panel_2_aroma', (col_w, 0, 2*col_w, row_h)),
    ('mobile_panel_3_authentic', (2*col_w, 0, w, row_h)),
    ('mobile_panel_4_journey', (0, row_h, col_w, h)),
    ('mobile_panel_5_cuisine', (col_w, row_h, 2*col_w, h)),
    ('mobile_panel_6_final_hero', (2*col_w, row_h, w, h)),
]

for name, box in crops:
    crop = im.crop(box)
    crop.save(f'scripts/analysis/{name}.png')
    print(f'Saved {name}: {box}')
