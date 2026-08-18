import { readdirSync, readFileSync } from "node:fs";
import { marked } from "marked";
import { escapeHtml, formatDate, lastModified } from "./utils.js";

const BLOG_DIR = "content/blog";

/** Parses a minimal `key: value` frontmatter block. */
function parseFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: src };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(":");
    if (sep > 0) {
      data[line.slice(0, sep).trim()] = line
        .slice(sep + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
  return { data, body: src.slice(match[0].length) };
}

/** Loads all posts from content/blog/, newest first. */
export function loadPosts() {
  let files;
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return files
    .map((file) => {
      const src = readFileSync(`${BLOG_DIR}/${file}`, "utf8");
      const { data, body } = parseFrontmatter(src);
      const html = marked.parse(body);
      const slug = file.replace(/\.md$/, "");
      const firstParagraph = (html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "").replace(/<[^>]+>/g, "");
      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date) : lastModified(`${BLOG_DIR}/${file}`),
        excerpt: data.description || firstParagraph,
        html,
      };
    })
    .sort((a, b) => b.date - a.date);
}

/**
 * Classical page shell shared by the blog archive and post pages.
 * Mirrors index.html; the homepage itself stays authored there.
 */
function pageShell({ title, cssHref, content }) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="Xiangyu Wang" />
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐦‍⬛</text></svg>" />
  <link rel="stylesheet" href="${cssHref}" />
  <script>
    if (localStorage.getItem("theme-flipped") === "1") {
      document.documentElement.setAttribute("data-theme-flipped", "");
    }
  </script>
  <script defer data-domain="windingwind.github.io" src="https://plausible.io/js/script.js"></script>
</head>

<body>
  <div class="blog-masthead">
    <div class="container">
      <nav class="blog-nav">
        <div class="nav-left">
          <a class="blog-nav-item" href="/">Home</a>
          <a class="blog-nav-item" href="/#publications">Publications</a>
          <a class="blog-nav-item active" href="/#blog">Blog</a>
          <a class="blog-nav-item blog-nav-item-external" href="https://github.com/windingwind">GitHub</a>
          <a class="blog-nav-item blog-nav-item-external" href="https://scholar.google.com/citations?user=74_PEUIAAAAJ">Google Scholar</a>
        </div>
        <div class="nav-right">
          <input type="checkbox" id="theme-switch" class="theme-switch" aria-label="Toggle theme" />
          <label for="theme-switch" class="blog-nav-item theme-toggle" title="Toggle theme">
            <span class="theme-icon theme-icon-moon">🌙</span>
            <span class="theme-icon theme-icon-sun">☀️</span>
          </label>
        </div>
      </nav>
    </div>
  </div>

  <div class="container">
${content}
  </div>

  <footer class="blog-footer">
    <p>
      Blog template built for
      <a href="https://getbootstrap.com/">Bootstrap</a> by
      <a href="https://twitter.com/mdo">@mdo</a>.
    </p>
  </footer>

  <script>
    (function () {
      var themeSwitch = document.getElementById("theme-switch");
      themeSwitch.checked = document.documentElement.hasAttribute("data-theme-flipped");
      themeSwitch.addEventListener("change", function () {
        localStorage.setItem("theme-flipped", themeSwitch.checked ? "1" : "0");
        document.documentElement.toggleAttribute("data-theme-flipped", themeSwitch.checked);
      });
    })();
  </script>
</body>

</html>
`;
}

function postPageHtml(post, cssHref) {
  return pageShell({
    title: `${post.title} · Xiangyu Wang`,
    cssHref,
    content: `    <div class="row">
      <main class="blog-main">
        <article class="blog-post">
          <h2 class="blog-post-title">${escapeHtml(post.title)}</h2>
          <p class="blog-post-meta">${formatDate(post.date)}</p>
          <hr />
          <div class="markdown-body">
${post.html}
          </div>
          <p class="post-back-link"><a href="/#blog">← All posts</a></p>
        </article>
      </main>
    </div>`,
  });
}

/** Homepage "Blog" section: previews of all posts, newest first. */
function homePreviewsHtml(posts) {
  if (!posts.length) return "";
  const items = posts
    .map(
      (post) => `          <div class="post-preview">
            <h3 class="post-preview-title"><a href="/blog/${encodeURIComponent(post.slug)}/">${escapeHtml(post.title)}</a></h3>
            <p class="blog-post-meta">${formatDate(post.date)}</p>
            <p>${escapeHtml(post.excerpt)}</p>
          </div>`,
    )
    .join("\n");
  return `<div class="blog-post" id="blog">
          <h2 class="blog-post-title">Blog</h2>
          <p class="blog-post-meta">${formatDate(posts[0].date)}</p>
${items}
        </div>`;
}

const DEV_CSS_HREF = "/src/styles/main.css";

/**
 * Vite plugin: injects homepage previews, serves /blog/ pages in dev,
 * and emits static /blog/ HTML pages into the build.
 */
export function blogPlugin() {
  return {
    name: "blog",
    transformIndexHtml(html) {
      return html.replace("<!--BLOG_SECTION-->", homePreviewsHtml(loadPosts()));
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split("?")[0];
        const match = url.match(/^\/blog\/([^/]+)\/?(index\.html)?$/);
        if (match) {
          const post = loadPosts().find((p) => p.slug === decodeURIComponent(match[1]));
          if (post) {
            res.setHeader("Content-Type", "text/html");
            return res.end(postPageHtml(post, DEV_CSS_HREF));
          }
        }
        next();
      });
    },
    generateBundle(_options, bundle) {
      const cssAsset = Object.keys(bundle).find((name) => name.endsWith(".css"));
      const cssHref = `/${cssAsset}`;
      const posts = loadPosts();
      for (const post of posts) {
        this.emitFile({
          type: "asset",
          fileName: `blog/${post.slug}/index.html`,
          source: postPageHtml(post, cssHref),
        });
      }
    },
  };
}
