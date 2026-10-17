from PIL import Image

dim = Image.open('reference/desktop_menu_reference.jpg')

# 6 columns in desktop:
# Card borders:
# Col 1: 34..188
# Col 2: 196..350
# Col 3: 358..512
# Col 4: 520..674
# Col 5: 682..836
# Col 6: 844..998

# Inside card:
# Food image spans across card width: x1+4..x2-4, y: 275..358
cards_x = [
    (38, 184),
    (200, 346),
    (362, 508),
    (524, 670),
    (686, 832),
    (848, 994)
]

row1_dishes = [
    'chicken_biryani',
    'mutton_biryani',
    'egg_biryani',
    'veg_biryani',
    'chicken_lollipop',
    'chicken_chilli'
]

for name, (x1, x2) in zip(row1_dishes, cards_x):
    crop = dim.crop((x1, 274, x2, 358))
    crop.save(f'public/menu_assets/dishes/{name}.png')

row2_dishes = [
    'chicken_65',
    'chicken_manchurian',
    'masala_paneer',
    'paneer_chilli',
    'mushroom_chilli',
    'egg_kadhi'
]

for name, (x1, x2) in zip(row2_dishes, cards_x):
    crop = dim.crop((x1, 432, x2, 516))
    crop.save(f'public/menu_assets/dishes/{name}.png')

# Veg Manchurian from mobile
mim = Image.open('reference/mobile_menu_reference.png')
vm = mim.crop((38, 835, 126, 900))
vm.save('public/menu_assets/dishes/veg_manchurian.png')

print('Desktop food crops saved!')
