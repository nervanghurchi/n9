/* ============================================================
   NERONE N9 — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state + progress ---------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Render work grid ---------- */
  var grid = document.getElementById("workGrid");
  var live = (typeof PROJECTS !== "undefined" ? PROJECTS : []).filter(function (p) {
    return p.published;
  });

  function cardMedia(p, index) {
    if (p.cover) {
      return '<img src="' + p.cover + '" alt="' + escapeHtml(p.title) + ' logo" loading="lazy" />';
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

  function renderGrid() {
    if (!grid) return;
    if (!live.length) {
      grid.innerHTML =
        '<div class="work__empty">Work is being added — check back soon.</div>';
      return;
    }
    grid.innerHTML = live
      .map(function (p, i) {
        var num = String(i + 1).padStart(2, "0");
        return (
          '<article class="project-card" data-slug="' + p.slug + '" tabindex="0" role="button" aria-label="Open ' + escapeHtml(p.title) + ' case study">' +
            '<div class="project-card__media">' +
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
      })
      .join("");

    // wire up clicks
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

    var galleryHtml;
    if (p.gallery && p.gallery.length) {
      galleryHtml =
        '<div class="case__gallery">' +
        p.gallery
          .map(function (g) {
            var cap = g.caption ? "<figcaption>" + escapeHtml(g.caption) + "</figcaption>" : "";
            return '<figure class="case__figure"><img src="' + g.src + '" alt="' + escapeHtml(g.caption || p.title) + '" loading="lazy" />' + cap + "</figure>";
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
      galleryHtml;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
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
  document.addEventListener("keydown", function (e) {
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

  /* ---------- Init ---------- */
  renderGrid();
  observeReveals(document.querySelectorAll(".reveal"));
})();
