/* ASTER: faceted filtering + sorting for the collection grid, via the Section Rendering API. */
(function () {
  'use strict';

  var grid = document.querySelector('[data-collection-grid-wrapper]');
  if (!grid) return;

  var SECTION_ID = grid.getAttribute('data-section-id');

  function currentParams() {
    return new URLSearchParams(window.location.search);
  }

  function buildParamsFromFilters() {
    var params = new URLSearchParams();
    document.querySelectorAll('[data-filters-drawer] [data-filter-input]:checked').forEach(function (input) {
      params.append(input.name, input.value);
    });
    document.querySelectorAll('[data-filters-drawer] [data-filter-price-min], [data-filters-drawer] [data-filter-price-max]').forEach(function (input) {
      if (input.value) params.set(input.name, input.value);
    });
    var sortSelect = document.querySelector('[data-sort-select]');
    if (sortSelect && sortSelect.value) params.set('sort_by', sortSelect.value);
    return params;
  }

  function fetchAndRender(params, pushState) {
    grid.classList.add('is-loading');
    var url = window.location.pathname + '?' + params.toString() + (params.toString() ? '&' : '') + 'section_id=' + SECTION_ID;
    fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-collection-grid-wrapper]');
        if (fresh) {
          grid.replaceWith(fresh);
          grid = fresh;
          attachPaginationLinks();
        }
        if (pushState) {
          var newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
          window.history.pushState({}, '', newUrl);
        }
        window.scrollTo({ top: document.querySelector('[data-collection-top]')?.offsetTop || 0, behavior: 'smooth' });
      })
      .finally(function () {
        grid.classList.remove('is-loading');
      });
  }

  function applyFilters(pushState) {
    fetchAndRender(buildParamsFromFilters(), pushState !== false);
  }

  document.addEventListener('change', function (event) {
    if (event.target.matches('[data-filter-input], [data-sort-select]')) {
      applyFilters();
    }
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-filters-apply]')) {
      applyFilters();
      var drawer = document.querySelector('[data-filters-drawer]');
      if (drawer) window.ASTER.closePanel(drawer);
    }
    if (event.target.closest('[data-filters-clear]')) {
      document.querySelectorAll('[data-filter-input]').forEach(function (input) { input.checked = false; });
      document.querySelectorAll('[data-filter-price-min], [data-filter-price-max]').forEach(function (input) { input.value = ''; });
      applyFilters();
    }
    var removePill = event.target.closest('[data-active-filter-remove]');
    if (removePill) {
      var name = removePill.getAttribute('data-active-filter-remove');
      var value = removePill.getAttribute('data-active-filter-value');
      var params = currentParams();
      var remaining = params.getAll(name).filter(function (v) { return v !== value; });
      params.delete(name);
      remaining.forEach(function (v) { params.append(name, v); });
      fetchAndRender(params, true);
    }
    var pageLink = event.target.closest('[data-collection-grid-wrapper] .pagination__link[href]');
    if (pageLink) {
      event.preventDefault();
      var url = new URL(pageLink.href);
      fetchAndRender(url.searchParams, true);
    }
  });

  function attachPaginationLinks() {
    /* delegated click handler above already covers freshly injected markup */
  }
})();
