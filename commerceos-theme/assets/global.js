/* ASTER: shared utilities, drawer/dialog infrastructure, quantity steppers. */
(function () {
  'use strict';

  window.ASTER = window.ASTER || {};

  /* ---- Tiny pub/sub used to decouple cart.js / wishlist.js / header badges ---- */
  var subscribers = {};
  window.ASTER.pubsub = {
    subscribe: function (event, callback) {
      subscribers[event] = subscribers[event] || [];
      subscribers[event].push(callback);
      return function unsubscribe() {
        subscribers[event] = subscribers[event].filter(function (cb) { return cb !== callback; });
      };
    },
    publish: function (event, data) {
      (subscribers[event] || []).forEach(function (cb) { cb(data); });
    }
  };

  window.ASTER.utils = {
    debounce: function (fn, wait) {
      var timeout;
      return function () {
        var args = arguments;
        var context = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () { fn.apply(context, args); }, wait);
      };
    },
    formatMoney: function (cents, format) {
      format = format || (window.ASTER.settings && window.ASTER.settings.moneyFormat) || '${{amount}}';
      if (typeof cents === 'string') cents = cents.replace('.', '');
      var value = (cents / 100).toFixed(2);
      var parts = value.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      var formatted = parts.join('.');
      return format.replace(/\{\{\s*amount\s*\}\}/, formatted);
    },
    trapFocus: function (container) {
      var focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return function () {};
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      function handleKeydown(event) {
        if (event.key !== 'Tab') return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      container.addEventListener('keydown', handleKeydown);
      first.focus();
      return function () { container.removeEventListener('keydown', handleKeydown); };
    }
  };

  /* ---- Overlay-backed drawers / modals ---- */
  var overlay = document.querySelector('[data-page-overlay]');
  var openTargets = [];
  var releaseFocusTrap = null;

  function showOverlay() {
    if (overlay) overlay.hidden = false;
    document.documentElement.style.overflow = 'hidden';
  }
  function hideOverlayIfIdle() {
    if (openTargets.length === 0) {
      if (overlay) overlay.hidden = true;
      document.documentElement.style.overflow = '';
    }
  }

  window.ASTER.openPanel = function (panel) {
    if (!panel || panel.classList.contains('is-open')) return;
    panel.classList.add('is-open');
    panel.removeAttribute('hidden');
    openTargets.push(panel);
    showOverlay();
    if (releaseFocusTrap) releaseFocusTrap();
    releaseFocusTrap = window.ASTER.utils.trapFocus(panel);
  };

  window.ASTER.closePanel = function (panel) {
    if (!panel) return;
    panel.classList.remove('is-open');
    openTargets = openTargets.filter(function (p) { return p !== panel; });
    hideOverlayIfIdle();
    if (releaseFocusTrap) { releaseFocusTrap(); releaseFocusTrap = null; }
  };

  window.ASTER.closeAllPanels = function () {
    openTargets.slice().forEach(function (panel) { window.ASTER.closePanel(panel); });
    var modal = document.querySelector('[data-quick-add-modal]');
    if (modal) modal.hidden = true;
  };

  if (overlay) {
    overlay.addEventListener('click', window.ASTER.closeAllPanels);
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') window.ASTER.closeAllPanels();
  });

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-cart-drawer-trigger]');
    if (opener && window.ASTER.settings && window.ASTER.settings.cartType === 'drawer') {
      event.preventDefault();
      var drawer = document.querySelector('[data-cart-drawer]');
      if (drawer) window.ASTER.openPanel(drawer);
    }

    if (event.target.closest('[data-cart-drawer-close], [data-filters-close], [data-mobile-nav-close]')) {
      var panel = event.target.closest('.cart-drawer, .filters-drawer, .mobile-nav');
      if (panel) window.ASTER.closePanel(panel);
    }

    var mobileNavOpener = event.target.closest('[data-mobile-nav-trigger]');
    if (mobileNavOpener) {
      var nav = document.querySelector('[data-mobile-nav]');
      if (nav) window.ASTER.openPanel(nav);
    }

    var filtersOpener = event.target.closest('[data-filters-trigger]');
    if (filtersOpener) {
      var filters = document.querySelector('[data-filters-drawer]');
      if (filters) window.ASTER.openPanel(filters);
    }
  });

  /* ---- Delegated quantity steppers (cart lines, quick add, product page) ---- */
  document.addEventListener('click', function (event) {
    var increase = event.target.closest('[data-quantity-increase]');
    var decrease = event.target.closest('[data-quantity-decrease]');
    if (!increase && !decrease) return;
    var wrapper = (increase || decrease).closest('.quantity-selector, .quick-add-form__quantity');
    if (!wrapper) return;
    var input = wrapper.querySelector('[data-quantity-input]');
    if (!input) return;
    var min = input.min !== '' && !isNaN(parseInt(input.min, 10)) ? parseInt(input.min, 10) : 1;
    var value = parseInt(input.value, 10) || min;
    value = increase ? value + 1 : Math.max(min, value - 1);
    input.value = value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
})();
