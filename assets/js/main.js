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
  renderAll();
  observeReveals(document.querySelectorAll(".reveal"));
})();
