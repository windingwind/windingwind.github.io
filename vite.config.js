import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "vite";
import { marked } from "marked";
import { renderPublicationsHtml } from "@windingwind/pubs-renderer";
import { blogPlugin } from "./scripts/blog.js";
import { formatDate, lastModified } from "./scripts/utils.js";

/**
 * Renders the About markdown and the publication list into index.html at
 * build time, so the homepage ships fully rendered — no runtime layout work.
 */
function staticContentPlugin() {
  return {
    name: "static-content",
    async transformIndexHtml(html) {
      const aboutHtml = marked.parse(readFileSync("content/about.md", "utf8"));
      // Cache-busting query so edits are picked up per request in dev
      const configUrl = `${pathToFileURL(resolve("pubs.config.js")).href}?t=${Date.now()}`;
      const { default: pubConfig } = await import(configUrl);
      return html
        .replace("<!--ABOUT_CONTENT-->", aboutHtml)
        .replace("<!--PUB_LIST-->", renderPublicationsHtml(pubConfig));
    },
  };
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
  plugins: [staticContentPlugin(), sectionDatesPlugin(), blogPlugin()],
});
