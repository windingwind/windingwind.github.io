import { marked } from "marked";

/** Renders the publication list from pubs.config.js into `container`. */
export function renderPublications(config, container) {
  const list = document.createElement("ul");
  list.classList.add("pub-items");
  list.append(...config.publications.map((pub) => createPubItem(pub, config)));
  container.append(list);
}

function createPubItem(pub, config) {
  const item = document.createElement("li");
  item.classList.add("pub-item");
  item.append(createImageCell(pub.image, pub.title), createContentCell(pub, config));
  return item;
}

function createImageCell(link, title) {
  const cell = document.createElement("div");
  cell.classList.add("pub-image-cell");

  if (!link || link.trim() === "") {
    // Text monogram placeholder when there is no image
    const placeholder = document.createElement("div");
    placeholder.classList.add("pub-placeholder");
    placeholder.textContent = generateBriefText(title);
    placeholder.title = title;
    cell.append(placeholder);
  } else {
    const img = document.createElement("img");
    img.src = link;
    img.alt = title;
    img.loading = "lazy";
    img.classList.add("pub-image");
    cell.append(img);
  }

  return cell;
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
  const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "through", "during", "before", "after", "above", "below", "between", "among", "against"];
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

function createContentCell({ title, authors, conference, links, badges, comments }, config) {
  const cell = document.createElement("div");
  cell.classList.add("pub-content-cell");

  const titleElem = document.createElement("p");
  titleElem.classList.add("pub-title");
  titleElem.textContent = title;

  const metaElems = [
    titleElem,
    createAuthorElement(authors, config),
    createConferenceElement(conference, badges),
    createLinksElement(links),
    createAbstractElement(comments),
  ].filter(Boolean);
  cell.append(...metaElems);
  return cell;
}

function createAuthorElement(authors, config) {
  if (!authors) return null;
  const container = document.createElement("p");
  container.classList.add("pub-authors");
  const names = authors.split(/[,;]/g).map((author) => {
    const authorText = author.trim();
    const isMe = authorText.toLowerCase() === config.highlightName.toLowerCase();
    const authorElem = document.createElement(isMe ? "b" : "span");
    authorElem.classList.add("author-name");
    authorElem.textContent = authorText;
    return authorElem;
  });
  names.forEach((elem, i) => {
    container.append(elem);
    if (i !== names.length - 1) container.append(", ");
  });
  return container;
}

function createConferenceElement(conference, badges) {
  if (!conference && (!badges || badges.length === 0)) return null;
  const container = document.createElement("p");
  container.classList.add("pub-venue");
  if (conference) {
    const conferenceElem = document.createElement("em");
    conferenceElem.classList.add("conference-name");
    conferenceElem.textContent = conference;
    container.append(conferenceElem);
  }
  for (const badge of badges || []) {
    const badgeElem = document.createElement("span");
    badgeElem.classList.add("badge");
    badgeElem.textContent = badge;
    container.append(badgeElem);
  }
  return container;
}

function createLinksElement(links) {
  if (!links) return null;
  const container = document.createElement("p");
  container.classList.add("pub-links");
  for (const [name, link] of Object.entries(links)) {
    if (!link) continue;
    const elem = document.createElement("a");
    elem.href = link;
    elem.classList.add("resource-link");
    elem.textContent = `[${name}]`;
    container.append(elem, " ");
  }
  return container.childElementCount > 0 ? container : null;
}

function createAbstractElement(comments) {
  if (!comments || comments.trim() === "") return null;
  const details = document.createElement("details");
  details.classList.add("pub-abstract");
  const summary = document.createElement("summary");
  summary.textContent = "Abstract";
  const body = document.createElement("div");
  body.classList.add("pub-abstract-body");
  body.innerHTML = marked.parse(comments, { breaks: true });
  details.append(summary, body);
  return details;
}
