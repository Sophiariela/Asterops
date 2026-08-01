/* ASTER: hero banner slideshow — prev/next + dot navigation, no autoplay by default. */
(function () {
  'use strict';

  document.querySelectorAll('[data-slideshow]').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-banner__slide'));
    if (slides.length < 2) return;
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-slideshow-dot]'));
    var index = 0;

    function show(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === index); });
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === index); });
    }

    root.querySelectorAll('[data-slideshow-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () { show(index - 1); });
    });
    root.querySelectorAll('[data-slideshow-next]').forEach(function (btn) {
      btn.addEventListener('click', function () { show(index + 1); });
    });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); });
    });

    var autoplaySeconds = parseInt(root.getAttribute('data-autoplay'), 10);
    if (autoplaySeconds > 0) {
      setInterval(function () { show(index + 1); }, autoplaySeconds * 1000);
    }
  });
})();
