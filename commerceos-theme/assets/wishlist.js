/* ASTER: client-side wishlist stored in localStorage (no app/backend required). */
(function () {
  'use strict';

  var STORAGE_KEY = 'aster:wishlist';

  function readWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function writeWishlist(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.ASTER.pubsub.publish('wishlist:updated', items);
  }

  function isSaved(items, id) {
    return items.some(function (item) { return String(item.id) === String(id); });
  }

  function syncButtons() {
    var items = readWishlist();
    document.querySelectorAll('[data-wishlist-toggle]').forEach(function (button) {
      var id = button.getAttribute('data-product-id');
      var saved = isSaved(items, id);
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
      button.setAttribute('aria-label', saved ? window.ASTER.strings.removeFromWishlist : window.ASTER.strings.addToWishlist);
      var icon = button.querySelector('.icon');
      if (icon) icon.classList.toggle('icon--heart-filled', saved);
    });
    var countEls = document.querySelectorAll('[data-wishlist-count]');
    countEls.forEach(function (el) { el.textContent = items.length; });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-wishlist-toggle]');
    if (!button) return;
    event.preventDefault();
    var id = button.getAttribute('data-product-id');
    var handle = button.getAttribute('data-product-handle');
    var items = readWishlist();
    if (isSaved(items, id)) {
      items = items.filter(function (item) { return String(item.id) !== String(id); });
    } else {
      items.push({ id: id, handle: handle });
    }
    writeWishlist(items);
    syncButtons();
  });

  window.ASTER.wishlist = { read: readWishlist, sync: syncButtons };

  function renderWishlistPage() {
    var grid = document.querySelector('[data-wishlist-grid]');
    var emptyState = document.querySelector('[data-wishlist-empty]');
    if (!grid) return;
    var items = readWishlist();

    if (!items.length) {
      grid.hidden = true;
      if (emptyState) emptyState.hidden = false;
      return;
    }
    if (emptyState) emptyState.hidden = true;
    grid.hidden = false;
    grid.innerHTML = '';

    var formatMoney = window.ASTER.utils.formatMoney;
    var root = (window.ASTER.routes.root_url || '/').replace(/\/$/, '');
    Promise.all(
      items.map(function (item) {
        return fetch(root + '/products/' + item.handle + '.js')
          .then(function (res) { return (res.ok ? res.json() : null); })
          .catch(function () { return null; });
      })
    ).then(function (products) {
      products.filter(Boolean).forEach(function (product) {
        var productUrl = root + '/products/' + product.handle;
        var card = document.createElement('article');
        card.className = 'product-card';

        var mediaLink = document.createElement('a');
        mediaLink.href = productUrl;
        mediaLink.className = 'product-card__media-link';
        mediaLink.innerHTML =
          '<div class="product-card__media product-card__media--' + (window.ASTER.settings.cardImageRatio || 'portrait') + '">' +
            '<img class="product-card__image product-card__image--primary" src="" loading="lazy">' +
          '</div>';
        mediaLink.querySelector('img').src = product.featured_image || '';
        mediaLink.querySelector('img').alt = product.title;

        var wishlistButton = document.createElement('button');
        wishlistButton.type = 'button';
        wishlistButton.className = 'product-card__wishlist';
        wishlistButton.setAttribute('data-wishlist-toggle', '');
        wishlistButton.setAttribute('data-product-id', product.id);
        wishlistButton.setAttribute('data-product-handle', product.handle);
        wishlistButton.setAttribute('aria-pressed', 'true');
        wishlistButton.innerHTML = '<svg class="icon icon--heart-filled" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.8-9.4C.7 7 2.4 3.6 6 3.1c2-.3 4 .7 6 3 2-2.3 4-3.3 6-3 3.6.5 5.3 3.9 3.8 7.5C19.5 15.4 12 20 12 20z"/></svg>';

        var info = document.createElement('div');
        info.className = 'product-card__info';
        var titleLink = document.createElement('a');
        titleLink.href = productUrl;
        titleLink.textContent = product.title;
        var titleEl = document.createElement('h3');
        titleEl.className = 'product-card__title';
        titleEl.appendChild(titleLink);
        var priceEl = document.createElement('div');
        priceEl.className = 'price';
        priceEl.innerHTML = '<span class="price__regular"></span>';
        priceEl.querySelector('.price__regular').textContent = formatMoney(product.price);
        info.appendChild(titleEl);
        info.appendChild(priceEl);

        card.appendChild(mediaLink);
        card.appendChild(wishlistButton);
        card.appendChild(info);
        grid.appendChild(card);
      });
      syncButtons();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncButtons();
    renderWishlistPage();
  });
  window.ASTER.pubsub.subscribe('wishlist:updated', renderWishlistPage);
})();
