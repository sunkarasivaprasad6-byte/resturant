from PIL import Image

mim = Image.open('reference/mobile_menu_reference.png')

# Precise dish crops avoiding any border lines:
dishes = [
    ('chicken_biryani', (38, 327, 126, 394)),
    ('mutton_biryani', (236, 327, 324, 394)),
    ('egg_biryani', (38, 410, 126, 477)),
    ('veg_biryani', (236, 410, 324, 477)),
    ('chicken_lollipop', (38, 495, 126, 562)),
    ('chicken_chilli', (236, 495, 324, 562)),
    ('chicken_65', (38, 579, 126, 646)),
    ('chicken_manchurian', (236, 579, 324, 646)),
    ('masala_paneer', (38, 664, 126, 731)),
    ('paneer_chilli', (236, 664, 324, 731)),
    ('mushroom_chilli', (38, 749, 126, 816)),
    ('egg_kadhi', (236, 749, 324, 816)),
    ('veg_manchurian', (38, 834, 126, 901)),
]

for name, box in dishes:
    crop = mim.crop(box)
    crop.save(f'public/menu_assets/dishes/{name}.png')

print('Clean crops saved!')
