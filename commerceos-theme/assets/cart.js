/* ASTER: Ajax cart — add / change / refresh cart drawer + page via the Section Rendering API. */
(function () {
  'use strict';

  window.ASTER = window.ASTER || {};

  function sectionUrl(sectionId) {
    var routes = window.ASTER.routes || {};
    var base = routes.cart_url || '/cart';
    return base + '?section_id=' + sectionId;
  }

  function refreshCartSections() {
    var targets = document.querySelectorAll('[data-cart-section]');
    var requests = [];
    targets.forEach(function (target) {
      var sectionId = target.getAttribute('data-cart-section');
      requests.push(
        fetch(sectionUrl(sectionId))
          .then(function (res) { return res.text(); })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var fresh = doc.querySelector('[data-cart-section="' + sectionId + '"]');
            if (fresh) target.replaceWith(fresh);
          })
      );
    });
    return Promise.all(requests);
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  function refreshCartState() {
    return fetch(window.ASTER.routes.cart_url + '.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        window.ASTER.pubsub.publish('cart:updated', cart);
        return refreshCartSections();
      });
  }

  window.ASTER.cart = {
    addItem: function (formData, submitButton) {
      if (submitButton) submitButton.setAttribute('aria-busy', 'true');
      return fetch(window.ASTER.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
        .then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, data: data }; });
        })
        .then(function (result) {
          if (!result.ok) {
            var message = (result.data && result.data.description) || 'Something went wrong.';
            throw new Error(message);
          }
          return refreshCartState().then(function () {
            window.ASTER.closeAllPanels();
            if (window.ASTER.settings.cartType === 'drawer') {
              var drawer = document.querySelector('[data-cart-drawer]');
              if (drawer) window.ASTER.openPanel(drawer);
            } else {
              window.location.href = window.ASTER.routes.cart_url;
            }
            return result.data;
          });
        })
        .finally(function () {
          if (submitButton) submitButton.removeAttribute('aria-busy');
        });
    },

    changeLine: function (line, quantity) {
      return fetch(window.ASTER.routes.cart_change_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line: line, quantity: quantity })
      })
        .then(function (res) { return res.json(); })
        .then(function () { return refreshCartState(); });
    },

    updateNote: function (note) {
      return fetch(window.ASTER.routes.cart_update_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ note: note })
      });
    }
  };

  document.addEventListener('submit', function (event) {
    var form = event.target.closest('[data-quick-add-real-form], [data-product-form]');
    if (!form) return;
    event.preventDefault();
    /* Buy-button blocks can live outside <form> and reference it via the form="" attribute,
       so the submit button and error element are looked up from the wider product scope, not form descendants. */
    var scope = form.closest('[data-product-info]') || form;
    var submitButton = scope.querySelector('[type="submit"]');
    var errorEl = scope.querySelector('[data-quick-add-error], [data-product-form-error]');
    if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
    window.ASTER.cart.addItem(new FormData(form), submitButton).catch(function (error) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = error.message;
      }
    });
  });

  document.addEventListener('click', function (event) {
    var removeTrigger = event.target.closest('[data-cart-remove]');
    if (removeTrigger) {
      event.preventDefault();
      window.ASTER.cart.changeLine(removeTrigger.getAttribute('data-cart-remove'), 0);
    }

    var discountTrigger = event.target.closest('[data-discount-apply]');
    if (discountTrigger) {
      event.preventDefault();
      applyDiscountAndCheckout(discountTrigger);
    }
  });

  /* Shopify has no public Ajax endpoint to apply a discount code to the cart —
     codes are only ever validated on the Shopify-hosted checkout. This sends the
     shopper through Shopify's native /discount/{code} route (the same link Admin →
     Discounts → "Share link" generates), which validates + applies the code to the
     checkout session, then redirects to /checkout. */
  function applyDiscountAndCheckout(trigger) {
    var wrapper = trigger.closest('.cart-discount') || document;
    var input = wrapper.querySelector('[data-discount-code]');
    var code = input && input.value.trim();
    if (!code) {
      if (input) input.focus();
      return;
    }
    var root = ((window.ASTER.routes && window.ASTER.routes.root_url) || '/').replace(/\/$/, '');
    window.location.href = root + '/discount/' + encodeURIComponent(code) + '?redirect=' + encodeURIComponent('/checkout');
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.target.matches('[data-discount-code]')) {
      event.preventDefault();
      var apply = event.target.closest('.cart-discount').querySelector('[data-discount-apply]');
      if (apply) applyDiscountAndCheckout(apply);
    }
  });

  document.addEventListener('change', function (event) {
    var input = event.target.closest('[data-cart-line-quantity]');
    if (input) {
      var line = input.getAttribute('data-cart-line-quantity');
      var quantity = Math.max(0, parseInt(input.value, 10) || 0);
      window.ASTER.cart.changeLine(line, quantity);
    }

    var noteField = event.target.closest('[data-cart-note]');
    if (noteField) {
      window.ASTER.cart.updateNote(noteField.value);
    }
  });
})();
