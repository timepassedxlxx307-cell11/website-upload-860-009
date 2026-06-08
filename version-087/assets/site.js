(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
  const heroDots = Array.from(document.querySelectorAll(".hero-dot"));

  if (heroSlides.length > 1) {
    let activeHero = 0;

    function activateHero(index) {
      activeHero = (index + heroSlides.length) % heroSlides.length;

      heroSlides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeHero);
      });

      heroDots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeHero);
      });
    }

    heroDots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        activateHero(Number(dot.dataset.heroTarget || 0));
      });
    });

    setInterval(function () {
      activateHero(activeHero + 1);
    }, 6500);
  }

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    const input = scope.querySelector(".local-filter-input");
    const year = scope.querySelector(".local-filter-year");
    const region = scope.querySelector(".local-filter-region");
    const type = scope.querySelector(".local-filter-type");
    const cards = Array.from(scope.querySelectorAll(".movie-card"));

    function filterCards() {
      const query = input ? input.value.trim().toLowerCase() : "";
      const selectedYear = year ? year.value : "";
      const selectedRegion = region ? region.value : "";
      const selectedType = type ? type.value : "";

      cards.forEach(function (card) {
        const text = [
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.tags
        ].join(" ").toLowerCase();

        const matchesQuery = !query || text.includes(query);
        const matchesYear = !selectedYear || card.dataset.year === selectedYear;
        const matchesRegion = !selectedRegion || card.dataset.region === selectedRegion;
        const matchesType = !selectedType || card.dataset.type === selectedType;

        card.classList.toggle("is-hidden-card", !(matchesQuery && matchesYear && matchesRegion && matchesType));
      });
    }

    [input, year, region, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", filterCards);
        control.addEventListener("change", filterCards);
      }
    });
  });

  const globalInput = document.getElementById("global-search-input");
  const globalType = document.getElementById("global-type-filter");
  const globalButton = document.getElementById("global-search-button");
  const globalResults = document.getElementById("global-search-results");

  if (globalInput && globalResults && Array.isArray(window.SITE_MOVIES)) {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";
    globalInput.value = initialQuery;

    function movieCard(item) {
      const meta = [item.year, item.type, "★ " + item.rating].join(" · ");
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + item.url + '">',
        '    <img src="' + item.cover + '" alt="' + item.title.replace(/"/g, "&quot;") + '" loading="lazy">',
        '    <span class="card-badge card-badge-left">' + item.category + '</span>',
        '    <span class="card-badge card-badge-right">' + item.year + '</span>',
        '  </a>',
        '  <div class="card-content">',
        '    <h3><a href="' + item.url + '">' + item.title + '</a></h3>',
        '    <p>' + item.description + '</p>',
        '    <div class="card-meta"><span>' + meta + '</span><span>' + item.region + '</span></div>',
        '  </div>',
        '</article>'
      ].join("");
    }

    function renderGlobalResults() {
      const query = globalInput.value.trim().toLowerCase();
      const selectedType = globalType ? globalType.value : "";
      let results = window.SITE_MOVIES.filter(function (item) {
        const text = [item.title, item.year, item.region, item.type, item.genre, item.tags, item.category].join(" ").toLowerCase();
        const matchesQuery = !query || text.includes(query);
        const matchesType = !selectedType || item.type === selectedType;
        return matchesQuery && matchesType;
      });

      results = results.slice(0, 120);
      globalResults.innerHTML = results.map(movieCard).join("");
    }

    globalInput.addEventListener("input", renderGlobalResults);
    if (globalType) {
      globalType.addEventListener("change", renderGlobalResults);
    }
    if (globalButton) {
      globalButton.addEventListener("click", renderGlobalResults);
    }
    renderGlobalResults();
  }
})();
