(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var navToggle = $('[data-nav-toggle]');
  var mobilePanel = $('[data-mobile-panel]');
  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  $all('[data-site-search]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = $('input', form);
      var query = input ? input.value.trim() : '';
      var target = './search.html';
      if (query) {
        target += '?q=' + encodeURIComponent(query);
      }
      window.location.href = target;
    });
  });

  var slides = $all('.hero-slide');
  var dots = $all('.hero-dot');
  var current = 0;
  function activateHero(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      activateHero(i);
    });
  });
  if (slides.length > 1) {
    window.setInterval(function () {
      activateHero(current + 1);
    }, 6200);
  }

  function normalize(text) {
    return String(text || '').toLowerCase();
  }

  var searchPage = $('[data-search-page]');
  if (searchPage) {
    var input = $('[data-search-input]');
    var select = $('[data-filter-select]');
    var cards = $all('[data-search-item]');
    var empty = $('[data-empty]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    if (input && initialQuery) {
      input.value = initialQuery;
    }
    function filterCards() {
      var q = normalize(input ? input.value : '');
      var cat = select ? select.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search-item'));
        var category = card.getAttribute('data-category') || '';
        var matchText = !q || haystack.indexOf(q) !== -1;
        var matchCat = !cat || category === cat;
        var show = matchText && matchCat;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }
    if (input) {
      input.addEventListener('input', filterCards);
    }
    if (select) {
      select.addEventListener('change', filterCards);
    }
    filterCards();
  }

  $all('.video-shell').forEach(function (shell) {
    var video = $('.movie-player', shell);
    var overlay = $('.play-overlay', shell);
    if (!video) {
      return;
    }
    var sourceEl = $('source', video);
    var src = sourceEl ? sourceEl.getAttribute('src') : video.getAttribute('src');
    if (src && window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (src && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
    function playVideo() {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }
    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
    });
  });
})();
