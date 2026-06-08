(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            var value = input ? input.value.trim() : '';
            if (value) {
                event.preventDefault();
                window.location.href = './search.html?q=' + encodeURIComponent(value);
            }
        });
    });

    function updateCards(value) {
        var query = (value || '').trim().toLowerCase();
        var visible = 0;
        document.querySelectorAll('[data-search-card]').forEach(function (card) {
            var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
            var matched = !query || text.indexOf(query) !== -1;
            card.hidden = !matched;
            if (matched) {
                visible += 1;
            }
        });
        document.querySelectorAll('[data-empty-state]').forEach(function (empty) {
            empty.hidden = visible !== 0;
        });
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    var filterInputs = document.querySelectorAll('[data-filter-input]');
    filterInputs.forEach(function (input) {
        if (initialQuery) {
            input.value = initialQuery;
        }
        input.addEventListener('input', function () {
            updateCards(input.value);
        });
    });
    if (initialQuery || filterInputs.length) {
        updateCards(initialQuery);
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function setSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                setSlide(current + 1);
            }, 5600);
        }
    }
})();
