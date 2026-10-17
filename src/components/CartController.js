/**
 * Cart Controller
 * Manages:
 *  - Item selection bottom drawer (Screen 2)
 *  - Sticky cart bar
 *  - Cart page (Screen 3)
 *  - Checkout page (Screen 4)
 *  - Shared cart state
 */

import { MENU_ITEMS } from './menuData.js';

export class CartController {
  constructor(options = {}) {
    this.items = new Map(); // key: `${itemId}__${variantLabel}` -> item object
    this.onCartChange = options.onCartChange || null;
    this.deliveryMode = 'delivery'; // 'delivery' or 'takeaway'
    this.deliveryAddress = '';
    this.deliveryFee = 30;
    this.taxRate = 0; // Will compute taxes as a flat charge based on items

    // Current drawer state
    this.drawerItem = null;
    this.drawerSelectedVariant = null;
    this.drawerQuantity = 1;

    // Current view: 'menu', 'cart', 'checkout'
    this.currentView = 'menu';

    // Load cart from localStorage
    this.loadCart();

    // DOM references
    this.headerCartBadge = document.getElementById('header-cart-badge');
    this.stickyCartBar = document.getElementById('sticky-cart-bar');
    this.stickyCartCount = document.getElementById('sticky-cart-count');
    this.stickyCartTotal = document.getElementById('sticky-cart-total');

    // Item Drawer
    this.itemDrawerOverlay = document.getElementById('item-drawer-overlay');
    this.itemDrawer = document.getElementById('item-drawer');

    // Cart Page
    this.cartPage = document.getElementById('cart-page');

    // Checkout Page
    this.checkoutPage = document.getElementById('checkout-page');

    // Main content sections to hide/show
    this.mainContent = document.getElementById('main-content-wrapper');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Open cart via View Cart button or header cart icon
    const viewCartBtns = document.querySelectorAll('.trigger-view-cart, #header-cart-btn');
    viewCartBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showCartPage();
      });
    });

    // Item Drawer overlay click to close
    if (this.itemDrawerOverlay) {
      this.itemDrawerOverlay.addEventListener('click', () => {
        this.closeItemDrawer();
      });
    }
  }

  // ==================== KEY GENERATION ====================
  getKey(itemId, variantLabel = 'Standard') {
    return `${itemId}__${variantLabel}`;
  }

  // ==================== CART OPERATIONS ====================
  addItem(item, variant = null, quantity = 1) {
    const variantLabel = variant ? variant.label : (item.hasVariants ? item.variants[0].label : 'Standard');
    const price = variant ? variant.price : item.defaultPrice;
    const key = this.getKey(item.id, variantLabel);

    if (this.items.has(key)) {
      const existing = this.items.get(key);
      existing.quantity += quantity;
    } else {
      this.items.set(key, {
        id: item.id,
        name: item.name,
        variantLabel: variantLabel !== 'Standard' ? variantLabel : null,
        price,
        quantity: quantity,
        image: item.image,
        dietary: item.dietary
      });
    }

    this.saveCart();
    this.render();
  }

  updateQuantity(key, delta) {
    if (!this.items.has(key)) return;

    const item = this.items.get(key);
    item.quantity += delta;

    if (item.quantity <= 0) {
      this.items.delete(key);
    }

    this.saveCart();
    this.render();
  }

  setQuantity(key, qty) {
    if (!this.items.has(key)) return;
    if (qty <= 0) {
      this.items.delete(key);
    } else {
      this.items.get(key).quantity = qty;
    }
    this.saveCart();
    this.render();
  }

  removeItem(key) {
    this.items.delete(key);
    this.saveCart();
    this.render();
  }

  clear() {
    this.items.clear();
    this.saveCart();
    this.render();
  }

  getTotalCount() {
    let count = 0;
    for (const item of this.items.values()) {
      count += item.quantity;
    }
    return count;
  }

  getDistinctCount() {
    return this.items.size;
  }

  getSubtotal() {
    let sum = 0;
    for (const item of this.items.values()) {
      sum += item.price * item.quantity;
    }
    return sum;
  }

  getDeliveryFee() {
    return this.deliveryMode === 'delivery' ? this.deliveryFee : 0;
  }

  getTaxes() {
    // Calculate taxes as ~17.4% of subtotal, rounded
    const subtotal = this.getSubtotal();
    return Math.round(subtotal * 0.174);
  }

  getTotal() {
    return this.getSubtotal() + this.getDeliveryFee() + this.getTaxes();
  }

  getItemQuantity(itemId, variantLabel = 'Standard') {
    const key = this.getKey(itemId, variantLabel);
    return this.items.has(key) ? this.items.get(key).quantity : 0;
  }

  // ==================== PERSISTENCE ====================
  saveCart() {
    try {
      const data = [];
      for (const [key, item] of this.items.entries()) {
        data.push({ key, ...item });
      }
      localStorage.setItem('bcd_cart', JSON.stringify(data));
    } catch (e) { /* silent */ }
  }

  loadCart() {
    try {
      const data = JSON.parse(localStorage.getItem('bcd_cart'));
      if (data && Array.isArray(data)) {
        this.items.clear();
        data.forEach(entry => {
          const { key, ...item } = entry;
          this.items.set(key, item);
        });
      }
    } catch (e) { /* silent */ }
  }

  // ==================== ITEM DRAWER (Screen 2) ====================
  openItemDrawer(item) {
    this.drawerItem = item;
    this.drawerQuantity = 1;

    // Set default variant
    if (item.hasVariants) {
      this.drawerSelectedVariant = item.variants.find(v => v.default) || item.variants[0];
    } else {
      this.drawerSelectedVariant = { label: 'Standard', price: item.defaultPrice };
    }

    this.renderItemDrawer();

    if (this.itemDrawerOverlay) {
      this.itemDrawerOverlay.classList.add('is-open');
    }
    if (this.itemDrawer) {
      this.itemDrawer.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
  }

  closeItemDrawer() {
    if (this.itemDrawerOverlay) {
      this.itemDrawerOverlay.classList.remove('is-open');
    }
    if (this.itemDrawer) {
      this.itemDrawer.classList.remove('is-open');
    }
    document.body.style.overflow = '';
    this.drawerItem = null;
    this.drawerSelectedVariant = null;
    this.drawerQuantity = 1;
  }

  renderItemDrawer() {
    const item = this.drawerItem;
    if (!item || !this.itemDrawer) return;

    const variant = this.drawerSelectedVariant;
    const qty = this.drawerQuantity;
    const totalPrice = variant.price * qty;

    // Build variant options HTML
    let variantsHtml = '';
    if (item.hasVariants && item.variants.length > 0) {
      variantsHtml = item.variants.map(v => `
        <button class="drawer-variant-btn ${v.label === variant.label ? 'is-selected' : ''}" 
                data-label="${v.label}" data-price="${v.price}">
          <span class="drawer-variant-label">${v.label}</span>
          <span class="drawer-variant-price">₹${v.price}</span>
          <span class="drawer-variant-radio"></span>
        </button>
      `).join('');
    } else {
      variantsHtml = `
        <button class="drawer-variant-btn is-selected" data-label="Standard" data-price="${item.defaultPrice}">
          <span class="drawer-variant-label">Standard</span>
          <span class="drawer-variant-price">₹${item.defaultPrice}</span>
          <span class="drawer-variant-radio"></span>
        </button>
      `;
    }

    this.itemDrawer.innerHTML = `
      <div class="item-drawer-handle"></div>
      <button class="item-drawer-close" id="item-drawer-close-btn" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="item-drawer-content">
        <div class="item-drawer-hero">
          <img src="${item.image}" alt="${item.name}" class="item-drawer-image" />
        </div>
        <div class="item-drawer-info">
          <h3 class="item-drawer-name">${item.name}</h3>
          <p class="item-drawer-desc">${item.description}</p>
          <div class="item-drawer-rating">
            <span class="rating-star">★</span>
            <span class="rating-val">${item.rating}</span>
            <span class="rating-count">(${item.reviews} reviews)</span>
          </div>
        </div>
        <div class="item-drawer-divider"></div>
        <div class="item-drawer-variants">
          <h4 class="item-drawer-section-title">Choose Size</h4>
          <div class="drawer-variant-options">
            ${variantsHtml}
          </div>
        </div>
      </div>
      <div class="item-drawer-footer">
        <div class="item-drawer-qty-row">
          <button class="drawer-qty-btn drawer-qty-minus" aria-label="Decrease quantity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <span class="drawer-qty-value">${qty}</span>
          <button class="drawer-qty-btn drawer-qty-plus" aria-label="Increase quantity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
        <button class="drawer-add-to-cart-btn" id="drawer-add-to-cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span>Add to Cart • ₹${totalPrice}</span>
        </button>
      </div>
    `;

    // Attach drawer event listeners
    this.attachDrawerListeners();
  }

  attachDrawerListeners() {
    const drawer = this.itemDrawer;
    if (!drawer) return;

    // Close button
    const closeBtn = drawer.querySelector('#item-drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeItemDrawer());
    }

    // Variant buttons
    drawer.querySelectorAll('.drawer-variant-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const label = e.currentTarget.getAttribute('data-label');
        const price = parseInt(e.currentTarget.getAttribute('data-price'));
        this.drawerSelectedVariant = { label, price };

        // Update UI
        drawer.querySelectorAll('.drawer-variant-btn').forEach(b => b.classList.remove('is-selected'));
        e.currentTarget.classList.add('is-selected');

        this.updateDrawerTotal();
      });
    });

    // Quantity controls
    const minusBtn = drawer.querySelector('.drawer-qty-minus');
    const plusBtn = drawer.querySelector('.drawer-qty-plus');

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        if (this.drawerQuantity > 1) {
          this.drawerQuantity--;
          drawer.querySelector('.drawer-qty-value').textContent = this.drawerQuantity;
          this.updateDrawerTotal();
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        this.drawerQuantity++;
        drawer.querySelector('.drawer-qty-value').textContent = this.drawerQuantity;
        this.updateDrawerTotal();
      });
    }

    // Add to Cart button
    const addBtn = drawer.querySelector('#drawer-add-to-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const item = this.drawerItem;
        const variant = this.drawerSelectedVariant;
        const qty = this.drawerQuantity;

        if (!item) return;

        const variantObj = item.hasVariants 
          ? item.variants.find(v => v.label === variant.label) || variant
          : null;

        this.addItem(item, variantObj, qty);
        this.closeItemDrawer();
      });
    }
  }

  updateDrawerTotal() {
    const drawer = this.itemDrawer;
    if (!drawer || !this.drawerSelectedVariant) return;

    const totalPrice = this.drawerSelectedVariant.price * this.drawerQuantity;
    const addBtn = drawer.querySelector('#drawer-add-to-cart span');
    if (addBtn) {
      addBtn.textContent = `Add to Cart • ₹${totalPrice}`;
    }
  }

  // ==================== CART PAGE (Screen 3) ====================
  showCartPage() {
    this.currentView = 'cart';
    if (this.cartPage) this.cartPage.classList.add('is-visible');
    if (this.stickyCartBar) this.stickyCartBar.classList.remove('is-visible');
    document.body.style.overflow = 'hidden';
    this.renderCartPage();
  }

  hideCartPage() {
    this.currentView = 'menu';
    if (this.cartPage) this.cartPage.classList.remove('is-visible');
    document.body.style.overflow = '';
    this.render(); // Restore sticky bar
  }

  renderCartPage() {
    if (!this.cartPage) return;

    const totalCount = this.getTotalCount();
    const subtotal = this.getSubtotal();
    const deliveryFee = this.getDeliveryFee();
    const taxes = this.getTaxes();
    const total = this.getTotal();

    let itemsHtml = '';
    for (const [key, item] of this.items.entries()) {
      const lineTotal = item.price * item.quantity;
      itemsHtml += `
        <div class="cart-page-item" data-key="${key}">
          <div class="cart-page-item-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="cart-page-item-info">
            <h4 class="cart-page-item-name">${item.name}</h4>
            <span class="cart-page-item-variant">${item.variantLabel || 'Standard'} • ₹${item.price}</span>
            <div class="cart-page-item-stepper">
              <button class="cart-page-step-btn cart-page-dec" data-key="${key}" aria-label="Decrease">−</button>
              <span class="cart-page-step-qty">${item.quantity}</span>
              <button class="cart-page-step-btn cart-page-inc" data-key="${key}" aria-label="Increase">+</button>
            </div>
          </div>
          <div class="cart-page-item-right">
            <button class="cart-page-item-delete" data-key="${key}" aria-label="Remove item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
            <span class="cart-page-item-total">₹${lineTotal}</span>
          </div>
        </div>
      `;
    }

    this.cartPage.innerHTML = `
      <div class="cart-page-inner">
        <div class="cart-page-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="cart-page-close-btn" id="cart-page-close-btn" aria-label="Close Cart" style="background: none; border: none; color: #ffffff; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="22" height="22">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <h2 class="cart-page-title">Your Cart (${totalCount})</h2>
          </div>
          <button class="cart-page-clear" id="cart-clear-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            <span>Clear All</span>
          </button>
        </div>
        <div class="cart-page-items">
          ${totalCount > 0 ? itemsHtml : `
            <div class="cart-empty-state">
              <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p class="empty-title">Your Cart is Empty</p>
              <p class="empty-subtitle">Explore our delicious biryanis and specials to add items.</p>
            </div>
          `}
        </div>
        ${totalCount > 0 ? `
          <div class="cart-page-bill">
            <h3 class="bill-title">Bill Summary</h3>
            <div class="bill-row">
              <span>Items (${totalCount})</span>
              <span>₹${subtotal}</span>
            </div>
            <div class="bill-row">
              <span>Delivery Fee</span>
              <span>₹${deliveryFee}</span>
            </div>
            <div class="bill-row">
              <span>Taxes & Charges</span>
              <span>₹${taxes}</span>
            </div>
            <div class="bill-row bill-total">
              <span>Total Amount</span>
              <span>₹${total}</span>
            </div>
          </div>
          <div class="cart-page-actions">
            <button class="btn-proceed-checkout" id="btn-proceed-checkout">
              <span>Proceed to Checkout</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    this.attachCartPageListeners();
  }

  attachCartPageListeners() {
    const page = this.cartPage;
    if (!page) return;

    // Close button
    const closeBtn = page.querySelector('#cart-page-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideCartPage();
      });
    }

    // Clear All
    const clearBtn = page.querySelector('#cart-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Remove all items from your cart?')) {
          this.clear();
          this.hideCartPage();
        }
      });
    }

    // Quantity steppers
    page.querySelectorAll('.cart-page-dec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        this.updateQuantity(key, -1);
        if (this.getTotalCount() === 0) {
          this.hideCartPage();
        } else {
          this.renderCartPage();
        }
      });
    });

    page.querySelectorAll('.cart-page-inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        this.updateQuantity(key, 1);
        this.renderCartPage();
      });
    });

    // Delete buttons
    page.querySelectorAll('.cart-page-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        this.removeItem(key);
        if (this.getTotalCount() === 0) {
          this.hideCartPage();
        } else {
          this.renderCartPage();
        }
      });
    });

    // Proceed to checkout
    const checkoutBtn = page.querySelector('#btn-proceed-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.showCheckoutPage();
      });
    }
  }

  // ==================== CHECKOUT PAGE (Screen 4) ====================
  showCheckoutPage() {
    this.currentView = 'checkout';
    if (this.cartPage) this.cartPage.classList.remove('is-visible');
    if (this.checkoutPage) this.checkoutPage.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    this.renderCheckoutPage();
  }

  hideCheckoutPage() {
    this.currentView = 'cart';
    if (this.checkoutPage) this.checkoutPage.classList.remove('is-visible');
    this.showCartPage();
  }

  renderCheckoutPage() {
    if (!this.checkoutPage) return;

    const totalCount = this.getTotalCount();
    const subtotal = this.getSubtotal();
    const deliveryFee = this.getDeliveryFee();
    const taxes = this.getTaxes();
    const total = this.getTotal();

    let itemsHtml = '';
    for (const [key, item] of this.items.entries()) {
      const lineTotal = item.price * item.quantity;
      itemsHtml += `
        <div class="checkout-item" data-key="${key}">
          <div class="checkout-item-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="checkout-item-info">
            <h4 class="checkout-item-name">${item.name}</h4>
            <span class="checkout-item-variant">${item.variantLabel || 'Standard'} • ₹${item.price}</span>
            <div class="checkout-item-stepper">
              <button class="checkout-step-btn checkout-dec" data-key="${key}" aria-label="Decrease">−</button>
              <span class="checkout-step-qty">${item.quantity}</span>
              <button class="checkout-step-btn checkout-inc" data-key="${key}" aria-label="Increase">+</button>
            </div>
          </div>
          <span class="checkout-item-total">₹${lineTotal}</span>
        </div>
      `;
    }

    this.checkoutPage.innerHTML = `
      <div class="checkout-inner">
        <div class="checkout-header">
          <button class="checkout-back-btn" id="checkout-back-btn" aria-label="Go back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div class="checkout-header-text">
            <h2 class="checkout-title">Checkout</h2>
            <p class="checkout-subtitle">Review your order and complete the payment</p>
          </div>
        </div>

        <div class="checkout-section checkout-order-section">
          <div class="checkout-section-header">
            <h3 class="checkout-section-title">Order Items (${totalCount})</h3>
            <button class="checkout-edit-btn" id="checkout-edit-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </button>
          </div>
          <div class="checkout-items-list">
            ${itemsHtml}
          </div>
        </div>

        <div class="checkout-section checkout-delivery-section">
          <h3 class="checkout-section-title">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Delivery Details
          </h3>
          <div class="checkout-delivery-options">
            <button class="checkout-delivery-opt ${this.deliveryMode === 'delivery' ? 'is-selected' : ''}" data-mode="delivery">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H7.5C6.67 3 6 3.67 6 4.5V7H4l-2 3v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-2.08-4.99zM7 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm10 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <div class="delivery-opt-text">
                <span class="delivery-opt-label">Delivery</span>
                <span class="delivery-opt-desc">Get it at your doorstep</span>
              </div>
              <span class="delivery-opt-radio"></span>
            </button>
            <button class="checkout-delivery-opt ${this.deliveryMode === 'takeaway' ? 'is-selected' : ''}" data-mode="takeaway">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18 6V4l-2-2H8L6 4v2H2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6h-4zM8 4h8v2H8V4z"/>
              </svg>
              <div class="delivery-opt-text">
                <span class="delivery-opt-label">Takeaway</span>
                <span class="delivery-opt-desc">Self pickup from store</span>
              </div>
              <span class="delivery-opt-radio"></span>
            </button>
          </div>
          ${this.deliveryMode === 'delivery' ? `
            <div class="checkout-address-row" id="checkout-address-row">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style="color: var(--color-text-muted); flex-shrink: 0;">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div class="checkout-address-info">
                <span class="checkout-address-label">Delivery Address</span>
                <input type="text" class="checkout-address-input" id="checkout-address-input" 
                       placeholder="Enter your delivery address" value="${this.deliveryAddress}" />
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="color: var(--color-text-muted); flex-shrink: 0;">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          ` : ''}
        </div>

        <div class="checkout-section checkout-payment-section">
          <h3 class="checkout-section-title">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
            Payment Method
          </h3>
          <div class="checkout-payment-row">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="color: var(--color-text-muted);">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
            <div class="payment-row-text">
              <span class="payment-label">Pay Online</span>
              <span class="payment-desc">UPI, Cards, Net Banking & more</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="color: var(--color-text-muted);">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>

        <div class="checkout-section checkout-bill-section">
          <h3 class="checkout-section-title">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            Bill Summary
          </h3>
          <div class="bill-row">
            <span>Items Total</span>
            <span>₹${subtotal}</span>
          </div>
          <div class="bill-row">
            <span>Delivery Fee</span>
            <span>₹${deliveryFee}</span>
          </div>
          <div class="bill-row">
            <span>Taxes & Charges</span>
            <span>₹${taxes}</span>
          </div>
          <div class="bill-row bill-total">
            <span>Total Amount</span>
            <span>₹${total}</span>
          </div>
        </div>

        <div class="checkout-actions">
          <button class="btn-proceed-payment" id="btn-proceed-payment">
            <span>Proceed to Payment</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    `;

    this.attachCheckoutListeners();
  }

  attachCheckoutListeners() {
    const page = this.checkoutPage;
    if (!page) return;

    // Back button
    const backBtn = page.querySelector('#checkout-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.hideCheckoutPage();
      });
    }

    // Edit button -> go back to cart
    const editBtn = page.querySelector('#checkout-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.hideCheckoutPage();
      });
    }

    // Delivery mode toggle
    page.querySelectorAll('.checkout-delivery-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-mode');
        this.deliveryMode = mode;
        this.renderCheckoutPage();
      });
    });

    // Address input
    const addressInput = page.querySelector('#checkout-address-input');
    if (addressInput) {
      addressInput.addEventListener('input', (e) => {
        this.deliveryAddress = e.target.value;
      });
    }

    // Quantity steppers
    page.querySelectorAll('.checkout-dec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        this.updateQuantity(key, -1);
        if (this.getTotalCount() === 0) {
          this.checkoutPage.classList.remove('is-visible');
          this.hideCartPage();
          this.currentView = 'menu';
          document.body.style.overflow = '';
          this.render();
        } else {
          this.renderCheckoutPage();
        }
      });
    });

    page.querySelectorAll('.checkout-inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        this.updateQuantity(key, 1);
        this.renderCheckoutPage();
      });
    });

    // Proceed to Payment
    const payBtn = page.querySelector('#btn-proceed-payment');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        this.handlePayment();
      });
    }
  }

  handlePayment() {
    // Validate delivery address if delivery mode
    if (this.deliveryMode === 'delivery' && !this.deliveryAddress.trim()) {
      const addressInput = this.checkoutPage?.querySelector('#checkout-address-input');
      if (addressInput) {
        addressInput.focus();
        addressInput.style.borderColor = '#e74c3c';
        addressInput.setAttribute('placeholder', '⚠ Please enter your delivery address');
        setTimeout(() => {
          addressInput.style.borderColor = '';
          addressInput.setAttribute('placeholder', 'Enter your delivery address');
        }, 3000);
      }
      return;
    }

    if (this.getTotalCount() === 0) return;

    // Show order confirmation
    const total = this.getTotal();
    const count = this.getTotalCount();

    const modal = document.createElement('div');
    modal.className = 'order-confirm-modal';
    modal.innerHTML = `
      <div class="order-confirm-card">
        <div class="confirm-icon">✓</div>
        <h3 class="confirm-title">Order Request Received!</h3>
        <p class="confirm-desc">
          Your delicious order of <strong>${count} items</strong> (₹${total}) is being prepared at our kitchen located at <strong>Meherma Barahat Pirpanti Road</strong>.
        </p>
        <p class="confirm-note">
          ${this.deliveryMode === 'delivery' 
            ? `Delivering to: <strong>${this.deliveryAddress}</strong>` 
            : 'Ready for self-pickup at the store.'}
        </p>
        <button class="confirm-close-btn" id="confirm-ok-btn">Enjoy Your Meal!</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('confirm-ok-btn').addEventListener('click', () => {
      modal.remove();
      this.clear();
      this.deliveryAddress = '';
      this.deliveryMode = 'delivery';
      if (this.checkoutPage) this.checkoutPage.classList.remove('is-visible');
      if (this.cartPage) this.cartPage.classList.remove('is-visible');
      this.currentView = 'menu';
      document.body.style.overflow = '';
      this.render();
    });
  }

  // ==================== RENDER (Sticky Bar + Badge) ====================
  render() {
    const totalCount = this.getTotalCount();
    const subtotal = this.getSubtotal();

    // 1. Update Header Badge
    if (this.headerCartBadge) {
      this.headerCartBadge.textContent = totalCount;
      this.headerCartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // 2. Update Sticky Bottom Cart Bar (only on menu view)
    if (this.stickyCartBar && this.currentView === 'menu') {
      if (totalCount > 0) {
        this.stickyCartBar.classList.add('is-visible');
        if (this.stickyCartTotal) {
          this.stickyCartTotal.textContent = `₹${subtotal}`;
        }
        if (this.stickyCartCount) {
          this.stickyCartCount.textContent = `${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}`;
        }
        const thumbEl = document.getElementById('sticky-cart-thumb');
        if (thumbEl && this.items.size > 0) {
          const lastItem = Array.from(this.items.values()).pop();
          if (lastItem && lastItem.image) {
            thumbEl.src = lastItem.image;
          }
        }
      } else {
        this.stickyCartBar.classList.remove('is-visible');
      }
    }

    // 3. Notify external listeners
    if (this.onCartChange) {
      this.onCartChange(this);
    }
  }
}
