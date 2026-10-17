import { HERO_CONFIG } from './components/heroConfig.js';
import { FrameLoader } from './components/FrameLoader.js';
import { CanvasRenderer } from './components/CanvasRenderer.js';
import { SteamTransition } from './components/SteamTransition.js';
import { HeroTimeline } from './components/HeroTimeline.js';
import { CartController } from './components/CartController.js';
import { MenuController } from './components/MenuController.js';
import { ReservationController } from './components/ReservationController.js';

class App {
  constructor() {
    this.isMobile = window.innerWidth < HERO_CONFIG.breakpoint;
    this.currentMode = this.isMobile ? 'mobile' : 'desktop';
    this.config = HERO_CONFIG[this.currentMode];

    this.canvas = document.getElementById('hero-canvas');
    this.wrapper = document.getElementById('hero-scroll-wrapper');
    this.pinnedViewport = document.getElementById('hero-pinned-viewport');
    this.progressBar = document.getElementById('header-progress-bar');

    this.frameLoader = null;
    this.canvasRenderer = null;
    this.steamTransition = null;
    this.heroTimeline = null;
    this.cartController = null;
    this.menuController = null;
    this.reservationController = null;

    this.resizeTimeout = null;

    this.init();
  }

  init() {
    // 1. Initialize Canvas Renderer
    this.canvasRenderer = new CanvasRenderer(this.canvas, {
      aspectRatio: this.config.aspectRatio
    });

    // 2. Initialize Steam Transition Overlay
    this.steamTransition = new SteamTransition(this.pinnedViewport);

    // 3. Initialize Frame Loader for active mode
    this.initFrameLoader();

    // 4. Initialize Hero Timeline & ScrollTrigger
    this.initTimeline();

    // 5. Setup Window Events
    this.setupEvents();

    // 6. Initialize Cart Controller
    this.cartController = new CartController();

    // 7. Initialize Menu Controller
    this.menuController = new MenuController(this.cartController);

    // 8. Initialize Reservation Controller
    this.reservationController = new ReservationController();

    // 9. Setup CTA scroll listeners
    this.setupInteractions();
  }

  initFrameLoader() {
    if (this.frameLoader) {
      this.frameLoader.destroy();
    }

    this.frameLoader = new FrameLoader({
      totalFrames: this.config.totalFrames,
      framePattern: this.config.framePattern,
      initialBatchSize: this.isMobile ? 30 : 25,
      batchSize: 12,
      onFirstFrameReady: (img) => {
        // Draw frame 1 instantaneously
        this.canvasRenderer.renderFrame(img);
      }
    });

    this.frameLoader.start();
  }

  initTimeline() {
    if (this.heroTimeline) {
      this.heroTimeline.destroy();
    }

    this.heroTimeline = new HeroTimeline({
      wrapperElement: this.wrapper,
      pinnedViewport: this.pinnedViewport,
      stages: this.config.stages,
      totalFrames: this.config.totalFrames,
      frameLoader: this.frameLoader,
      canvasRenderer: this.canvasRenderer,
      steamTransition: this.steamTransition,
      progressBar: this.progressBar,
      scrollDistance: this.config.getScrollDistance
    });
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 150);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
      }, 200);
    });
  }

  handleResize() {
    const newIsMobile = window.innerWidth < HERO_CONFIG.breakpoint;
    const newMode = newIsMobile ? 'mobile' : 'desktop';

    this.canvasRenderer.resize();

    // If breakpoint crossed, swap sequence cleanly
    if (newMode !== this.currentMode) {
      this.isMobile = newIsMobile;
      this.currentMode = newMode;
      this.config = HERO_CONFIG[this.currentMode];

      this.canvasRenderer.setAspectRatio(this.config.aspectRatio);
      this.initFrameLoader();
      this.initTimeline();
    } else {
      this.heroTimeline.refresh();
    }
  }

  setupInteractions() {
    const exploreBtn = document.getElementById('explore-menu-btn');
    const mobileExploreBtn = document.getElementById('mobile-explore-menu-btn');
    const reserveBtn = document.getElementById('header-reserve-btn');
    const menuSection = document.getElementById('menu-section');

    const smoothScrollToMenu = (e) => {
      e.preventDefault();
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const viewCategoriesBtn = document.getElementById('view-categories-btn');
    const mobileViewCategoriesBtn = document.getElementById('mobile-view-categories-btn');
    const categorySection = document.getElementById('menu-category-section') || document.getElementById('menu-section');

    const smoothScrollToCategories = (e) => {
      e.preventDefault();
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (exploreBtn) exploreBtn.addEventListener('click', smoothScrollToMenu);
    if (mobileExploreBtn) mobileExploreBtn.addEventListener('click', smoothScrollToMenu);
    if (viewCategoriesBtn) viewCategoriesBtn.addEventListener('click', smoothScrollToCategories);
    if (mobileViewCategoriesBtn) mobileViewCategoriesBtn.addEventListener('click', smoothScrollToCategories);
    if (reserveBtn) reserveBtn.addEventListener('click', smoothScrollToMenu);

    // Location Pill Smooth Scroll
    const locationPill = document.getElementById('header-location-pill');
    const locationSection = document.getElementById('location-section');
    if (locationPill && locationSection) {
      locationPill.addEventListener('click', (e) => {
        e.preventDefault();
        locationSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Newsletter Form Handling
    const newsletterForm = document.getElementById('footer-newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterFeedback = document.getElementById('newsletter-feedback');

    if (newsletterForm && newsletterEmail && newsletterFeedback) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
          newsletterFeedback.textContent = 'Please enter a valid email address.';
          newsletterFeedback.style.color = '#e74c3c';
          newsletterFeedback.classList.add('visible');
          newsletterEmail.focus();
          return;
        }

        newsletterFeedback.textContent = 'Thank you for subscribing to Biryani & Chinese District!';
        newsletterFeedback.style.color = '#55d985';
        newsletterFeedback.classList.add('visible');
        newsletterEmail.value = '';

        setTimeout(() => {
          newsletterFeedback.classList.remove('visible');
        }, 5000);
      });
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
