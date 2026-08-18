import "./styles/main.css";

// Theme switching itself is pure CSS (see main.css). This syncs the switch
// with the pre-paint [data-theme-flipped] attribute (set in index.html from
// localStorage) and persists changes.
const themeSwitch = document.getElementById("theme-switch");
themeSwitch.checked = document.documentElement.hasAttribute("data-theme-flipped");
themeSwitch.addEventListener("change", () => {
  localStorage.setItem("theme-flipped", themeSwitch.checked ? "1" : "0");
  document.documentElement.toggleAttribute("data-theme-flipped", themeSwitch.checked);
});

// Scrollspy: move the nav caret to the section currently in view.
const spyLinks = [...document.querySelectorAll(".blog-nav-item[data-section]")];
const spySections = spyLinks
  .map((link) => [link.dataset.section, document.getElementById(link.dataset.section)])
  .filter(([, el]) => el);

function updateScrollSpy() {
  let current = "home";
  for (const [name, el] of spySections) {
    if (el.getBoundingClientRect().top <= 80) current = name;
  }
  // At the very bottom, the last section counts even if it is too short
  // to ever reach the top of the viewport.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom && spySections.length) current = spySections[spySections.length - 1][0];
  for (const link of spyLinks) {
    link.classList.toggle("active", link.dataset.section === current);
  }
}

document.addEventListener("scroll", updateScrollSpy, { passive: true });
updateScrollSpy();
