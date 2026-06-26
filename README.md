# NERONE N9 — Graphic Design Portfolio

A dark, minimal, modern portfolio for logo design and complete brand-identity
packages. Pure HTML/CSS/JS — no build step, deploys anywhere (including GitHub
Pages).

## Structure

```
index.html              # the page
assets/
  css/styles.css        # all styling (dark + minimal theme)
  js/projects.js        # <-- the only file you edit to add work
  js/main.js            # rendering + interactions (no need to touch)
  img/projects/<slug>/  # logo + package images per project
```

## Adding a logo project

1. Drop the images into `assets/img/projects/<slug>/`.
2. Open `assets/js/projects.js` and fill in that project's object:
   title, client, year, description, tags, `cover`, and the `gallery` array.
3. Set `published: true`.

That's it — the card and its case-study view appear automatically.

## Preview locally

```
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on GitHub Pages

Settings → Pages → Build from branch → root. The `.nojekyll` file is included so
all assets are served as-is.
