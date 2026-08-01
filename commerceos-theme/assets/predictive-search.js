/* ASTER: predictive search via the Predictive Search JSON API (/search/suggest.json). */
(function () {
  'use strict';

  function renderResults(container, data, term) {
    var products = (data.resources && data.resources.results.products) || [];
    if (!products.length) {
      var message = (window.ASTER.strings.noResultsTemplate || 'No results found for "__TERM__"').replace('__TERM__', term);
      var emptyEl = document.createElement('p');
      emptyEl.className = 'predictive-search__empty';
      emptyEl.textContent = message;
      container.innerHTML = '';
      container.appendChild(emptyEl);
      container.hidden = false;
      return;
    }
    var formatMoney = window.ASTER.utils.formatMoney;
    container.innerHTML = products.map(function (product) {
      return (
        '<a class="predictive-search__item" href="' + product.url + '">' +
          (product.featured_image ? '<img src="' + product.featured_image.url + '" alt="" width="48" height="60">' : '') +
          '<span><span class="predictive-search__item-title">' + product.title + '</span>' +
          '<span class="predictive-search__item-price">' + formatMoney(product.price) + '</span></span>' +
        '</a>'
      );
    }).join('');
    container.hidden = false;
  }

  document.querySelectorAll('[data-predictive-search]').forEach(function (root) {
    var input = root.querySelector('[data-predictive-search-input]');
    var results = root.querySelector('[data-predictive-search-results]');
    if (!input || !results) return;

    var runSearch = window.ASTER.utils.debounce(function () {
      var term = input.value.trim();
      if (term.length < 2) {
        results.hidden = true;
        results.innerHTML = '';
        return;
      }
      fetch(window.ASTER.routes.predictive_search_url + '?q=' + encodeURIComponent(term) + '&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=last')
        .then(function (res) { return res.json(); })
        .then(function (data) { renderResults(results, data, term); })
        .catch(function () { results.hidden = true; });
    }, 250);

    input.addEventListener('input', runSearch);
    input.addEventListener('focus', function () {
      if (results.innerHTML) results.hidden = false;
    });
    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) results.hidden = true;
    });
  });
})();
