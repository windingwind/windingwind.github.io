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

/**
 * Adds ids to h1–h3 headings in rendered post HTML and collects them as
 * outline entries for the table of contents.
 */
function buildOutline(html) {
  const used = new Set();
  const headings = [];
  const withIds = html.replace(/<h([1-3])>([\s\S]*?)<\/h\1>/g, (_full, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id =
      text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || "section";
    for (let n = 2; used.has(id); n++) id = `${id.replace(/-\d+$/, "")}-${n}`;
    used.add(id);
    headings.push({ level: Number(level), text, id });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html: withIds, headings };
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
      const { html, headings } = buildOutline(marked.parse(body));
      const slug = file.replace(/\.md$/, "");
      const firstParagraph = (html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "").replace(/<[^>]+>/g, "");
      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date) : lastModified(`${BLOG_DIR}/${file}`),
        excerpt: data.description || firstParagraph,
        html,
        headings,
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
          <a class="blog-nav-item blog-nav-item-external" href="https://github.com/windingwind" aria-label="GitHub">
            <svg class="nav-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            <span class="nav-label">GitHub</span></a>
          <a class="blog-nav-item blog-nav-item-external" href="https://scholar.google.com/citations?user=74_PEUIAAAAJ" aria-label="Google Scholar">
            <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.749-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>
            <span class="nav-label">Google Scholar</span></a>
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

/** Sidebar outline of the post's headings, sticky-positioned on wide screens. */
function outlineHtml(headings) {
  if (!headings.length) return "";
  const minLevel = Math.min(...headings.map((h) => h.level));
  const items = headings
    .map(
      (h) =>
        `            <li class="post-toc-depth-${h.level - minLevel}"><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`,
    )
    .join("\n");
  return `
      <aside class="blog-sidebar">
        <nav class="post-toc" aria-label="Post outline">
          <h4>Contents</h4>
          <ul>
${items}
          </ul>
        </nav>
      </aside>`;
}

/** Highlights the outline entry of the section currently in view. */
const TOC_SPY_SCRIPT = `    <script>
      (function () {
        var links = document.querySelectorAll(".post-toc a");
        if (!links.length) return;
        var heads = Array.prototype.map.call(links, function (link) {
          return document.getElementById(decodeURIComponent(link.hash.slice(1)));
        });
        function update() {
          var current = -1;
          for (var i = 0; i < heads.length; i++) {
            if (heads[i] && heads[i].getBoundingClientRect().top <= 80) current = i;
          }
          for (var j = 0; j < links.length; j++) {
            links[j].classList.toggle("active", j === current);
          }
        }
        addEventListener("scroll", update, { passive: true });
        update();
      })();
    </script>`;

/** Older/newer navigation at the end of a post. Posts are sorted newest first. */
function postNavHtml(posts, index) {
  const newer = posts[index - 1];
  const older = posts[index + 1];
  if (!newer && !older) return "";
  const link = (post, cls, label) =>
    post
      ? `            <a class="post-nav-link ${cls}" href="/blog/${encodeURIComponent(post.slug)}/">
              <span class="post-nav-label">${label}</span>
              <span class="post-nav-title">${escapeHtml(post.title)}</span>
            </a>`
      : `            <span class="post-nav-spacer"></span>`;
  return `
          <nav class="post-nav" aria-label="Adjacent posts">
${link(older, "post-nav-older", "← Older")}
${link(newer, "post-nav-newer", "Newer →")}
          </nav>`;
}

function postPageHtml(post, posts, cssHref) {
  const index = posts.indexOf(post);
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
          </div>${postNavHtml(posts, index)}
          <p class="post-back-link"><a href="/#blog">← All posts</a></p>
        </article>
      </main>${outlineHtml(post.headings)}
    </div>
${TOC_SPY_SCRIPT}`,
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
          const posts = loadPosts();
          const post = posts.find((p) => p.slug === decodeURIComponent(match[1]));
          if (post) {
            res.setHeader("Content-Type", "text/html");
            return res.end(postPageHtml(post, posts, DEV_CSS_HREF));
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
          source: postPageHtml(post, posts, cssHref),
        });
      }
    },
  };
}
