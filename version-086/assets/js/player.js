(function () {
  function playVideo(video) {
    var playResult = video.play();
    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {});
    }
  }

  window.initMoviePlayer = function (source) {
    var video = document.getElementById('movie-player');
    var overlay = document.querySelector('[data-player-overlay]');
    var loaded = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function load() {
      if (loaded) {
        playVideo(video);
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          playVideo(video);
        }, { once: true });
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo(video);
        });
      } else {
        video.src = source;
        playVideo(video);
      }
    }

    function start() {
      hideOverlay();
      load();
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', hideOverlay);

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
})();
