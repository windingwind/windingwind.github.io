// Convert PUBLICATIONS to HTML table
document.addEventListener("DOMContentLoaded", (ev) => {
  const tbody = document.createElement("tbody");
  const rows = PUBLICATIONS.map((data) => {
    const row = document.createElement("tr");
    row.append(createImageCell(data.image, data.title), createContentCell(data));
    return row;
  });
  tbody.append(...rows);
  document.querySelector("#pub-list").append(tbody);
});

// Functions to create HTML elements
function createImageCell(link, title) {
  const cell = document.createElement("td");
  cell.style.padding = "10px";
  cell.style.width = "30%";
  cell.style.verticalAlign = "middle";

  if (!link || link.trim() === "") {
    // Create text placeholder when image link is empty
    const placeholder = document.createElement("div");
    placeholder.style.width = "100%";
    placeholder.style.aspectRatio = "1";
    placeholder.style.backgroundColor = "#f0f0f0";
    placeholder.style.border = "2px solid #ddd";
    placeholder.style.borderRadius = "8px";
    placeholder.style.display = "flex";
    placeholder.style.alignItems = "center";
    placeholder.style.justifyContent = "center";
    placeholder.style.fontSize = "24px";
    placeholder.style.fontWeight = "bold";
    placeholder.style.color = "#666";
    placeholder.style.textAlign = "center";

    // Generate brief text from title
    const briefText = generateBriefText(title);
    placeholder.textContent = briefText;
    placeholder.title = title; // Add full title as tooltip

    cell.append(placeholder);
  } else {
    const img = document.createElement("img");
    img.src = link;
    img.alt = title;
    img.style.width = "100%";
    cell.append(img);
  }

  return cell;
}

function generateBriefText(title) {
  if (!title) return "???";

  // Check for "xx: yyy" format
  const colonIndex = title.indexOf(':');
  if (colonIndex !== -1) {
    const beforeColon = title.substring(0, colonIndex).trim();
    const beforeColonWords = beforeColon.split(/\s+/).filter(word => word.length > 0);

    // If the part before colon has less than 3 words
    if (beforeColonWords.length < 3) {
      // Remove non-alphabetic characters from beforeColon
      const cleanBeforeColon = beforeColon.replace(/[^\w]/g, '');

      // If it's 3 alphabets or less, use it directly
      if (cleanBeforeColon.length <= 3) {
        return cleanBeforeColon.toUpperCase();
      } else {
        // For single words that might be camelCase, try to split them
        if (beforeColonWords.length === 1) {
          const camelCaseWords = splitCamelCase(beforeColonWords[0]);
          if (camelCaseWords.length >= 2) {
            return camelCaseWords.slice(0, 3).map(word => word.charAt(0).toUpperCase()).join('');
          }
        }
        // Apply the logic only to the part before colon
        return generateBriefTextFromWords(beforeColonWords);
      }
    }
  }

  // Default logic for other cases
  const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "through", "during", "before", "after", "above", "below", "between", "among", "against"];
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => word.length > 0 && !commonWords.includes(word));

  return generateBriefTextFromWords(words, title);
}

function splitCamelCase(word) {
  // Split camelCase words (e.g., "AdaptiveFusion" -> ["Adaptive", "Fusion"])
  return word.replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+/);
}

function generateBriefTextFromWords(words, originalTitle = null) {
  // Try to get first alphabet of each significant word (up to 3)
  if (words.length >= 2) {
    return words.slice(0, 3).map(word => word.charAt(0).toUpperCase()).join('');
  }

  // If only one significant word or few words, get first 3 letters
  if (originalTitle) {
    const cleanTitle = originalTitle.replace(/[^\w]/g, '');
    if (cleanTitle.length >= 3) {
      return cleanTitle.substring(0, 3).toUpperCase();
    }
    // Fallback to first letter or question marks
    return cleanTitle.charAt(0).toUpperCase() || "?";
  } else {
    // When working with just words array
    if (words.length === 1) {
      const word = words[0];
      return word.length >= 3 ? word.substring(0, 3).toUpperCase() : word.toUpperCase();
    }
    return words.length > 0 ? words[0].charAt(0).toUpperCase() : "?";
  }
}

function createContentCell({ title, authors, conference, links, badges }) {
  const cell = document.createElement("td");
  cell.style.padding = "20px";
  cell.style.width = "70%";
  cell.style.verticalAlign = "middle";
  const titleElem = document.createElement("span");
  titleElem.textContent = title;
  const authorsElem = createAuthorElement(authors);
  const conferenceElem = document.createElement("em");
  conferenceElem.textContent = conference;
  conferenceElem.classList.add("conference-name");
  const badgesElem = createBadgesElement(badges);
  const linksElem = createLinksElement(links);
  const elements = [
    titleElem,
    document.createElement("br"),
    authorsElem,
    document.createElement("br"),
    conferenceElem,
    badgesElem,
    document.createElement("br"),
    linksElem,
  ].filter((elem) => elem);
  cell.append(...elements);
  return cell;
}

function createAuthorElement(authors) {
  if (!authors) {
    return null;
  }
  const frag = document.createDocumentFragment();
  const elements = authors.split(/[,;]/g).map((author) => {
    const authorText = author.trim();
    if (authorText.toLowerCase() === HIGHLIGHT_NAME) {
      const authorElem = document.createElement("b");
      authorElem.classList.add("author-name");
      authorElem.textContent = authorText;
      return authorElem;
    } else {
      const authorElem = document.createElement("span");
      authorElem.classList.add("author-name");
      authorElem.textContent = authorText;
      return authorElem;
    }
  });
  for (let i = 0; i < elements.length; i++) {
    frag.append(elements[i]);
    if (i !== elements.length - 1) {
      frag.append(", ");
    }
  }
  return frag;
}

function createBadgesElement(badges) {
  if (!badges) {
    return null;
  }
  const frag = document.createDocumentFragment();
  const textElem = document.createElement("span");
  textElem.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
  frag.append(textElem);
  frag.append(
    ...badges.map((badge) => {
      const badgeElem = document.createElement("span");
      badgeElem.classList.add("badge");
      badgeElem.textContent = badge;
      return badgeElem;
    })
  );
  return frag;
}

function createLinksElement(links) {
  if (!links) {
    return null;
  }
  const frag = document.createDocumentFragment();
  for (const [name, link] of Object.entries(links)) {
    if (!link) {
      continue;
    }
    const elem = document.createElement("a");
    elem.href = link;
    elem.classList.add("resource-link");
    elem.textContent = "[" + name + "]";
    const textElem = document.createElement("span");
    textElem.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
    frag.append(elem, textElem);
  }
  return frag;
}
