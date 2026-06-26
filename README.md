# Graphic Design Portfolio

A polished, responsive one-page portfolio showcasing **four logo & brand-identity packages**.
Built with plain HTML/CSS/JS — no build step, no dependencies. Host it free on GitHub Pages.

## Preview locally

Just open `index.html` in a browser. For a local server (recommended so fonts/paths behave):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
portfolio/
├── index.html          # all content & sections
├── css/styles.css      # theme, layout, animations
├── js/main.js          # nav, mobile menu, scroll reveals
└── assets/
    ├── logos/          # the four logo marks (SVG placeholders)
    └── mockups/        # drop product/brand mockup images here
```

## Make it yours — swap in your real work

The site currently ships with **placeholder logos and brand info** so it looks complete.
Replace them with your own in three easy passes:

### 1. Logos
Drop your logo files into `assets/logos/`. Either keep the existing filenames
(`aurora.svg`, `vertex.svg`, `lume.svg`, `summit.svg`) to swap automatically,
or use your own names and update the `src="assets/logos/..."` paths in `index.html`.
SVG is best (crisp at any size); high-res PNG with transparency also works.

> Note: in the **Work grid** thumbnails, logos are auto-inverted to show light-on-dark
> (`filter: invert(1)` in `css/styles.css`, class `.card__media img`). If your logos are
> already light/colored, remove that `filter` line.

### 2. Project names, descriptions & palettes
Each project is one `<article class="case">` block in `index.html`. For each, edit:
- the **title** and **tag** line,
- the **"brief" / "solution"** paragraphs,
- the **palette swatches** (`<div class="swatch" style="--c:#yourhex">`),
- the **typography** names,
- the **accent color** at the top of the article: `style="--accent:#...;--accent-soft:#..."`.

### 3. Mockups
Replace the dashed placeholder tiles with real images. For each `.mockup` div, swap:
```html
<div class="mockup" data-label="Coffee bag">Coffee&nbsp;Bag</div>
```
with:
```html
<div class="mockup"><img src="assets/mockups/aurora-bag.jpg" alt="Aurora coffee bag mockup" /></div>
```
(Image fills the tile automatically.)

### Personalize the rest
- **Contact email** is set to `ghurchinervan@gmail.com` — update the `mailto:` link in the Contact section.
- **Social links** (Instagram, Behance, Dribbble, LinkedIn) are `#` placeholders — add your URLs.
- **Brand name** in the nav (`Studio.`) and footer — rename to your studio/name.

## Deploy to GitHub Pages

1. Push this branch (or merge to `main`).
2. Repo **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**, pick the branch, folder `/ (root)`.
4. Your portfolio goes live at `https://<username>.github.io/portfolio/`.
