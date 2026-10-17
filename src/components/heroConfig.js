/**
 * Hero Experience Configuration
 * Defines frame counts, asset paths, scroll ranges, and responsive stages.
 */

export const HERO_CONFIG = {
  desktop: {
    totalFrames: 147,
    aspectRatio: 16 / 9,
    nativeWidth: 2560,
    nativeHeight: 1440,
    getScrollDistance: () => Math.max(5200, window.innerHeight * 5.2),
    framePattern: (index) => `/frames/desktop/frame_${String(index).padStart(6, '0')}.webp`,
    stages: [
      {
        id: 'phase-1',
        name: 'Opening Aroma',
        start: 0.00,
        active: 0.04,
        end: 0.12,
        alignment: 'center'
      },
      {
        id: 'phase-2',
        name: 'Authentic Cuisine',
        start: 0.13,
        active: 0.19,
        end: 0.28,
        alignment: 'center'
      },
      {
        id: 'phase-3',
        name: 'First Aroma',
        start: 0.29,
        active: 0.36,
        end: 0.46,
        alignment: 'left'
      },
      {
        id: 'phase-4',
        name: 'Biryani & Chinese',
        start: 0.47,
        active: 0.54,
        end: 0.65,
        alignment: 'left'
      },
      {
        id: 'phase-5',
        name: 'Final Hero',
        start: 0.66,
        active: 0.74,
        end: 0.86,
        alignment: 'left'
      },
      {
        id: 'steam-transition',
        name: 'Steam Transition',
        start: 0.84,
        peak: 0.94,
        end: 1.00
      }
    ]
  },
  mobile: {
    totalFrames: 240,
    aspectRatio: 9 / 16,
    nativeWidth: 1080,
    nativeHeight: 1920,
    getScrollDistance: () => Math.max(3800, window.innerHeight * 4.2),
    framePattern: (index) => `/frames/mobile/frame_${String(index).padStart(6, '0')}.webp`,
    stages: [
      {
        id: 'phase-1',
        name: 'Opening Aroma',
        start: 0.00,
        active: 0.05,
        end: 0.13,
        alignment: 'center'
      },
      {
        id: 'phase-2',
        name: 'Authentic Cuisine',
        start: 0.14,
        active: 0.21,
        end: 0.30,
        alignment: 'center'
      },
      {
        id: 'phase-3',
        name: 'First Aroma',
        start: 0.31,
        active: 0.39,
        end: 0.48,
        alignment: 'left'
      },
      {
        id: 'phase-4',
        name: 'Biryani & Chinese',
        start: 0.49,
        active: 0.57,
        end: 0.67,
        alignment: 'left'
      },
      {
        id: 'phase-5',
        name: 'Final Hero',
        start: 0.68,
        active: 0.77,
        end: 0.87,
        alignment: 'center'
      },
      {
        id: 'steam-transition',
        name: 'Steam Transition',
        start: 0.85,
        peak: 0.95,
        end: 1.00
      }
    ]
  },
  breakpoint: 768
};
