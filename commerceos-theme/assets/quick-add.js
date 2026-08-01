/* ASTER: quick add modal — clones each product card's hidden template, wires variant selection. */
(function () {
  'use strict';

  function getVariants(form) {
    var script = form.querySelector('[data-quick-add-variants]');
    try {
      return JSON.parse(script.textContent);
    } catch (e) {
      return [];
    }
  }

  function matchVariant(variants, selections) {
    return variants.find(function (variant) {
      return Object.keys(selections).every(function (position) {
        var key = 'option' + position;
        return variant[key] === selections[position];
      });
    });
  }

  function refreshAvailability(form, variants, selections) {
    form.querySelectorAll('[data-quick-add-option]').forEach(function (input) {
      var position = input.getAttribute('data-option-position');
      var testSelections = Object.assign({}, selections);
      testSelections[position] = input.value;
      var match = matchVariant(variants, testSelections);
      input.disabled = !match;
    });
  }

  function updatePrice(form, variant) {
    var priceEl = form.parentElement.querySelector('.price');
    if (!priceEl || !variant) return;
    var formatMoney = window.ASTER.utils.formatMoney;
    var onSale = variant.compare_at_price > variant.price;
    priceEl.classList.toggle('price--sale', onSale);
    if (onSale) {
      priceEl.innerHTML =
        '<span class="price__sale">' + formatMoney(variant.price) + '</span>' +
        '<span class="price__compare">' + formatMoney(variant.compare_at_price) + '</span>';
    } else {
      priceEl.innerHTML = '<span class="price__regular">' + formatMoney(variant.price) + '</span>';
    }
  }

  function wireForm(container) {
    var form = container.querySelector('[data-quick-add-real-form]');
    if (!form) return;
    var variants = getVariants(form);
    var variantIdInput = form.querySelector('[data-quick-add-variant-id]');
    var submitButton = form.querySelector('[data-quick-add-submit]');

    function currentSelections() {
      var selections = {};
      form.querySelectorAll('[data-quick-add-option]:checked').forEach(function (input) {
        selections[input.getAttribute('data-option-position')] = input.value;
      });
      return selections;
    }

    function sync() {
      var selections = currentSelections();
      var match = matchVariant(variants, selections);
      refreshAvailability(form, variants, selections);
      if (match) {
        variantIdInput.value = match.id;
        updatePrice(form, match);
        submitButton.disabled = !match.available;
      } else {
        submitButton.disabled = true;
      }
    }

    form.addEventListener('change', function (event) {
      if (event.target.matches('[data-quick-add-option]')) sync();
    });

    sync();
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-quick-add-trigger]');
    if (!trigger) return;
    var card = trigger.closest('[data-product-card]');
    var template = card && card.querySelector('[data-quick-add-template]');
    var modal = document.querySelector('[data-quick-add-modal]');
    var content = modal && modal.querySelector('[data-quick-add-content]');
    if (!template || !modal || !content) return;

    content.innerHTML = '';
    content.appendChild(template.content.cloneNode(true));
    wireForm(content);

    modal.hidden = false;
    window.ASTER.openPanel(modal);
  });
})();
