const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const nav = document.getElementById("site-nav");
const year = document.getElementById("year");
const virusTrack = document.querySelector(".virus-track");
const shelfPrev = document.querySelector(".shelf-nav--prev");
const shelfNext = document.querySelector(".shelf-nav--next");
const heroStory = document.querySelector(".hero-story");
const heroFrames = [...document.querySelectorAll(".hero-story__frame")];
const heroTabs = [...document.querySelectorAll(".hero-story__controls [data-step]")];
const heroCaption = document.querySelector(".hero-story__caption");

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

let heroIndex = 0;
let heroTimer = null;
const heroReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeroStep(index) {
  if (!heroStory || !heroFrames.length) return;
  heroIndex = ((index % heroFrames.length) + heroFrames.length) % heroFrames.length;
  heroStory.dataset.step = String(heroIndex);

  heroFrames.forEach((frame, i) => {
    frame.classList.toggle("is-active", i === heroIndex);
  });

  heroTabs.forEach((tab) => {
    const active = Number(tab.dataset.step) === heroIndex;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  const activeFrame = heroFrames[heroIndex];
  if (heroCaption && activeFrame) {
    heroCaption.textContent = activeFrame.dataset.caption || "";
  }

  // restart progress bar animation
  heroStory.classList.remove("is-paused");
  heroStory.style.setProperty("--hero-tick", String(Date.now()));
}

function startHeroLoop() {
  stopHeroLoop();
  if (heroReduceMotion || heroFrames.length < 2) return;
  heroTimer = window.setInterval(() => {
    setHeroStep(heroIndex + 1);
  }, 5500);
}

function stopHeroLoop() {
  if (heroTimer) {
    window.clearInterval(heroTimer);
    heroTimer = null;
  }
}

heroTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setHeroStep(Number(tab.dataset.step));
    startHeroLoop();
  });
});

heroStory?.addEventListener("mouseenter", () => {
  heroStory.classList.add("is-paused");
  stopHeroLoop();
});

heroStory?.addEventListener("mouseleave", () => {
  heroStory.classList.remove("is-paused");
  startHeroLoop();
});

heroStory?.addEventListener("focusin", () => {
  heroStory.classList.add("is-paused");
  stopHeroLoop();
});

heroStory?.addEventListener("focusout", (event) => {
  if (!heroStory.contains(event.relatedTarget)) {
    heroStory.classList.remove("is-paused");
    startHeroLoop();
  }
});

setHeroStep(0);
startHeroLoop();
