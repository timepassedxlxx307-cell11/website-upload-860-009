(function () {
    function select(selector, root) {
        return (root || document).querySelector(selector);
    }

    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMobileMenu() {
        var toggle = select('[data-menu-toggle]');
        var menu = select('[data-mobile-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = select('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var previous = select('[data-hero-prev]', hero);
        var next = select('[data-hero-next]', hero);
        var current = 0;
        var timer;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function restart() {
            window.clearInterval(timer);
            start();
        }

        if (previous) {
            previous.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')));
                restart();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    function initSearch() {
        var layer = select('[data-search-layer]');
        var openButtons = selectAll('[data-search-open]');
        var closeButton = select('[data-search-close]');
        var input = select('[data-search-input]');
        var results = select('[data-search-results]');
        var data = window.SITE_SEARCH_DATA || [];

        if (!layer || !input || !results) {
            return;
        }

        function close() {
            layer.classList.remove('is-open');
            layer.setAttribute('aria-hidden', 'true');
        }

        function open() {
            layer.classList.add('is-open');
            layer.setAttribute('aria-hidden', 'false');
            input.focus();
        }

        function render(items) {
            if (!items.length) {
                results.innerHTML = '<div class="search-item"><strong>没有找到相关影片</strong><span>请更换关键词重新搜索</span></div>';
                return;
            }
            results.innerHTML = items.slice(0, 14).map(function (item) {
                return '<a class="search-item" href="' + item.href + '">' +
                    '<strong>' + item.title + '</strong>' +
                    '<span>' + item.year + ' · ' + item.region + ' · ' + item.category + '</span>' +
                    '</a>';
            }).join('');
        }

        function search() {
            var keyword = input.value.trim().toLowerCase();
            if (!keyword) {
                render(data.slice(0, 10));
                return;
            }
            var matched = data.filter(function (item) {
                return item.title.toLowerCase().indexOf(keyword) > -1 ||
                    item.year.toLowerCase().indexOf(keyword) > -1 ||
                    item.region.toLowerCase().indexOf(keyword) > -1 ||
                    item.category.toLowerCase().indexOf(keyword) > -1 ||
                    item.genre.toLowerCase().indexOf(keyword) > -1;
            });
            render(matched);
        }

        openButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                open();
                search();
            });
        });

        if (closeButton) {
            closeButton.addEventListener('click', close);
        }

        layer.addEventListener('click', function (event) {
            if (event.target === layer) {
                close();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                close();
            }
        });

        input.addEventListener('input', search);
    }

    function initFilters() {
        var list = select('[data-card-list]');
        if (!list) {
            return;
        }
        var cards = selectAll('.movie-card', list);
        var input = select('[data-filter-input]');
        var year = select('[data-filter-year]');
        var region = select('[data-filter-region]');
        var empty = select('[data-empty-state]');

        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var yearValue = year ? year.value : '';
            var regionValue = region ? region.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-type')
                ].join(' ').toLowerCase();
                var matchedKeyword = !keyword || text.indexOf(keyword) > -1;
                var matchedYear = !yearValue || card.getAttribute('data-year') === yearValue;
                var matchedRegion = !regionValue || card.getAttribute('data-region') === regionValue;
                var matched = matchedKeyword && matchedYear && matchedRegion;
                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [input, year, region].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initSearch();
        initFilters();
    });
})();
