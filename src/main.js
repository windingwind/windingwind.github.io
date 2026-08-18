import "./styles/main.css";
import aboutHtml from "../content/about.md";
import pubConfig from "../pubs.config.js";
import { renderPublications } from "@windingwind/pubs-renderer";

document.getElementById("about-content").innerHTML = aboutHtml;
renderPublications(pubConfig, document.getElementById("pub-list"));

// Theme switching itself is pure CSS (see main.css); this only persists the
// switch position ("flipped away from the system scheme") across visits.
const themeSwitch = document.getElementById("theme-switch");
themeSwitch.checked = localStorage.getItem("theme-flipped") === "1";
themeSwitch.addEventListener("change", () => {
  localStorage.setItem("theme-flipped", themeSwitch.checked ? "1" : "0");
});
