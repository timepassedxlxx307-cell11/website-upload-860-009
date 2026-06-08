(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var active = 0;

    var show = function (index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, idx) {
        slide.classList.toggle("active", idx === active);
      });

      dots.forEach(function (dot, idx) {
        dot.classList.toggle("active", idx === active);
      });
    };

    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        show(idx);
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(active - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(active + 1);
      });
    }

    window.setInterval(function () {
      show(active + 1);
    }, 5500);

    show(0);
  }

  var normalize = function (value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  };

  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));

  forms.forEach(function (form) {
    var input = form.querySelector("[data-filter-input]");

    if (!input) {
      return;
    }

    var filter = function () {
      var query = normalize(input.value);
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.textContent
        ].join(" "));

        var matched = !query || haystack.indexOf(query) !== -1;
        card.style.display = matched ? "" : "none";

        if (matched) {
          visible += 1;
        }
      });

      Array.prototype.slice.call(document.querySelectorAll("[data-empty-state]")).forEach(function (item) {
        item.classList.toggle("show", Boolean(query) && visible === 0);
      });
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      filter();
    });

    input.addEventListener("input", filter);
  });
})();
