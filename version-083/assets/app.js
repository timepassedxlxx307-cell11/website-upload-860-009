(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var navPanel = document.querySelector('[data-nav-panel]');

    if (menuButton && navPanel) {
        menuButton.addEventListener('click', function () {
            navPanel.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var heroIndex = 0;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === heroIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === heroIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showHero(index);
        });
    });

    if (slides.length > 1) {
        showHero(0);
        window.setInterval(function () {
            showHero(heroIndex + 1);
        }, 5200);
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterScope(scope) {
        var queryInput = scope.querySelector('[data-search-input]');
        var activeChip = scope.querySelector('.filter-chip.active');
        var query = normalize(queryInput ? queryInput.value : '');
        var filter = normalize(activeChip ? activeChip.getAttribute('data-filter-value') : '');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-year'),
                card.getAttribute('data-type')
            ].join(' '));
            var passesQuery = !query || text.indexOf(query) !== -1;
            var passesFilter = !filter || text.indexOf(filter) !== -1;
            card.classList.toggle('hidden-card', !(passesQuery && passesFilter));
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]')).forEach(function (scope) {
        var queryInput = scope.querySelector('[data-search-input]');
        var chips = Array.prototype.slice.call(scope.querySelectorAll('.filter-chip'));

        if (queryInput) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                queryInput.value = q;
            }
            queryInput.addEventListener('input', function () {
                filterScope(scope);
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (item) {
                    item.classList.remove('active');
                });
                chip.classList.add('active');
                filterScope(scope);
            });
        });

        filterScope(scope);
    });
})();
