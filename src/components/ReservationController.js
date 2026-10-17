/**
 * Reservation Controller
 * Manages the Table Reservation modal lifecycle, form validation, and submission confirmation state.
 */

export class ReservationController {
  constructor() {
    this.overlay = document.getElementById('reservation-modal-overlay');
    this.modal = document.getElementById('reservation-modal-dialog');
    this.form = document.getElementById('reservation-form');
    this.confirmCard = document.getElementById('reservation-confirm-card');
    
    // Form fields
    this.nameInput = document.getElementById('res-name');
    this.phoneInput = document.getElementById('res-phone');
    this.dateInput = document.getElementById('res-date');
    this.timeSelect = document.getElementById('res-time');
    this.guestsSelect = document.getElementById('res-guests');
    this.occasionSelect = document.getElementById('res-occasion');
    this.requestsInput = document.getElementById('res-requests');

    // Summary fields
    this.summaryName = document.getElementById('summary-res-name');
    this.summaryPhone = document.getElementById('summary-res-phone');
    this.summaryDateTime = document.getElementById('summary-res-datetime');
    this.summaryGuests = document.getElementById('summary-res-guests');
    this.summaryOccasion = document.getElementById('summary-res-occasion');

    this.isOpen = false;
    this.lastActiveElement = null;

    this.init();
  }

  init() {
    this.setupDateConstraints();
    this.setupEventListeners();
  }

  setupDateConstraints() {
    if (this.dateInput) {
      const today = new Date().toISOString().split('T')[0];
      this.dateInput.setAttribute('min', today);
      this.dateInput.value = today;
    }
  }

  setupEventListeners() {
    // Open triggers
    document.querySelectorAll('[data-open-reservation]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    // Close triggers
    const closeBtns = document.querySelectorAll('.close-reservation-modal');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal();
      });
    });

    // Backdrop click
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.closeModal();
        }
      });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    });

    // Form submit
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // Done button in confirmation card
    const doneBtn = document.getElementById('btn-reservation-done');
    if (doneBtn) {
      doneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal();
        this.resetState();
      });
    }

    // Clear validation error on input
    [this.nameInput, this.phoneInput, this.dateInput, this.timeSelect, this.guestsSelect].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
        input.addEventListener('change', () => {
          this.clearFieldError(input);
        });
      }
    });
  }

  openModal() {
    if (!this.overlay) return;
    this.lastActiveElement = document.activeElement;
    this.isOpen = true;
    this.overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Focus first input after animation
    setTimeout(() => {
      if (this.nameInput) {
        this.nameInput.focus();
      }
    }, 150);
  }

  closeModal() {
    if (!this.overlay) return;
    this.isOpen = false;
    this.overlay.classList.remove('is-active');
    document.body.style.overflow = '';

    if (this.lastActiveElement && typeof this.lastActiveElement.focus === 'function') {
      this.lastActiveElement.focus();
    }
  }

  handleSubmit() {
    const isValid = this.validateForm();
    if (!isValid) return;

    const reservationData = {
      name: this.nameInput.value.trim(),
      phone: this.phoneInput.value.trim(),
      date: this.dateInput.value,
      time: this.timeSelect.value,
      guests: this.guestsSelect.value,
      occasion: this.occasionSelect ? this.occasionSelect.value : 'Dining',
      requests: this.requestsInput ? this.requestsInput.value.trim() : ''
    };

    this.showConfirmation(reservationData);
  }

  validateForm() {
    let isValid = true;

    // Full Name
    const name = this.nameInput ? this.nameInput.value.trim() : '';
    if (!name || name.length < 2) {
      this.showFieldError(this.nameInput, 'Please enter your full name (minimum 2 characters)');
      isValid = false;
    } else {
      this.clearFieldError(this.nameInput);
    }

    // Phone Number (10 digits)
    const phone = this.phoneInput ? this.phoneInput.value.trim().replace(/\D/g, '') : '';
    if (!phone || phone.length !== 10) {
      this.showFieldError(this.phoneInput, 'Please enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      this.clearFieldError(this.phoneInput);
    }

    // Date
    const date = this.dateInput ? this.dateInput.value : '';
    if (!date) {
      this.showFieldError(this.dateInput, 'Please choose a reservation date');
      isValid = false;
    } else {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        this.showFieldError(this.dateInput, 'Date cannot be in the past');
        isValid = false;
      } else {
        this.clearFieldError(this.dateInput);
      }
    }

    // Time
    const time = this.timeSelect ? this.timeSelect.value : '';
    if (!time) {
      this.showFieldError(this.timeSelect, 'Please select your preferred dining time');
      isValid = false;
    } else {
      this.clearFieldError(this.timeSelect);
    }

    // Guests
    const guests = this.guestsSelect ? this.guestsSelect.value : '';
    if (!guests) {
      this.showFieldError(this.guestsSelect, 'Please select number of guests');
      isValid = false;
    } else {
      this.clearFieldError(this.guestsSelect);
    }

    return isValid;
  }

  showFieldError(inputElement, message) {
    if (!inputElement) return;
    const parent = inputElement.closest('.form-field');
    if (parent) {
      parent.classList.add('has-error');
      const errorMsgEl = parent.querySelector('.form-error-msg');
      if (errorMsgEl) {
        errorMsgEl.textContent = message;
      }
    }
  }

  clearFieldError(inputElement) {
    if (!inputElement) return;
    const parent = inputElement.closest('.form-field');
    if (parent) {
      parent.classList.remove('has-error');
    }
  }

  showConfirmation(data) {
    if (this.form) this.form.style.display = 'none';

    if (this.confirmCard) {
      this.confirmCard.classList.add('is-visible');

      // Populate summary fields
      if (this.summaryName) this.summaryName.textContent = data.name;
      if (this.summaryPhone) this.summaryPhone.textContent = `+91 ${data.phone}`;
      if (this.summaryDateTime) this.summaryDateTime.textContent = `${data.date} at ${data.time}`;
      if (this.summaryGuests) this.summaryGuests.textContent = `${data.guests} Guests`;
      if (this.summaryOccasion) this.summaryOccasion.textContent = data.occasion;

      const greetingEl = document.getElementById('confirm-customer-name');
      if (greetingEl) {
        greetingEl.textContent = `Thank you, ${data.name}!`;
      }
    }
  }

  resetState() {
    if (this.form) {
      this.form.reset();
      this.form.style.display = '';
      this.setupDateConstraints();
    }
    if (this.confirmCard) {
      this.confirmCard.classList.remove('is-visible');
    }
    document.querySelectorAll('.form-field.has-error').forEach((el) => {
      el.classList.remove('has-error');
    });
  }
}
