// Modify the `PUBLICATIONS` object

const PUBLICATIONS = [
  {
    title:
      "Seal-3D: Interactive Pixel-Level Editing for Neural Radiance Fields",
    authors:
      "Xiangyu Wang, Jingsen Zhu, Qi Ye, Yuchi Huo, Yunlong Ran, Zhihua Zhong, Jiming Chen",
    image: "https://github.com/windingwind/windingwind.github.io/assets/33902321/084befa0-93f0-47a4-a0da-e310f035119a",
    conference: "ICCV 2023",
    links: {
      "project page": "https://windingwind.github.io/seal-3d/",
      arxiv: "https://arxiv.org/abs/2307.15131",
      pdf: "https://arxiv.org/pdf/2307.15131",
      supp: "",
      video: "https://windingwind.github.io/seal-3d/static/videos/supp.mp4",
      code: "https://github.com/windingwind/seal-3d/",
    },
    badges: [],
  },
  {
    title:
      "ImmFusion: Robust mmWave-RGB Fusion for 3D Human Body Reconstruction in All Weather Conditions",
    authors:
      "Anjun Chen, Xiangyu Wang, Kun Shi, Shaohao Zhu, Bin Fang, Yingfeng Chen, Jiming Chen, Yuchi Huo, Qi Ye",
    image: "https://chen3110.github.io/ImmFusion/resources/framework.png",
    conference: "ICRA 2023",
    links: {
      "project page": "https://chen3110.github.io/ImmFusion/index.html",
      paper: "",
      arxiv: "https://arxiv.org/abs/2210.01346",
      pdf: "https://arxiv.org/pdf/2210.01346",
      supp: "",
      video: "",
      code: "https://github.com/Chen3110/ImmFusion",
    },
    badges: [],
  },
  {
    title:
      "mmBody Benchmark: 3D Body Reconstruction Dataset and Analysis for Millimeter Wave Radar",
    authors:
      "Anjun Chen, Xiangyu Wang, Shaohao Zhu, Yanxu Li, Jiming Chen, Qi Ye",
    image: "https://chen3110.github.io/mmbody/resources/good_case.png",
    conference: "ACM MM 2022",
    links: {
      "project page": "https://chen3110.github.io/mmbody/",
      paper: "https://dl.acm.org/doi/10.1145/3503161.3548262",
      arxiv: "https://arxiv.org/abs/2209.05070",
      pdf: "https://arxiv.org/pdf/2209.05070",
      supp: "",
      video: "",
      code: "",
      data: "https://github.com/Chen3110/mmBody",
    },
    badges: [],
  },
];

const HIGHLIGHT_NAME = "xiangyu wang";

// Do not touch the code below

// Convert PUBLICATIONS to HTML table
document.addEventListener("DOMContentLoaded", (ev) => {
  const tbody = document.createElement("tbody");
  const rows = PUBLICATIONS.map((data) => {
    const row = document.createElement("tr");
    row.append(createImageCell(data.image), createContentCell(data));
    return row;
  });
  tbody.append(...rows);
  document.querySelector("#pub-list").append(tbody);
});

// Functions to create HTML elements
function createImageCell(link) {
  const cell = document.createElement("td");
  cell.style.padding = "10px";
  cell.style.width = "30%";
  cell.style.verticalAlign = "middle";
  const img = document.createElement("img");
  img.src = link;
  img.style.width = "100%";
  cell.append(img);
  return cell;
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
