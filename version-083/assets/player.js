(function () {
    window.setupMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var trigger = document.getElementById(options.triggerId);
        var source = options.source;
        var attached = false;
        var hls = null;

        if (!video || !trigger || !source) {
            return;
        }

        function attachSource() {
            if (attached) {
                return;
            }
            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                return;
            }

            video.src = source;
        }

        function startPlayback() {
            attachSource();
            trigger.classList.add('is-hidden');
            var playResult = video.play();
            if (playResult && typeof playResult.catch === 'function') {
                playResult.catch(function () {
                    trigger.classList.remove('is-hidden');
                });
            }
        }

        trigger.addEventListener('click', startPlayback);
        video.addEventListener('click', function () {
            if (!attached) {
                startPlayback();
            }
        });
        video.addEventListener('play', function () {
            trigger.classList.add('is-hidden');
        });
        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
