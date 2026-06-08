(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var searchInput = document.querySelector('[data-site-search]');
  var regionFilter = document.querySelector('[data-region-filter]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));

  function getValue(element) {
    return element ? element.value.trim().toLowerCase() : '';
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var query = getValue(searchInput);
    var region = getValue(regionFilter);
    var type = getValue(typeFilter);

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
      var cardType = (card.getAttribute('data-type') || '').toLowerCase();
      var matchedQuery = !query || text.indexOf(query) !== -1;
      var matchedRegion = !region || cardRegion === region;
      var matchedType = !type || cardType === type;
      card.style.display = matchedQuery && matchedRegion && matchedType ? '' : 'none';
    });
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');
    if (initialQuery) {
      searchInput.value = initialQuery;
    }
    searchInput.addEventListener('input', filterCards);
  }

  if (regionFilter) {
    regionFilter.addEventListener('change', filterCards);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', filterCards);
  }

  filterCards();
})();
