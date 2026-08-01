/* ASTER: main product page — variant selection, price/media/stock sync, gallery. */
(function () {
  'use strict';

  document.querySelectorAll('[data-product-info]').forEach(function (root) {
    var dataScript = root.querySelector('[data-product-json]');
    if (!dataScript) return;
    var product = JSON.parse(dataScript.textContent);
    var form = root.querySelector('[data-product-form]');
    var variantIdInput = root.querySelector('[data-product-variant-id]');
    var priceEl = root.querySelector('[data-product-price]');
    var submitButton = root.querySelector('[data-product-submit]');
    var stockEl = root.querySelector('[data-product-stock]');
    var formatMoney = window.ASTER.utils.formatMoney;

    function matchVariant(selections) {
      return product.variants.find(function (variant) {
        return Object.keys(selections).every(function (position) {
          return variant['option' + position] === selections[position];
        });
      });
    }

    function currentSelections() {
      var selections = {};
      root.querySelectorAll('[data-product-option]:checked').forEach(function (input) {
        selections[input.getAttribute('data-option-position')] = input.value;
      });
      return selections;
    }

    function refreshAvailability(selections) {
      root.querySelectorAll('[data-product-option]').forEach(function (input) {
        var position = input.getAttribute('data-option-position');
        var test = Object.assign({}, selections);
        test[position] = input.value;
        var match = matchVariant(test);
        input.disabled = !match;
      });
    }

    function updateGallery(variant) {
      if (!variant || !variant.featured_media) return;
      var target = root.querySelector('[data-gallery-media-id="' + variant.featured_media.id + '"]');
      if (!target) return;
      var main = root.querySelector('[data-product-gallery]');
      if (!main) return;
      main.querySelectorAll('.product-gallery__slide').forEach(function (slide) {
        slide.classList.toggle('is-active', slide === target);
      });
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      root.querySelectorAll('.product-gallery__thumb').forEach(function (thumb) {
        thumb.classList.toggle('is-active', thumb.getAttribute('data-gallery-thumb-id') === String(variant.featured_media.id));
      });
    }

    function sync(pushState) {
      var selections = currentSelections();
      var match = matchVariant(selections);
      refreshAvailability(selections);

      if (!match) {
        submitButton.disabled = true;
        submitButton.querySelector('[data-button-text]').textContent = window.ASTER.strings.unavailable || 'Unavailable';
        return;
      }

      variantIdInput.value = match.id;
      submitButton.disabled = !match.available;
      submitButton.querySelector('[data-button-text]').textContent = match.available
        ? (window.ASTER.strings.addToCart || 'Add to cart')
        : (window.ASTER.strings.soldOut || 'Sold out');

      var onSale = match.compare_at_price > match.price;
      priceEl.classList.toggle('price--sale', onSale);
      priceEl.innerHTML = onSale
        ? '<span class="price__sale">' + formatMoney(match.price) + '</span><span class="price__compare">' + formatMoney(match.compare_at_price) + '</span>'
        : '<span class="price__regular">' + formatMoney(match.price) + '</span>';

      if (stockEl) {
        stockEl.hidden = !match.available;
      }

      updateGallery(match);

      if (pushState && window.history && match.id) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', match.id);
        window.history.replaceState({}, '', url);
      }
    }

    if (form) {
      form.addEventListener('change', function (event) {
        if (event.target.matches('[data-product-option]')) sync(true);
      });
    }

    root.querySelectorAll('[data-gallery-thumb-id]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var mediaId = thumb.getAttribute('data-gallery-thumb-id');
        var main = root.querySelector('[data-product-gallery]');
        var target = root.querySelector('[data-gallery-media-id="' + mediaId + '"]');
        if (!main || !target) return;
        main.querySelectorAll('.product-gallery__slide').forEach(function (slide) {
          slide.classList.toggle('is-active', slide === target);
        });
        root.querySelectorAll('.product-gallery__thumb').forEach(function (t) {
          t.classList.toggle('is-active', t === thumb);
        });
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    sync(false);
  });
})();
