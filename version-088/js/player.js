(function () {
    function init(options) {
        var video = document.getElementById(options.videoId);
        var button = document.getElementById(options.buttonId);
        var message = document.getElementById(options.messageId);
        var source = options.source;
        var hlsInstance = null;

        if (!video || !button || !source) {
            return;
        }

        function showMessage() {
            if (message) {
                message.hidden = false;
            }
        }

        function attachSource() {
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage();
                    }
                });
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            showMessage();
        }

        function play() {
            button.classList.add('is-hidden');
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        }

        attachSource();

        button.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            } else {
                video.pause();
                button.classList.remove('is-hidden');
            }
        });

        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });

        video.addEventListener('pause', function () {
            button.classList.remove('is-hidden');
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.MoviePlayer = {
        init: init
    };
})();
