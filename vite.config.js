import { execSync } from "node:child_process";
import { statSync } from "node:fs";
import { defineConfig } from "vite";
import { marked } from "marked";

/**
 * Transforms `.md` imports into JS modules exporting the rendered HTML
 * string, so markdown is compiled at build time and ships as plain HTML.
 */
function markdownPlugin() {
  return {
    name: "markdown-to-html",
    transform(src, id) {
      if (!id.endsWith(".md")) return;
      const html = marked.parse(src);
      return { code: `export default ${JSON.stringify(html)};`, map: null };
    },
  };
}

/**
 * Last-modified date of a source file: the last git commit that touched it,
 * or the filesystem mtime while it has uncommitted changes.
 */
function lastModified(file) {
  try {
    const dirty = execSync(`git status --porcelain -- "${file}"`).toString().trim();
    if (!dirty) {
      const iso = execSync(`git log -1 --format=%cI -- "${file}"`).toString().trim();
      if (iso) return new Date(iso);
    }
  } catch {
    // not a git checkout — fall through to mtime
  }
  return statSync(file).mtime;
}

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

/**
 * Replaces {{ABOUT_DATE}} / {{PUBS_DATE}} in index.html with the
 * last-modified dates of each section's content source.
 */
function sectionDatesPlugin() {
  return {
    name: "section-dates",
    transformIndexHtml(html) {
      return html
        .replaceAll("{{ABOUT_DATE}}", formatDate(lastModified("content/about.md")))
        .replaceAll("{{PUBS_DATE}}", formatDate(lastModified("pubs.config.js")));
    },
  };
}

export default defineConfig({
  plugins: [markdownPlugin(), sectionDatesPlugin()],
});
