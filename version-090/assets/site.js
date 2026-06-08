(function () {
    var mobileToggle = document.querySelector('.mobile-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function () {
            var expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', String(!expanded));
            mobileMenu.hidden = expanded;
        });
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>\"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '\"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    }

    function attachSearch(form) {
        var input = form.querySelector('input[type="search"]');
        var results = form.querySelector('.search-results');
        if (!input || !results || !window.SiteSearch) {
            return;
        }

        function render() {
            var query = normalize(input.value);
            if (!query) {
                results.hidden = true;
                results.innerHTML = '';
                return;
            }

            var matches = window.SiteSearch.filter(function (item) {
                return normalize(item.title + ' ' + item.meta + ' ' + item.tags).indexOf(query) !== -1;
            }).slice(0, 8);

            if (!matches.length) {
                results.innerHTML = '<span>没有找到相关影片</span>';
                results.hidden = false;
                return;
            }

            results.innerHTML = matches.map(function (item) {
                return '<a href="' + encodeURI(item.href) + '"><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.meta) + '</small></a>';
            }).join('');
            results.hidden = false;
        }

        input.addEventListener('input', render);
        input.addEventListener('focus', render);
        document.addEventListener('click', function (event) {
            if (!form.contains(event.target)) {
                results.hidden = true;
            }
        });
        form.addEventListener('submit', function (event) {
            var query = normalize(input.value);
            if (!query) {
                return;
            }
            var match = window.SiteSearch.find(function (item) {
                return normalize(item.title).indexOf(query) !== -1;
            });
            if (match) {
                event.preventDefault();
                window.location.href = match.href;
            }
        });
    }

    Array.prototype.forEach.call(document.querySelectorAll('.search-form'), attachSearch);

    function initHero(slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer = null;

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
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        start();
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-hero-slider]'), initHero);

    function initPlayer(player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        if (!video) {
            return;
        }
        var source = video.getAttribute('data-source');
        var loaded = false;
        var hls = null;

        function load() {
            if (loaded || !source) {
                return;
            }
            loaded = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                video.src = source;
            }
        }

        function play() {
            load();
            player.classList.add('is-playing');
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {
                    player.classList.remove('is-playing');
                });
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }
        player.addEventListener('click', function (event) {
            if (event.target === video && loaded) {
                return;
            }
            if (!loaded) {
                play();
            }
        });
        video.addEventListener('play', function () {
            player.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0) {
                player.classList.remove('is-playing');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-video-player]'), initPlayer);
}());
