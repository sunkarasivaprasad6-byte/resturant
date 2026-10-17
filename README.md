# Biryani & Chinese District

A luxury, high-performance culinary web experience featuring a 30-FPS cinematic scroll-driven hero sequence and an interactive Menu section with instant search, category filtering, portion variant selectors, and an integrated cart system.

---

## ✨ Features

- **Cinematic Canvas Frame Scrubber**:
  - Smooth bi-directional 30-FPS canvas rendering synchronized with scroll progress via GSAP ScrollTrigger.
  - Device-tailored sequences: Desktop (16:9, 147 frames) & Mobile (9:16, 240 frames).
  - Procedural warm steam climax transition that dissolves gracefully into the menu experience.
- **Reference-Accurate Menu Section**:
  - Grand typography with gold gradients, calligraphy quote (*"Same Taste Bigger Stories"*), and steaming biryani hero visual.
  - **Category Navigation**: 11 categories starting with `ALL` (grid icon), smooth horizontal swipe on mobile.
  - **Live Search & Sorting**: Real-time filtering by dish name and multi-criteria sorting (*Popularity*, *Price: Low to High*, *Price: High to Low*, *Rating*).
  - **Portion Variant Selectors**: Toggle between Half/Full or 4pc/8pc variants with dynamic pricing updates.
  - **Cart & Stepper System**: Card buttons transform into `- [qty] +` steppers upon addition; real-time synchronization with the sticky bottom bar and slide-out cart drawer.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation
```bash
# Clone the repository
git clone https://github.com/yuvaraj337/biriyanichinese.git
cd biriyanichinese

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
biriyanichineserestaurant/
├── public/
│   ├── frames/
│   │   ├── desktop/           # 16:9 WebP frame sequence (147 frames)
│   │   └── mobile/            # 9:16 WebP frame sequence (240 frames)
│   └── menu_assets/
│       ├── restaurant_logo.png
│       ├── menu_header_biryani.png
│       ├── cart_thumb.png
│       ├── categories/        # 11 category circle icons
│       ├── dishes/            # 13 clean dish photos
│       └── banners/           # 3 promo banners
├── src/
│   ├── components/
│   │   ├── heroConfig.js      # Timing stages & scroll parameters
│   │   ├── FrameLoader.js     # Fast chunked preloading & caching
│   │   ├── CanvasRenderer.js  # DPR-scaled canvas rendering
│   │   ├── SteamTransition.js # Procedural atmospheric steam overlay
│   │   ├── HeroTimeline.js    # GSAP ScrollTrigger timeline
│   │   ├── menuData.js        # Catalog, dietary tags, variant pricing
│   │   ├── CartController.js  # State machine, sticky bar & drawer
│   │   └── MenuController.js  # Category filter, search, sort, steppers
│   ├── styles/
│   │   ├── hero.css           # Hero section & design tokens
│   │   └── menu.css           # Reference-accurate menu styles
│   └── main.js                # App bootstrap & controller orchestration
├── index.html
└── package.json
```

---

## 📍 Location & Contact
- **Address**: Meherma Barahat Pirpanti Road, Near Purana Naaz Cinema Hall
- **Hours**: 11:00 AM – 11:30 PM Daily
