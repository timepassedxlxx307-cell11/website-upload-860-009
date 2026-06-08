(function () {
  var video = document.querySelector("[data-player]");
  var cover = document.querySelector("[data-player-cover]");
  var button = document.querySelector("[data-play-button]");
  var attached = false;

  if (!video) {
    return;
  }

  var source = video.getAttribute("data-source");

  var attach = function () {
    if (attached || !source) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  };

  var start = function () {
    attach();

    if (cover) {
      cover.classList.add("hide");
    }

    var ready = video.play();

    if (ready && typeof ready.catch === "function") {
      ready.catch(function () {});
    }
  };

  if (button) {
    button.addEventListener("click", start);
  }

  if (cover) {
    cover.addEventListener("click", start);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
})();
