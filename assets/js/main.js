/* ============================================================
   NERONE N9 — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state + progress + wave parallax ---------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");
  var bgField = document.getElementById("bgField");
  var heroStage = document.getElementById("heroStage");
  var heroLogo = document.querySelector(".hero__logo");

  // measure the logo's natural centre (cached; refreshed on resize)
  var baseCX = 0, baseCY = 0;
  function measureHeroBase() {
    if (!heroLogo) return;
    heroLogo.classList.add("hero__logo--measuring");
    var r = heroLogo.getBoundingClientRect();
    baseCX = r.left + r.width / 2;
    baseCY = r.top + r.height / 2;
    heroLogo.classList.remove("hero__logo--measuring");
  }

  function updateHero(y) {
    if (!heroStage) return;
    var range = heroStage.offsetHeight - window.innerHeight;
    var hp = range > 0 ? Math.min(Math.max(y / range, 0), 1) : 0;
    // remap so the logo is fully centred by ~80%, then held until release
    var mp = Math.min(hp / 0.8, 1);
    heroStage.style.setProperty("--hp", mp.toFixed(4));
    // ride the logo to the centre of the viewport and scale it up
    var dx = (window.innerWidth / 2 - baseCX) * mp;
    var dy = (window.innerHeight / 2 - baseCY) * mp;
    var s = 1 + mp * 0.55;
    heroStage.style.setProperty("--logoX", dx.toFixed(1) + "px");
    heroStage.style.setProperty("--logoY", dy.toFixed(1) + "px");
    heroStage.style.setProperty("--logoS", s.toFixed(3));
    heroStage.setAttribute("data-faded", mp > 0.5 ? "1" : "0");
  }

  var ticking = false;
  function applyScroll() {
    ticking = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? y / h : 0;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (progress) progress.style.width = p * 100 + "%";
    // gently drift the wave field as the page scrolls
    if (bgField) bgField.style.setProperty("--p", p.toFixed(4));
    updateHero(y);
  }
  measureHeroBase();
  window.addEventListener("resize", function () {
    measureHeroBase();
    applyScroll();
  });
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(applyScroll);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  applyScroll();

  /* ---------- Render work grids (Logos + 3D) ---------- */
  var logosGrid = document.getElementById("logosGrid");
  var threedGrid = document.getElementById("threedGrid");
  var live = (typeof PROJECTS !== "undefined" ? PROJECTS : []).filter(function (p) {
    return p.published;
  });

  var PLACEHOLDER =
    "this.parentNode.innerHTML='<div class=\\'project-card__placeholder\\'><span>N9</span>Image coming soon</div>'";

  function cardMedia(p, index) {
    if (p.cover) {
      return (
        '<img src="' + p.cover + '" alt="' + escapeHtml(p.title) + ' logo" loading="lazy" ' +
        'onerror="' + PLACEHOLDER + '" />'
      );
    }
    return (
      '<div class="project-card__placeholder"><span>N9</span>' +
      "Coming soon</div>"
    );
  }

  function tagList(tags) {
    return (tags || [])
      .map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + "</span>";
      })
      .join("");
  }

  function cardHtml(p, i) {
    var num = String(i + 1).padStart(2, "0");
    var mediaClass = "project-card__media" + (p.coverFit === "contain" ? " project-card__media--contain" : "");
    return (
      '<article class="project-card" data-slug="' + p.slug + '" tabindex="0" role="button" aria-label="Open ' + escapeHtml(p.title) + ' case study">' +
        '<div class="' + mediaClass + '">' +
          '<span class="project-card__num">' + num + "</span>" +
          '<span class="project-card__view">View case →</span>' +
          cardMedia(p, i) +
        "</div>" +
        '<div class="project-card__body">' +
          '<h3 class="project-card__title">' + escapeHtml(p.title) + "</h3>" +
          '<p class="project-card__desc">' + escapeHtml(p.description) + "</p>" +
          '<div class="project-card__tags">' + tagList(p.tags) + "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderGrid(grid, items, emptyMsg) {
    if (!grid) return;
    if (!items.length) {
      grid.innerHTML = '<div class="work__empty">' + emptyMsg + "</div>";
      return;
    }
    grid.innerHTML = items
      .map(function (p, i) {
        return cardHtml(p, i);
      })
      .join("");

    Array.prototype.forEach.call(grid.querySelectorAll(".project-card"), function (card) {
      card.addEventListener("click", function () {
        openCase(card.getAttribute("data-slug"));
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCase(card.getAttribute("data-slug"));
        }
      });
    });

    observeReveals(grid.querySelectorAll(".project-card"));
  }

  function renderAll() {
    var logos = live.filter(function (p) { return (p.type || "logo") === "logo"; });
    var threed = live.filter(function (p) { return p.type === "3d"; });
    renderGrid(logosGrid, logos, "Logo projects are being added — check back soon.");
    renderGrid(threedGrid, threed, "3D projects are being added — check back soon.");
  }

  /* ---------- Case overlay ---------- */
  var overlay = document.getElementById("overlay");
  var overlayContent = document.getElementById("overlayContent");
  var overlayClose = document.getElementById("overlayClose");

  function openCase(slug) {
    var p = live.find(function (x) {
      return x.slug === slug;
    });
    if (!p || !overlay) return;

    var metaHtml = "";
    var metaKeys = Object.keys(p.meta || {});
    var baseMeta = [];
    if (p.client && p.client !== "—") baseMeta.push(["Client", p.client]);
    if (p.year && p.year !== "—") baseMeta.push(["Year", p.year]);
    if (p.category) baseMeta.push(["Discipline", p.category]);
    var extraMeta = metaKeys.map(function (k) {
      return [k, p.meta[k]];
    });
    var allMeta = baseMeta.concat(extraMeta);
    if (allMeta.length) {
      metaHtml =
        '<dl class="case__meta">' +
        allMeta
          .map(function (pair) {
            return "<div><dt>" + escapeHtml(pair[0]) + "</dt><dd>" + escapeHtml(pair[1]) + "</dd></div>";
          })
          .join("") +
        "</dl>";
    }

    var storyHtml = "";
    if (p.story && p.story.length) {
      storyHtml =
        '<div class="case__story"><h3 class="case__story-title">The concept</h3>' +
        p.story
          .map(function (par) {
            return "<p>" + escapeHtml(par) + "</p>";
          })
          .join("") +
        "</div>";
    }

    var galleryHtml;
    if (p.gallery && p.gallery.length) {
      galleryHtml =
        '<div class="case__gallery">' +
        p.gallery
          .map(function (g) {
            var cap = g.caption ? "<figcaption>" + escapeHtml(g.caption) + "</figcaption>" : "";
            var onerr = "this.closest('.case__figure').style.display='none'";
            return '<figure class="case__figure"><img src="' + g.src + '" alt="' + escapeHtml(g.caption || p.title) + '" loading="lazy" onerror="' + onerr + '" />' + cap + "</figure>";
          })
          .join("") +
        "</div>";
    } else {
      galleryHtml = '<div class="case__gallery--placeholder">Full package visuals coming soon.</div>';
    }

    overlayContent.innerHTML =
      '<p class="case__eyebrow">' + escapeHtml(p.category || "Brand Identity") + "</p>" +
      '<h2 class="case__title">' + escapeHtml(p.title) + "</h2>" +
      '<p class="case__desc">' + escapeHtml(p.description) + "</p>" +
      '<div class="case__tags">' + tagList(p.tags) + "</div>" +
      metaHtml +
      storyHtml +
      galleryHtml;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // wire gallery images to the lightbox
    currentGallery = p.gallery || [];
    Array.prototype.forEach.call(overlayContent.querySelectorAll(".case__figure img"), function (img, i) {
      img.addEventListener("click", function () {
        openLightbox(i);
      });
    });
  }

  function closeCase() {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    overlay.scrollTop = 0;
  }

  if (overlayClose) overlayClose.addEventListener("click", closeCase);
  if (overlay)
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeCase();
    });

  /* ---------- Lightbox (swipeable image viewer) ---------- */
  var currentGallery = [];
  var lbIndex = 0;
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCaption = document.getElementById("lbCaption");
  var lbCounter = document.getElementById("lbCounter");

  function renderLightbox() {
    var item = currentGallery[lbIndex];
    if (!item || !lbImg) return;
    lbImg.style.opacity = "0";
    var loader = new Image();
    loader.onload = function () {
      lbImg.src = item.src;
      lbImg.alt = item.caption || "";
      lbImg.style.opacity = "1";
    };
    loader.src = item.src;
    if (lbCaption) lbCaption.textContent = item.caption || "";
    if (lbCounter) lbCounter.textContent = (lbIndex + 1) + " / " + currentGallery.length;
  }
  function openLightbox(i) {
    if (!lightbox || !currentGallery.length) return;
    lbIndex = i;
    renderLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  function lbStep(dir) {
    if (!currentGallery.length) return;
    lbIndex = (lbIndex + dir + currentGallery.length) % currentGallery.length;
    renderLightbox();
  }
  function lightboxOpen() {
    return lightbox && lightbox.classList.contains("open");
  }

  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { lbStep(-1); });
  if (lbNext) lbNext.addEventListener("click", function () { lbStep(1); });
  if (lightbox)
    lightbox.addEventListener("click", function (e) {
      // click on the backdrop (not the image or a button) closes
      if (e.target === lightbox || e.target.classList.contains("lightbox__figure")) closeLightbox();
    });

  // swipe (touch) + drag (mouse) navigation
  var swipeX = null;
  function swipeStart(x) { swipeX = x; }
  function swipeEnd(x) {
    if (swipeX === null) return;
    var dx = x - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 45) lbStep(dx < 0 ? 1 : -1);
  }
  if (lightbox) {
    lightbox.addEventListener("touchstart", function (e) { swipeStart(e.changedTouches[0].clientX); }, { passive: true });
    lightbox.addEventListener("touchend", function (e) { swipeEnd(e.changedTouches[0].clientX); }, { passive: true });
  }

  document.addEventListener("keydown", function (e) {
    if (lightboxOpen()) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") lbStep(1);
      else if (e.key === "ArrowLeft") lbStep(-1);
      return;
    }
    if (e.key === "Escape") closeCase();
  });

  /* ---------- Reveal on scroll ---------- */
  function observeReveals(nodes) {
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nodes, function (n) {
        n.classList.add("in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    Array.prototype.forEach.call(nodes, function (n) {
      io.observe(n);
    });
  }

  /* ---------- Utils ---------- */
  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- About portrait cinematic reveal ---------- */
  var aboutPortrait = document.getElementById("aboutPortrait");
  var aboutCv       = document.getElementById("aboutCv");
  var aboutSection  = document.getElementById("about");

  if (aboutPortrait && aboutCv && aboutSection) {
    // Hide CV until the animation plays
    aboutCv.classList.add("cv--hidden");

    var portraitIo = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      portraitIo.disconnect();

      // Phase 1 — portrait fades in
      setTimeout(function () { aboutPortrait.classList.add("p1"); }, 80);
      // Phase 2 — portrait blurs
      setTimeout(function () { aboutPortrait.classList.add("p2"); }, 1200);
      // Phase 3 — CV content rises in
      setTimeout(function () {
        aboutCv.classList.remove("cv--hidden");
        aboutCv.classList.add("cv--visible");
      }, 1900);
      // Phase 4 — portrait dims to almost nothing behind text
      setTimeout(function () { aboutPortrait.classList.add("p3"); }, 2500);

    }, { threshold: 0.12 });

    portraitIo.observe(aboutSection);
  }

  /* ---------- Init ---------- */
  renderAll();
  observeReveals(document.querySelectorAll(".reveal"));
})();
