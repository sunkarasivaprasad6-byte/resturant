from PIL import Image
import os

os.makedirs('public/menu_assets', exist_ok=True)
os.makedirs('public/menu_assets/categories', exist_ok=True)
os.makedirs('public/menu_assets/dishes', exist_ok=True)
os.makedirs('public/menu_assets/banners', exist_ok=True)

# 1. Load references
dim = Image.open('reference/desktop_menu_reference.jpg')
mim = Image.open('reference/mobile_menu_reference.png')
dw, dh = dim.size
mw, mh = mim.size

print(f'Desktop: {dw}x{dh}, Mobile: {mw}x{mh}')

# 2. Extract Restaurant Logo
# In Desktop: (42, 6, 235, 62)
logo = dim.crop((42, 6, 235, 62))
logo.save('public/menu_assets/restaurant_logo.png')

# 3. Extract Menu Header Biryani image (Desktop top right)
# (675, 75, 1024, 215)
header_biryani = dim.crop((680, 75, 1024, 212))
header_biryani.save('public/menu_assets/menu_header_biryani.png')

# 4. Extract Category circular images from desktop reference
# In inspect_categories.png (y=140..220 in dim)
# Categories centers X in desktop ref:
# ALL: x ≈ 57
# Biryani: x ≈ 142
# Chicken Special: x ≈ 217
# Paneer Special: x ≈ 292
# Mushroom Special: x ≈ 368
# Egg Special: x ≈ 445
# Veg Special: x ≈ 522
# Chinese: x ≈ 605
# Starters: x ≈ 682
# Combos: x ≈ 765
# Desserts: x ≈ 848
# Beverages: x ≈ 930
# y range for circle: y ≈ 152..206 (h ≈ 54px, w ≈ 54px)

categories = [
    ('biryani', 142),
    ('chicken_special', 217),
    ('paneer_special', 292),
    ('mushroom_special', 368),
    ('egg_special', 445),
    ('veg_special', 522),
    ('chinese', 605),
    ('starters', 682),
    ('combos', 765),
    ('desserts', 848),
    ('beverages', 930),
]

for cat_name, cx in categories:
    cy = 178
    r = 27
    crop = dim.crop((cx - r, cy - r, cx + r, cy + r))
    crop.save(f'public/menu_assets/categories/{cat_name}.png')

print('Categories cropped')

# 5. Extract Food Card Dish Images from Mobile Reference (which has high-res crisp card images!)
# In Mobile (460, 1024):
# 2 columns of cards:
# Col 1: x ≈ 34..226 (w ≈ 192)
# Col 2: x ≈ 234..426 (w ≈ 192)
# Let's inspect the cards in mobile reference:
# Row 1: y ≈ 318..395 (Chicken Biryani, Mutton Biryani)
# Row 2: y ≈ 400..480 (Egg Biryani, Veg Biryani)
# Row 3: y ≈ 485..565 (Chicken Lollipop, Chicken Chilli)
# Row 4: y ≈ 570..650 (Chicken 65, Chicken Manchurian)
# Row 5: y ≈ 655..735 (Masala Paneer, Paneer Chilli)
# Row 6: y ≈ 740..820 (Mushroom Chilli, Egg Kadhi)
# Row 7: y ≈ 825..905 (Veg Manchurian, Flavours Mood)

mobile_dishes = [
    ('chicken_biryani', (35, 318, 226, 396)),
    ('mutton_biryani', (234, 318, 426, 396)),
    ('egg_biryani', (35, 401, 226, 479)),
    ('veg_biryani', (234, 401, 426, 479)),
    ('chicken_lollipop', (35, 485, 226, 563)),
    ('chicken_chilli', (234, 485, 426, 563)),
    ('chicken_65', (35, 570, 226, 648)),
    ('chicken_manchurian', (234, 570, 426, 648)),
    ('masala_paneer', (35, 655, 226, 733)),
    ('paneer_chilli', (234, 655, 426, 733)),
    ('mushroom_chilli', (35, 740, 226, 818)),
    ('egg_kadhi', (234, 740, 426, 818)),
    ('veg_manchurian', (35, 825, 226, 903)),
]

for dish_name, box in mobile_dishes:
    crop = mim.crop(box)
    crop.save(f'public/menu_assets/dishes/{dish_name}.png')

print('Dishes cropped')

# 6. Extract Promo Banners from Desktop Reference
# y ≈ 565..625 in dim (1024, 682)
# Banner 1: Combos (x ≈ 30..345)
# Banner 2: Chinese Specials (x ≈ 355..670)
# Banner 3: Sweet Endings (x ≈ 680..995)
b1 = dim.crop((30, 560, 345, 626))
b1.save('public/menu_assets/banners/combos.png')

b2 = dim.crop((355, 560, 670, 626))
b2.save('public/menu_assets/banners/chinese_specials.png')

b3 = dim.crop((680, 560, 995, 626))
b3.save('public/menu_assets/banners/sweet_endings.png')

# 7. Extract Sticky Cart Thumbnail
# In dim: (34, 636, 80, 676)
cart_thumb = dim.crop((34, 636, 82, 678))
cart_thumb.save('public/menu_assets/cart_thumb.png')

print('Banners and Cart thumb cropped successfully!')
