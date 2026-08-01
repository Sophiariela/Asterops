/* ASTER: desktop mega menu open/close on hover + keyboard focus. */
(function () {
  'use strict';

  var closeTimer;

  function openItem(item) {
    clearTimeout(closeTimer);
    document.querySelectorAll('.header__nav-item.is-open').forEach(function (open) {
      if (open !== item) open.classList.remove('is-open');
    });
    item.classList.add('is-open');
  }

  function scheduleClose(item) {
    closeTimer = setTimeout(function () { item.classList.remove('is-open'); }, 150);
  }

  document.querySelectorAll('[data-has-megamenu]').forEach(function (item) {
    item.addEventListener('mouseenter', function () { openItem(item); });
    item.addEventListener('mouseleave', function () { scheduleClose(item); });
    item.addEventListener('focusin', function () { openItem(item); });
    item.addEventListener('focusout', function (event) {
      if (!item.contains(event.relatedTarget)) item.classList.remove('is-open');
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      document.querySelectorAll('.header__nav-item.is-open').forEach(function (item) {
        item.classList.remove('is-open');
      });
    }
  });
})();
