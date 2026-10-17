from PIL import Image
import os

dim = Image.open('reference/desktop_menu_reference.jpg')

cols = [
    (38, 184),
    (200, 346),
    (362, 508),
    (524, 670),
    (686, 832),
    (848, 994)
]

row1_names = [
    'chicken_biryani',
    'mutton_biryani',
    'egg_biryani',
    'veg_biryani',
    'chicken_lollipop',
    'chicken_chilli'
]

for name, (x1, x2) in zip(row1_names, cols):
    crop = dim.crop((x1, 274, x2, 362))
    crop.save(f'public/menu_assets/dishes/{name}.png')

row2_names = [
    'chicken_65',
    'chicken_manchurian',
    'masala_paneer',
    'paneer_chilli',
    'mushroom_chilli',
    'egg_kadhi'
]

for name, (x1, x2) in zip(row2_names, cols):
    crop = dim.crop((x1, 432, x2, 520))
    crop.save(f'public/menu_assets/dishes/{name}.png')

# From mobile ref: Veg Manchurian
mim = Image.open('reference/mobile_menu_reference.png')
vm_crop = mim.crop((40, 830, 145, 900))
vm_crop.save(f'public/menu_assets/dishes/veg_manchurian.png')

print('Dishes successfully cropped!')
