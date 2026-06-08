(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
            image.classList.add('is-missing');
        });
    });

    var sliders = document.querySelectorAll('[data-hero-slider]');

    sliders.forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            if (slides.length < 2) {
                return;
            }

            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                stop();
                showSlide(dotIndex);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        showSlide(0);
        start();
    });

    var input = document.querySelector('[data-search-input]');
    var select = document.querySelector('[data-category-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-no-results]');

    function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var category = select ? select.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = card.getAttribute('data-search') || '';
            var cardCategory = card.getAttribute('data-category') || '';
            var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchedCategory = !category || cardCategory === category;
            var matched = matchedKeyword && matchedCategory;

            card.style.display = matched ? '' : 'none';

            if (matched) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    if (input) {
        input.addEventListener('input', applyFilter);
    }

    if (select) {
        select.addEventListener('change', applyFilter);
    }
})();
