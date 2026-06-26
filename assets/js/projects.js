/* ============================================================
   NERONE N9 — Project data
   ------------------------------------------------------------
   This is the only file that needs editing to add a logo/brand.
   Fill in one object per project. Set "published: true" once a
   project's details + images are ready, and it appears on the site.

   Image paths are relative to the site root, e.g.
     "assets/img/projects/<slug>/cover.png"
   ============================================================ */

const PROJECTS = [
  {
    slug: "nerone-n9",
    published: true,
    title: "NERONE N9 — Personal Brand",
    client: "Nervan Ghurchi (self)",
    year: "2025",
    category: "Logo & Brand Identity",
    description:
      "My own identity. A triangular monogram built from the initials, anchored " +
      "by a deep-maroon, black and white palette. The mark scales from a favicon " +
      "to a building sign — carried across a full stationery and merch system.",
    tags: ["Personal Brand", "Logo", "Monogram", "Stationery", "Signage"],
    cover: "assets/img/projects/nerone-n9/logo.png",
    gallery: [
      { src: "assets/img/projects/nerone-n9/logo.png", caption: "Primary logo — the NRG triangular monogram" },
      { src: "assets/img/projects/nerone-n9/business-card.png", caption: "Business cards — black stock with red edge paint" },
      { src: "assets/img/projects/nerone-n9/letterhead.png", caption: "Letterhead — dark stationery system" },
      { src: "assets/img/projects/nerone-n9/signage.png", caption: "Exterior signage — illuminated 3D studio sign" },
      { src: "assets/img/projects/nerone-n9/mug.png", caption: "Merch — branded ceramic mug" },
    ],
    meta: {
      "Designer": "Nervan Ghurchi",
      "Location": "Muscat, Oman",
      "Deliverables": "Logo, business card, letterhead, signage, merch",
      "Palette": "Maroon · Black · White",
    },
  },
  {
    slug: "project-02",
    published: false,
    title: "Project Two",
    client: "—",
    year: "—",
    category: "Logo & Brand Identity",
    description: "Awaiting details — NERONE N9 will fill this in.",
    tags: ["Logo", "Identity"],
    cover: "",
    gallery: [],
    meta: {},
  },
  {
    slug: "project-03",
    published: false,
    title: "Project Three",
    client: "—",
    year: "—",
    category: "Logo & Brand Identity",
    description: "Awaiting details — NERONE N9 will fill this in.",
    tags: ["Logo", "Identity"],
    cover: "",
    gallery: [],
    meta: {},
  },
  {
    slug: "project-04",
    published: false,
    title: "Project Four",
    client: "—",
    year: "—",
    category: "Logo & Brand Identity",
    description: "Awaiting details — NERONE N9 will fill this in.",
    tags: ["Logo", "Identity"],
    cover: "",
    gallery: [],
    meta: {},
  },
];
