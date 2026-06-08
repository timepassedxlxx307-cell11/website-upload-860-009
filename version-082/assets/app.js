(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function initMobileNavigation() {
        var button = $('.nav-toggle');
        var panel = $('.mobile-panel');
        if (!button || !panel) {
            return;
        }

        button.addEventListener('click', function () {
            var isOpen = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!isOpen));
            panel.hidden = isOpen;
        });
    }

    function initHero() {
        var slides = $all('.hero-slide');
        var dots = $all('.hero-dot');
        if (slides.length <= 1) {
            return;
        }

        var active = 0;
        var timer = null;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === active);
                dot.setAttribute('aria-pressed', String(dotIndex === active));
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5500);
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

        var hero = $('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
        }

        show(0);
        start();
    }

    function initSearchFilters() {
        var grid = $('[data-search-grid]');
        if (!grid) {
            return;
        }

        var cards = $all('[data-search-card]', grid);
        var queryInput = $('[data-filter-query]');
        var typeSelect = $('[data-filter-type]');
        var regionSelect = $('[data-filter-region]');
        var genreSelect = $('[data-filter-genre]');
        var yearSelect = $('[data-filter-year]');
        var countBox = $('[data-result-count]');
        var emptyBox = $('.no-results');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');

        if (initialQuery && queryInput) {
            queryInput.value = initialQuery;
        }

        function matches(card) {
            var query = normalize(queryInput && queryInput.value);
            var type = normalize(typeSelect && typeSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var genre = normalize(genreSelect && genreSelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var haystack = normalize(card.getAttribute('data-search'));
            var cardType = normalize(card.getAttribute('data-type'));
            var cardRegion = normalize(card.getAttribute('data-region'));
            var cardGenre = normalize(card.getAttribute('data-genre'));
            var cardYear = normalize(card.getAttribute('data-year'));

            return (!query || haystack.indexOf(query) >= 0)
                && (!type || cardType === type)
                && (!region || cardRegion === region)
                && (!genre || cardGenre.indexOf(genre) >= 0)
                && (!year || cardYear === year);
        }

        function applyFilters() {
            var visible = 0;
            cards.forEach(function (card) {
                var ok = matches(card);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (countBox) {
                countBox.textContent = '共找到 ' + visible + ' 部作品';
            }
            if (emptyBox) {
                emptyBox.style.display = visible ? 'none' : 'block';
            }
        }

        [queryInput, typeSelect, regionSelect, genreSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }

    function initPlayers() {
        $all('.js-player').forEach(function (player) {
            var video = $('video', player);
            var startButton = $('.player-start', player);
            var message = $('.player-message', player);
            var src = player.getAttribute('data-src');
            var initialized = false;
            var hlsInstance = null;

            function setMessage(text) {
                if (message) {
                    message.textContent = text;
                }
            }

            function beginPlayback() {
                if (!video || !src) {
                    setMessage('当前播放源不可用');
                    return;
                }

                player.classList.add('is-playing');

                if (!initialized) {
                    initialized = true;
                    if (window.Hls && window.Hls.isSupported()) {
                        hlsInstance = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: true
                        });
                        hlsInstance.loadSource(src);
                        hlsInstance.attachMedia(video);
                        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {
                                setMessage('播放已就绪，请点击视频开始');
                            });
                        });
                        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                            if (!data || !data.fatal) {
                                return;
                            }
                            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                                setMessage('网络波动，正在尝试重新加载');
                                hlsInstance.startLoad();
                            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                                setMessage('媒体解码异常，正在恢复');
                                hlsInstance.recoverMediaError();
                            } else {
                                setMessage('播放源加载失败，请稍后重试');
                                hlsInstance.destroy();
                            }
                        });
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = src;
                        video.addEventListener('loadedmetadata', function () {
                            video.play().catch(function () {
                                setMessage('播放已就绪，请点击视频开始');
                            });
                        }, { once: true });
                    } else {
                        setMessage('当前浏览器需要支持 HLS 才能播放 m3u8');
                    }
                } else {
                    video.play().catch(function () {
                        setMessage('播放已就绪，请点击视频开始');
                    });
                }
            }

            if (startButton) {
                startButton.addEventListener('click', beginPlayback);
            }

            video && video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
        });
    }

    function initBrokenImageFallback() {
        $all('img').forEach(function (img) {
            img.addEventListener('error', function () {
                img.closest('.poster-link, .horizontal-poster, .detail-cover, .hero-slide, .large-feature, .side-related-list')
                    ?.classList.add('image-missing');
                img.style.opacity = '0.08';
            }, { once: true });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNavigation();
        initHero();
        initSearchFilters();
        initPlayers();
        initBrokenImageFallback();
    });
})();
