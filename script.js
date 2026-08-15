const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const nav = document.getElementById("site-nav");
const year = document.getElementById("year");
const virusTrack = document.querySelector(".virus-track");
const shelfPrev = document.querySelector(".shelf-nav--prev");
const shelfNext = document.querySelector(".shelf-nav--next");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function setNavOpen(open) {
  header?.classList.toggle("is-nav-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("nav-open", open);
}

toggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
});

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  setNavOpen(open);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavOpen(false);
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 820px)").matches) {
    setNavOpen(false);
  }
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
      setTheme(event.matches ? "dark" : "light");
    }
  });

function scrollVirusShelf(direction) {
  if (!virusTrack) return;
  const amount = Math.min(virusTrack.clientWidth * 0.85, 360);
  virusTrack.scrollBy({ left: direction * amount, behavior: "smooth" });
}

shelfPrev?.addEventListener("click", () => scrollVirusShelf(-1));
shelfNext?.addEventListener("click", () => scrollVirusShelf(1));
