import { marked } from "marked";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Renders the publication list from pubs.config.js to an HTML string. */
export function renderPublicationsHtml(config) {
  const items = config.publications
    .map(
      (pub) => `<li class="pub-item">
${renderImageCell(pub.image, pub.title)}
${renderContentCell(pub, config)}
</li>`,
    )
    .join("\n");
  return `<ul class="pub-items">\n${items}\n</ul>`;
}

function renderImageCell(link, title) {
  if (!link || link.trim() === "") {
    // Text monogram placeholder when there is no image
    return `<div class="pub-image-cell"><div class="pub-placeholder" title="${escapeHtml(title)}">${escapeHtml(generateBriefText(title))}</div></div>`;
  }
  return `<div class="pub-image-cell"><img class="pub-image" src="${escapeHtml(link)}" alt="${escapeHtml(title)}" loading="lazy" /></div>`;
}

function generateBriefText(title) {
  if (!title) return "???";

  // Check for "xx: yyy" format
  const colonIndex = title.indexOf(":");
  if (colonIndex !== -1) {
    const beforeColon = title.substring(0, colonIndex).trim();
    const beforeColonWords = beforeColon.split(/\s+/).filter((word) => word.length > 0);

    // If the part before colon has less than 3 words
    if (beforeColonWords.length < 3) {
      const cleanBeforeColon = beforeColon.replace(/[^\w]/g, "");

      // If it's 3 alphabets or less, use it directly
      if (cleanBeforeColon.length <= 3) {
        return cleanBeforeColon.toUpperCase();
      }
      // For single words that might be camelCase, try to split them
      if (beforeColonWords.length === 1) {
        const camelCaseWords = splitCamelCase(beforeColonWords[0]);
        if (camelCaseWords.length >= 2) {
          return camelCaseWords
            .slice(0, 3)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        }
      }
      return generateBriefTextFromWords(beforeColonWords);
    }
  }

  // Default logic for other cases
  const commonWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "against",
  ];
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !commonWords.includes(word));

  return generateBriefTextFromWords(words, title);
}

function splitCamelCase(word) {
  // e.g. "AdaptiveFusion" -> ["Adaptive", "Fusion"]
  return word.replace(/([a-z])([A-Z])/g, "$1 $2").split(/\s+/);
}

function generateBriefTextFromWords(words, originalTitle = null) {
  // First letter of each significant word (up to 3)
  if (words.length >= 2) {
    return words
      .slice(0, 3)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  if (originalTitle) {
    const cleanTitle = originalTitle.replace(/[^\w]/g, "");
    if (cleanTitle.length >= 3) {
      return cleanTitle.substring(0, 3).toUpperCase();
    }
    return cleanTitle.charAt(0).toUpperCase() || "?";
  }
  if (words.length === 1) {
    const word = words[0];
    return word.length >= 3 ? word.substring(0, 3).toUpperCase() : word.toUpperCase();
  }
  return words.length > 0 ? words[0].charAt(0).toUpperCase() : "?";
}

function renderContentCell({ title, authors, conference, links, badges, comments }, config) {
  const parts = [
    `<p class="pub-title">${escapeHtml(title)}</p>`,
    renderAuthors(authors, config),
    renderVenue(conference, badges),
    renderLinks(links),
    renderAbstract(comments),
  ].filter(Boolean);
  return `<div class="pub-content-cell">${parts.join("\n")}</div>`;
}

function renderAuthors(authors, config) {
  if (!authors) return "";
  const names = authors.split(/[,;]/g).map((author) => {
    const name = author.trim();
    const isMe = name.toLowerCase() === config.highlightName.toLowerCase();
    const tag = isMe ? "b" : "span";
    return `<${tag} class="author-name">${escapeHtml(name)}</${tag}>`;
  });
  return `<p class="pub-authors">${names.join(", ")}</p>`;
}

function renderVenue(conference, badges) {
  if (!conference && (!badges || badges.length === 0)) return "";
  const conf = conference ? `<em class="conference-name">${escapeHtml(conference)}</em>` : "";
  const badgeHtml = (badges || [])
    .map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`)
    .join("");
  return `<p class="pub-venue">${conf}${badgeHtml}</p>`;
}

function renderLinks(links) {
  if (!links) return "";
  const parts = Object.entries(links)
    .filter(([, link]) => link)
    .map(
      ([name, link]) =>
        `<a class="resource-link" href="${escapeHtml(link)}">[${escapeHtml(name)}]</a>`,
    );
  return parts.length ? `<p class="pub-links">${parts.join(" ")}</p>` : "";
}

function renderAbstract(comments) {
  if (!comments || comments.trim() === "") return "";
  const body = marked.parse(comments, { breaks: true });
  return `<details class="pub-abstract"><summary>Abstract</summary><div class="pub-abstract-body">${body}</div></details>`;
}
