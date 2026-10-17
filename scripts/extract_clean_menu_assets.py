import os
from PIL import Image

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

ensure_dir('public/menu_assets/dishes')
ensure_dir('public/menu_assets/categories')
ensure_dir('public/menu_assets/hero')

ref2 = Image.open('reference/mobile_menu_reference_v2.png').convert('RGB')
ref1 = Image.open('reference/user_uploaded_reference.png').convert('RGB')

# 1. Hero Biryani Pot
hero_biryani = ref2.crop((236, 92, 455, 215))
for y in range(hero_biryani.size[1]):
    for x in range(12):
        hero_biryani.putpixel((x, y), (10, 5, 2))
hero_biryani.save('public/menu_assets/hero/hero_biryani_isolated.png')
hero_biryani.save('public/menu_assets/menu_header_biryani.png')

# 2. Categories
cat_boxes = {
    'biryani': (86, 222, 134, 270),
    'chicken_special': (148, 222, 196, 270),
    'paneer_special': (210, 222, 258, 270),
    'mushroom_special': (272, 222, 320, 270),
    'egg_special': (334, 222, 382, 270),
    'veg_special': (396, 222, 444, 270)
}

for name, box in cat_boxes.items():
    cat_img = ref2.crop(box)
    cat_img.save(f'public/menu_assets/categories/{name}.png')

if os.path.exists('reference/desktop_menu_reference.jpg'):
    dt = Image.open('reference/desktop_menu_reference.jpg').convert('RGB')
    dt_cats = {
        'chinese': (582, 228, 628, 274),
        'starters': (662, 228, 708, 274),
        'combos': (742, 228, 788, 274),
        'desserts': (822, 228, 868, 274),
        'beverages': (902, 228, 948, 274)
    }
    for name, box in dt_cats.items():
        c_img = dt.crop(box)
        c_img.save(f'public/menu_assets/categories/{name}.png')

# 3. Clean Card Food
def clean_dish_crop(crop_box, save_path):
    crop = ref2.crop(crop_box).copy()
    w, h = crop.size
    
    # Inpaint badge in top-left (0..42, 0..38)
    patch_badge = crop.crop((46, 0, 88, 38))
    crop.paste(patch_badge, (0, 0))
    
    # Inpaint heart in top-right (w-42..w, 0..38)
    patch_heart = crop.crop((w - 88, 0, w - 46, 38))
    crop.paste(patch_heart, (w - 42, 0))
    
    # Top border blend
    for x in range(w):
        for y in range(3):
            crop.putpixel((x, y), (14, 8, 4))
            
    crop.save(save_path)

# Chicken Biryani
clean_dish_crop((16, 452, 224, 542), 'public/menu_assets/dishes/chicken_biryani.png')
# Mutton Biryani
clean_dish_crop((238, 452, 446, 542), 'public/menu_assets/dishes/mutton_biryani.png')
# Egg Biryani
clean_dish_crop((16, 702, 224, 792), 'public/menu_assets/dishes/egg_biryani.png')
# Veg Biryani
clean_dish_crop((238, 702, 446, 792), 'public/menu_assets/dishes/veg_biryani.png')

# 4. Other Dishes from ref1
ref1_dishes = {
    'chicken_lollipop': (34, 500, 134, 574),
    'chicken_chilli': (244, 500, 344, 574),
    'chicken_65': (34, 590, 134, 664),
    'chicken_manchurian': (244, 590, 344, 664),
    'masala_paneer': (34, 678, 134, 752),
    'paneer_chilli': (244, 678, 344, 752),
    'mushroom_chilli': (34, 768, 134, 842),
    'egg_kadhi': (244, 768, 344, 842),
    'veg_manchurian': (34, 856, 134, 926)
}

for name, box in ref1_dishes.items():
    dish_crop = ref1.crop(box)
    card_bg = Image.new('RGB', (208, 90), (14, 8, 4))
    offset_x = (208 - dish_crop.size[0]) // 2
    offset_y = (90 - dish_crop.size[1]) // 2
    card_bg.paste(dish_crop, (offset_x, offset_y))
    card_bg.save(f'public/menu_assets/dishes/{name}.png')

fallbacks = {
    'paneer_pakoda': 'masala_paneer',
    'paneer_manchurian': 'paneer_chilli',
    'paper_paneer': 'masala_paneer',
    'paper_chicken': 'chicken_65',
    'chicken_pakoda': 'chicken_lollipop',
    'mushroom_masala': 'mushroom_chilli',
    'mushroom_pakoda': 'mushroom_chilli',
    'mushroom_manchurian': 'mushroom_chilli',
    'egg_omelet': 'egg_kadhi'
}

for target, source in fallbacks.items():
    src_p = f'public/menu_assets/dishes/{source}.png'
    dst_p = f'public/menu_assets/dishes/{target}.png'
    if os.path.exists(src_p):
        Image.open(src_p).save(dst_p)

print("Assets extracted perfectly!")
