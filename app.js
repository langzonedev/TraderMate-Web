const filterButtons = document.querySelectorAll("[data-filter]");
const ideaCards = document.querySelectorAll("[data-horizon]");
const themeToggle = document.querySelector("#theme-toggle");

const setTheme = (theme) => {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
};

const savedTheme = localStorage.getItem("tradermate-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(savedTheme || preferredTheme);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });

    ideaCards.forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.horizon !== selected;
    });
  });
});

themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  const theme = dark ? "dark" : "light";
  setTheme(theme);
  localStorage.setItem("tradermate-theme", theme);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Offline support is an enhancement; the prototype remains fully usable online.
    });
  });
}
