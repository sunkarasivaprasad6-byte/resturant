from PIL import Image

dim = Image.open('reference/desktop_menu_reference.jpg')

cols = [
    (38, 184),
    (200, 346),
    (362, 508),
    (524, 670),
    (686, 832),
    (848, 994)
]

def clean_and_save(crop_box, save_path):
    c = dim.crop(crop_box)
    w, h = c.size
    # inpaint top left badge
    bg_l = c.getpixel((24, 8))
    for y in range(0, 18):
        for x in range(0, 20):
            c.putpixel((x, y), bg_l)
    # inpaint top right heart
    bg_r = c.getpixel((w - 24, 8))
    for y in range(0, 18):
        for x in range(w - 20, w):
            c.putpixel((x, y), bg_r)
    c.save(save_path)

row1 = [
    'chicken_biryani',
    'mutton_biryani',
    'egg_biryani',
    'veg_biryani',
    'chicken_lollipop',
    'chicken_chilli'
]

for name, (x1, x2) in zip(row1, cols):
    clean_and_save((x1, 273, x2, 342), f'public/menu_assets/dishes/{name}.png')

row2 = [
    'chicken_65',
    'chicken_manchurian',
    'masala_paneer',
    'paneer_chilli',
    'mushroom_chilli',
    'egg_kadhi'
]

for name, (x1, x2) in zip(row2, cols):
    clean_and_save((x1, 431, x2, 500), f'public/menu_assets/dishes/{name}.png')

# Veg Manchurian from mobile
mim = Image.open('reference/mobile_menu_reference.png')
vm = mim.crop((38, 832, 126, 896))
vm.save('public/menu_assets/dishes/veg_manchurian.png')

print('All 13 dishes cleanly extracted!')
