const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const year = document.getElementById("year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

toggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
      setTheme(event.matches ? "dark" : "light");
    }
  });
