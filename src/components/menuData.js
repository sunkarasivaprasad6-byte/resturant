/**
 * Restaurant Menu Data Catalog
 * Source of Truth: User uploaded image pack & image-manifest.json
 * 22 Dishes in exact canonical order with exact image paths
 */

export const MENU_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'biryani', name: 'Biryani' },
  { id: 'chicken_special', name: 'Chicken Special' },
  { id: 'paneer_special', name: 'Paneer Special' },
  { id: 'mushroom_special', name: 'Mushroom Special' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'egg_special', name: 'Egg Special' }
];

export const MENU_ITEMS = [
  // 1. Chicken Biryani
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    category: 'biryani',
    categories: ['biryani', 'chicken_special'],
    dietary: 'non-veg',
    description: 'Fragrant rice with tender chicken and aromatic spices.',
    rating: 4.5,
    reviews: 320,
    image: '/images/menu/chicken-biryani.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 },
      { label: 'Extra Large', price: 200 }
    ],
    defaultPrice: 150,
    order: 1
  },

  // 2. Mutton Biryani
  {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    category: 'biryani',
    categories: ['biryani'],
    dietary: 'non-veg',
    description: 'Rich and flavourful mutton cooked to perfection.',
    rating: 4.6,
    reviews: 184,
    image: '/images/menu/mutton-biryani.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 210, default: true },
      { label: 'Half', price: 110 },
      { label: 'Extra Large', price: 280 }
    ],
    defaultPrice: 210,
    order: 2
  },

  // 3. Chicken Lollipop
  {
    id: 'chicken-lollipop',
    name: 'Chicken Lollipop',
    category: 'chicken_special',
    categories: ['chicken_special', 'chinese'],
    dietary: 'non-veg',
    description: 'Crispy, juicy and full of flavour.',
    rating: 4.5,
    reviews: 98,
    image: '/images/menu/chicken-lollipop.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 200, default: true },
      { label: 'Half', price: 110 }
    ],
    defaultPrice: 200,
    order: 3
  },

  // 4. Chicken 65
  {
    id: 'chicken-65',
    name: 'Chicken 65',
    category: 'chicken_special',
    categories: ['chicken_special', 'chinese'],
    dietary: 'non-veg',
    description: 'A classic favorite, crispy and spicy.',
    rating: 4.4,
    reviews: 188,
    image: '/images/menu/chicken-65.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 4
  },

  // 5. Chicken Chilli
  {
    id: 'chicken-chilli',
    name: 'Chicken Chilli',
    category: 'chicken_special',
    categories: ['chicken_special', 'chinese'],
    dietary: 'non-veg',
    description: 'Spicy, tangy and irresistibly good.',
    rating: 4.4,
    reviews: 142,
    image: '/images/menu/chicken-chilli.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 5
  },

  // 6. Masala Paneer
  {
    id: 'masala-paneer',
    name: 'Masala Paneer',
    category: 'paneer_special',
    categories: ['paneer_special'],
    dietary: 'veg',
    description: 'Soft paneer cubes in rich spiced gravy.',
    rating: 4.5,
    reviews: 120,
    image: '/images/menu/masala-paneer.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 6
  },

  // 7. Paneer Chilli
  {
    id: 'paneer-chilli',
    name: 'Paneer Chilli',
    category: 'paneer_special',
    categories: ['paneer_special', 'chinese'],
    dietary: 'veg',
    description: 'A spicy Indo-Chinese delight.',
    rating: 4.4,
    reviews: 96,
    image: '/images/menu/paneer-chilli.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 7
  },

  // 8. Chicken Manchurian
  {
    id: 'chicken-manchurian',
    name: 'Chicken Manchurian',
    category: 'chicken_special',
    categories: ['chicken_special', 'chinese'],
    dietary: 'non-veg',
    description: 'Indo-Chinese classic with bold flavours.',
    rating: 4.3,
    reviews: 167,
    image: '/images/menu/chicken-manchurian.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 8
  },

  // 9. Egg Biryani
  {
    id: 'egg-biryani',
    name: 'Egg Biryani',
    category: 'biryani',
    categories: ['biryani', 'egg_special'],
    dietary: 'non-veg',
    description: 'Delicious blend of eggs and traditional spices.',
    rating: 4.4,
    reviews: 210,
    image: '/images/menu/egg-biryani.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 100, default: true },
      { label: 'Half', price: 60 }
    ],
    defaultPrice: 100,
    order: 9
  },

  // 10. Egg Omlet
  {
    id: 'egg-omlet',
    name: 'Egg Omlet',
    category: 'egg_special',
    categories: ['egg_special'],
    dietary: 'non-veg',
    description: 'Dual egg classic omelet spiced with green chillies, coriander and onions.',
    rating: 4.3,
    reviews: 95,
    image: '/images/menu/egg-omlet.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 40, default: true },
      { label: 'Half', price: 25 }
    ],
    defaultPrice: 40,
    order: 10
  },

  // 11. Paneer Manchurian
  {
    id: 'paneer-manchurian',
    name: 'Paneer Manchurian',
    category: 'paneer_special',
    categories: ['paneer_special', 'chinese'],
    dietary: 'veg',
    description: 'Succulent paneer cubes tossed in rich ginger-garlic Manchurian sauce.',
    rating: 4.4,
    reviews: 86,
    image: '/images/menu/paneer-manchurian.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 11
  },

  // 12. Mushroom Chilli
  {
    id: 'mushroom-chilli',
    name: 'Mushroom Chilli',
    category: 'mushroom_special',
    categories: ['mushroom_special', 'chinese'],
    dietary: 'veg',
    description: 'Fresh mushrooms in a tangy sauce.',
    rating: 4.3,
    reviews: 88,
    image: '/images/menu/mushroom-chilli.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 12
  },

  // 13. Chicken Pakoda
  {
    id: 'chicken-pakoda',
    name: 'Chicken Pakoda',
    category: 'chicken_special',
    categories: ['chicken_special'],
    dietary: 'non-veg',
    description: 'Golden spiced chicken fritters, crispy on the outside and tender inside.',
    rating: 4.5,
    reviews: 82,
    image: '/images/menu/chicken-pakoda.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 100, default: true },
      { label: 'Half', price: 60 }
    ],
    defaultPrice: 100,
    order: 13
  },

  // 14. Veg Manchurian
  {
    id: 'veg-manchurian',
    name: 'Veg Manchurian',
    category: 'chinese',
    categories: ['chinese'],
    dietary: 'veg',
    description: 'Finely minced vegetable dumplings simmered in savory Chinese sauce.',
    rating: 4.4,
    reviews: 91,
    image: '/images/menu/veg-manchurian.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 120, default: true },
      { label: 'Half', price: 70 }
    ],
    defaultPrice: 120,
    order: 14
  },

  // 15. Egg Kadhi
  {
    id: 'egg-kadhi',
    name: 'Egg Kadhi',
    category: 'egg_special',
    categories: ['egg_special'],
    dietary: 'non-veg',
    description: 'A comforting blend of eggs in creamy kadhi.',
    rating: 4.2,
    reviews: 64,
    image: '/images/menu/egg-kadhi.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 100, default: true },
      { label: 'Half', price: 60 }
    ],
    defaultPrice: 100,
    order: 15
  },

  // 16. Veg Biryani
  {
    id: 'veg-biryani',
    name: 'Veg Biryani',
    category: 'biryani',
    categories: ['biryani'],
    dietary: 'veg',
    description: 'Aromatic rice with fresh vegetables and herbs.',
    rating: 4.3,
    reviews: 176,
    image: '/images/menu/veg-biryani.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 100, default: true },
      { label: 'Half', price: 60 }
    ],
    defaultPrice: 100,
    order: 16
  },

  // 17. Mushroom Masala
  {
    id: 'mushroom-masala',
    name: 'Mushroom Masala',
    category: 'mushroom_special',
    categories: ['mushroom_special'],
    dietary: 'veg',
    description: 'Button mushrooms simmered in an aromatic onion-tomato spiced curry.',
    rating: 4.4,
    reviews: 70,
    image: '/images/menu/mushroom-masala.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 17
  },

  // 18. Paneer Pakoda
  {
    id: 'paneer-pakoda',
    name: 'Paneer Pakoda',
    category: 'paneer_special',
    categories: ['paneer_special'],
    dietary: 'veg',
    description: 'Soft cottage cheese dipped in seasoned gram flour batter and fried golden.',
    rating: 4.3,
    reviews: 74,
    image: '/images/menu/paneer-pakoda.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 100, default: true },
      { label: 'Half', price: 60 }
    ],
    defaultPrice: 100,
    order: 18
  },

  // 19. Mushroom Manchurian
  {
    id: 'mushroom-manchurian',
    name: 'Mushroom Manchurian',
    category: 'mushroom_special',
    categories: ['mushroom_special', 'chinese'],
    dietary: 'veg',
    description: 'Plump mushrooms tossed in fiery dark soya and garlic sauce.',
    rating: 4.3,
    reviews: 62,
    image: '/images/menu/mushroom-manchurian.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 150, default: true },
      { label: 'Half', price: 80 }
    ],
    defaultPrice: 150,
    order: 19
  },

  // 20. Paper Chicken
  {
    id: 'paper-chicken',
    name: 'Paper Chicken',
    category: 'chicken_special',
    categories: ['chicken_special'],
    dietary: 'non-veg',
    description: 'Crispy thin chicken bites tossed in fragrant spices and herbs.',
    rating: 4.4,
    reviews: 65,
    image: '/images/menu/paper-chicken.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 120, default: true },
      { label: 'Half', price: 70 }
    ],
    defaultPrice: 120,
    order: 20
  },

  // 21. Paper Paneer
  {
    id: 'paper-paneer',
    name: 'Paper Paneer',
    category: 'paneer_special',
    categories: ['paneer_special'],
    dietary: 'veg',
    description: 'Thin crispy marinated paneer slices tossed with bell peppers and wok spices.',
    rating: 4.3,
    reviews: 50,
    image: '/images/menu/paper-paneer.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 120, default: true },
      { label: 'Half', price: 70 }
    ],
    defaultPrice: 120,
    order: 21
  },

  // 22. Mushroom Pakoda
  {
    id: 'mushroom-pakoda',
    name: 'Mushroom Pakoda',
    category: 'mushroom_special',
    categories: ['mushroom_special'],
    dietary: 'veg',
    description: 'Crispy deep-fried battered mushrooms served with special house dip.',
    rating: 4.2,
    reviews: 45,
    image: '/images/menu/mushroom-pakoda.webp',
    hasVariants: true,
    variants: [
      { label: 'Full', price: 100, default: true },
      { label: 'Half', price: 60 }
    ],
    defaultPrice: 100,
    order: 22
  }
];

export const RESTAURANT_INFO = {
  name: 'Biryani & Chinese District',
  tagline: 'Biryani Meets A Bigger World',
  headline: 'GREAT FOOD • BOLDER FLAVOURS • ALWAYS HERE',
  address: 'Meherma Barahat Pirpanti Road, Near Purana Naaz Cinema Hall',
  city: 'Meherma',
  hours: '11:00 AM – 11:30 PM Daily',
  phone: '+91 98765 43210'
};
