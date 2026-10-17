import { MENU_CATEGORIES, MENU_ITEMS } from './menuData.js';

function getCategoryIcon(catId) {
  switch (catId) {
    case 'all':
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <rect x="2.5" y="2.5" width="8" height="8" rx="2.5"/>
          <rect x="13.5" y="2.5" width="8" height="8" rx="2.5"/>
          <rect x="2.5" y="13.5" width="8" height="8" rx="2.5"/>
          <rect x="13.5" y="13.5" width="8" height="8" rx="2.5"/>
        </svg>
      `;
    case 'biryani':
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <path d="M4 12h16c-.4 4.5-3.8 8-8 8s-7.6-3.5-8-8z"/>
          <line x1="8" y1="20" x2="16" y2="20" stroke-width="1.8"/>
          <path d="M8 9c0-2 1.2-3 1.2-4"/>
          <path d="M12 9c0-2 1.2-3 1.2-4"/>
          <path d="M16 9c0-2 1.2-3 1.2-4"/>
        </svg>
      `;
    case 'chicken_special':
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <path d="M17 5.5a2.5 2.5 0 0 1 2.5 2.5c0 .6-.2 1.2-.6 1.6l-8.4 8.4c-.4.4-1 .6-1.6.6a2.5 2.5 0 0 1-2.5-2.5c0-.6.2-1.2.6-1.6l8.4-8.4c.4-.4 1-.6 1.6-.6z"/>
          <circle cx="15.5" cy="5" r="2"/>
          <circle cx="19" cy="8.5" r="2"/>
          <circle cx="5" cy="15.5" r="2"/>
          <circle cx="8.5" cy="19" r="2"/>
        </svg>
      `;
    case 'paneer_special':
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <polygon points="12 2 17 5 12 8 7 5"/>
          <polygon points="7 5 12 8 12 14 7 11"/>
          <polygon points="17 5 12 8 12 14 17 11"/>
          <polygon points="6 12 10.5 14.5 6 17 1.5 14.5"/>
          <polygon points="1.5 14.5 6 17 6 22 1.5 19.5"/>
          <polygon points="10.5 14.5 6 17 6 22 10.5 19.5"/>
        </svg>
      `;
    case 'mushroom_special':
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <path d="M4 14c0-5 3.5-9 8-9s8 4 8 9c0 .8-.8 1.5-1.5 1.5H5.5C4.8 15.5 4 14.8 4 14z"/>
          <path d="M9.5 15.5v3.5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3.5"/>
          <path d="M6 10a6 6 0 0 1 12 0"/>
        </svg>
      `;
    case 'chinese':
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <path d="M4 12h16c-.5 4.5-4 8-8 8s-7.5-3.5-8-8z"/>
          <line x1="8" y1="20" x2="16" y2="20"/>
          <line x1="3" y1="7" x2="19" y2="12"/>
          <line x1="5" y1="5" x2="20" y2="10"/>
          <path d="M9 10c0-2 1-3 1-4"/>
          <path d="M14 10c0-2 1-3 1-4"/>
        </svg>
      `;
    case 'egg_special':
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <ellipse cx="12" cy="13" rx="7.5" ry="8.5"/>
          <circle cx="12" cy="14" r="3.5"/>
        </svg>
      `;
    default:
      return `
        <svg class="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22">
          <circle cx="12" cy="12" r="9"/>
        </svg>
      `;
  }
}

/**
 * Menu Controller
 * Handles category filtering, live search, sorting, food card rendering.
 * Cards show image, heart, title, description, rating, and a gold Add button.
 */
export class MenuController {
  constructor(cartController) {
    this.cart = cartController;
    this.activeCategory = 'all';
    this.activeDietaryFilter = 'all'; // 'all', 'veg', 'non-veg'
    this.searchQuery = '';
    this.activeSort = 'popularity';

    // DOM references
    this.categoriesContainer = document.getElementById('menu-categories-list');
    this.foodGrid = document.getElementById('menu-food-grid');
    this.searchInput = document.getElementById('menu-search-input');
    this.sortSelect = document.getElementById('menu-sort-select');
    this.menuCountLabel = document.getElementById('menu-count-label');
    this.filterVegBtn = document.getElementById('filter-veg-btn');
    this.filterNonVegBtn = document.getElementById('filter-nonveg-btn');

    this.init();
  }

  init() {
    this.renderCategories();
    this.setupEventListeners();
    this.renderDishes();

    // Subscribe to cart changes if needed
    if (this.cart) {
      this.cart.onCartChange = () => {
        // Shared cart updates handled by CartController
      };
    }
  }

  setupEventListeners() {
    // Live Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderDishes();
      });
    }

    // Direct Veg / Non-Veg Filter Buttons
    if (this.filterVegBtn) {
      this.filterVegBtn.addEventListener('click', () => {
        if (this.activeDietaryFilter === 'veg') {
          this.activeDietaryFilter = 'all';
          this.filterVegBtn.classList.remove('is-active-veg');
        } else {
          this.activeDietaryFilter = 'veg';
          this.filterVegBtn.classList.add('is-active-veg');
          if (this.filterNonVegBtn) this.filterNonVegBtn.classList.remove('is-active-nonveg');
        }
        this.renderDishes();
      });
    }

    if (this.filterNonVegBtn) {
      this.filterNonVegBtn.addEventListener('click', () => {
        if (this.activeDietaryFilter === 'non-veg') {
          this.activeDietaryFilter = 'all';
          this.filterNonVegBtn.classList.remove('is-active-nonveg');
        } else {
          this.activeDietaryFilter = 'non-veg';
          this.filterNonVegBtn.classList.add('is-active-nonveg');
          if (this.filterVegBtn) this.filterVegBtn.classList.remove('is-active-veg');
        }
        this.renderDishes();
      });
    }

    // Sort Dropdown
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.renderDishes();
      });
    }

    // Header Search Button
    const headerSearchBtn = document.getElementById('header-search-btn');
    if (headerSearchBtn) {
      headerSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('menu-search-input');
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => searchInput.focus(), 400);
        }
      });
    }
  }

  renderCategories() {
    if (!this.categoriesContainer) return;

    let html = '';
    MENU_CATEGORIES.forEach((cat) => {
      const isActive = cat.id === this.activeCategory;
      const displayName = cat.name.includes(' ') ? cat.name.replace(' ', '<br>') : cat.name;

      html += `
        <button class="menu-cat-btn ${isActive ? 'is-active' : ''}" data-cat="${cat.id}">
          <div class="cat-icon-frame">
            ${getCategoryIcon(cat.id)}
          </div>
          <span class="cat-label">${displayName}</span>
          <span class="cat-active-bar"></span>
        </button>
      `;
    });

    this.categoriesContainer.innerHTML = html;

    // Attach click listeners to category buttons
    this.categoriesContainer.querySelectorAll('.menu-cat-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-cat');
        this.setCategory(catId);
      });
    });
  }

  setCategory(catId) {
    this.activeCategory = catId;
    this.categoriesContainer.querySelectorAll('.menu-cat-btn').forEach((btn) => {
      if (btn.getAttribute('data-cat') === catId) {
        btn.classList.add('is-active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('is-active');
      }
    });

    this.renderDishes();
  }

  getFilteredDishes() {
    let list = MENU_ITEMS.filter((item) => {
      // 1. Category Filter
      if (this.activeCategory !== 'all') {
        const matchesCat = item.categories 
          ? item.categories.includes(this.activeCategory) 
          : item.category === this.activeCategory;
        if (!matchesCat) return false;
      }
      // 2. Dietary Filter (Direct Veg / Non-Veg)
      if (this.activeDietaryFilter !== 'all' && item.dietary !== this.activeDietaryFilter) {
        return false;
      }
      // 3. Search Filter
      if (this.searchQuery) {
        const matchesName = item.name.toLowerCase().includes(this.searchQuery);
        const matchesDesc = item.description.toLowerCase().includes(this.searchQuery);
        const matchesCat = item.category.toLowerCase().includes(this.searchQuery);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }
      return true;
    });

    // 4. Sorting
    if (this.activeSort === 'price-low-high' || this.activeSort === 'price-asc') {
      list.sort((a, b) => a.defaultPrice - b.defaultPrice);
    } else if (this.activeSort === 'price-high-low' || this.activeSort === 'price-desc') {
      list.sort((a, b) => b.defaultPrice - a.defaultPrice);
    } else if (this.activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Canonical user sequence (1 to 22)
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return list;
  }

  renderDishes() {
    if (!this.foodGrid) return;

    const dishes = this.getFilteredDishes();

    if (this.menuCountLabel) {
      this.menuCountLabel.textContent = `${dishes.length} ${dishes.length === 1 ? 'dish' : 'dishes'}`;
    }

    if (dishes.length === 0) {
      this.foodGrid.innerHTML = `
        <div class="menu-empty-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p class="empty-title">No matching dishes found</p>
          <p class="empty-desc">Try searching for "biryani", "chicken", or clearing filters.</p>
        </div>
      `;
      return;
    }

    let html = '';
    dishes.forEach((item) => {
      html += `
        <article class="food-card" id="card-${item.id}" data-id="${item.id}">
          <!-- Food Image Frame with Wishlist Heart -->
          <div class="food-image-frame">
            <img src="${item.image}" alt="${item.name}" class="food-image" loading="lazy" />
            <button class="food-card-wishlist" aria-label="Add to favorites">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
          </div>

          <!-- Food Info Body -->
          <div class="food-card-body">
            <h3 class="food-card-title">${item.name}</h3>
            <p class="food-card-desc">${item.description}</p>

            <!-- Bottom Row: Rating on Left, Add + on Right -->
            <div class="food-card-bottom-row">
              <div class="food-rating-row">
                <span class="rating-star">★</span>
                <span class="rating-val">${item.rating}</span>
                <span class="rating-count">(${item.reviews || item.reviewCount || 100})</span>
              </div>

              <button class="btn-card-add" data-id="${item.id}" aria-label="Add ${item.name} to order">Add</button>
            </div>

          </div><!-- /.food-card-body -->
        </article>
      `;
    });

    this.foodGrid.innerHTML = html;
    this.attachCardListeners();
  }

  attachCardListeners() {
    // 1. Add Button Clicks — open item drawer
    this.foodGrid.querySelectorAll('.btn-card-add').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const itemId = e.currentTarget.getAttribute('data-id');
        const item = MENU_ITEMS.find((i) => i.id === itemId);
        if (!item || !this.cart) return;

        this.cart.openItemDrawer(item);
      });
    });

    // 2. Wishlist Hearts
    this.foodGrid.querySelectorAll('.food-card-wishlist').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.currentTarget.classList.toggle('is-favorited');
      });
    });
  }
}
