# windingwind.github.io

Personal homepage, built with [Vite](https://vite.dev). Deployed automatically to GitHub Pages on every push to `main`.

## Editing content

- **About section** — edit [`content/about.md`](content/about.md) (markdown, inline HTML allowed).
- **Section dates** — the "last modified" dates under the About Me and Publications headings are filled in at build time from the last git commit touching `content/about.md` / `pubs.config.js` (or the file mtime while there are uncommitted changes). No manual updates needed.
- **Publications** — edit [`pubs.config.js`](pubs.config.js). Each entry supports `title`, `authors`, `image`, `conference`, `links` (empty values are skipped), `badges`, and an optional `comments` field rendered as a collapsible markdown abstract. The author matching `highlightName` is bolded automatically; entries without an `image` get a generated monogram placeholder. The rendering logic lives in the local package [`packages/pubs-renderer/`](packages/pubs-renderer/).
- **Paper project pages** — static sites in [`public/`](public/) (e.g. `public/neuralpvs/`, `public/seal-3d/`). They are copied verbatim to the site root, so URLs like `/neuralpvs/` are unchanged. Shared template assets (Bulma, Font Awesome, the Nerfies-style `index.css`/`index.js`, `zotero-meta.js`) are stored once in [`public/static/vendor/`](public/static/vendor/) and referenced as `../static/vendor/...`; third-party libraries available on npm (e.g. the `dics` image-comparison slider) are loaded from the jsDelivr CDN pinned to an exact version.

## Development

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the site and deploys `dist/` via GitHub Pages. The repository's Pages source must be set to **GitHub Actions** (Settings → Pages → Build and deployment).
