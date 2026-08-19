const filterButtons = document.querySelectorAll("[data-filter]");
const ideaCards = document.querySelectorAll("[data-horizon]");
const themeToggle = document.querySelector("#theme-toggle");

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
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
});
