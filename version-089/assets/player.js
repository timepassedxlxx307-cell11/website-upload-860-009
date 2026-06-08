(function () {
    window.mountMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var layer = document.getElementById(options.layerId);
        var button = document.getElementById(options.buttonId);
        var videoUrl = options.videoUrl;
        var prepared = false;
        var hlsInstance = null;

        if (!video || !layer || !button || !videoUrl) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(videoUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = videoUrl;
            }
        }

        function start(event) {
            if (event) {
                event.preventDefault();
            }
            prepare();
            layer.classList.add('is-hidden');
            var playResult = video.play();
            if (playResult && typeof playResult.catch === 'function') {
                playResult.catch(function () {
                    layer.classList.remove('is-hidden');
                });
            }
        }

        button.addEventListener('click', start);
        layer.addEventListener('click', start);
        video.addEventListener('play', function () {
            layer.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                layer.classList.remove('is-hidden');
            }
        });
        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
