import { H as Hls } from './hls-vendor-dru42stk.js';

(function () {
    var players = document.querySelectorAll('[data-player]');

    players.forEach(function (stage) {
        var video = stage.querySelector('video');
        var button = stage.querySelector('[data-play-button]');
        var source = stage.getAttribute('data-src');
        var hls = null;

        if (!video || !button || !source) {
            return;
        }

        function prepare() {
            if (stage.getAttribute('data-ready') === '1') {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (Hls && Hls.isSupported()) {
                hls = new Hls({
                    autoStartLoad: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            stage.setAttribute('data-ready', '1');
        }

        function startPlayback() {
            prepare();
            button.hidden = true;
            stage.classList.add('is-playing');
            video.controls = true;

            var playTask = video.play();

            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {
                    button.hidden = false;
                    stage.classList.remove('is-playing');
                });
            }
        }

        button.addEventListener('click', startPlayback);

        stage.addEventListener('click', function (event) {
            if (event.target === stage) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            button.hidden = true;
            stage.classList.add('is-playing');
        });

        video.addEventListener('ended', function () {
            button.hidden = false;
            stage.classList.remove('is-playing');
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
