const themeToggle = document.querySelector("#theme-toggle");
const cards = new Map(
  [...document.querySelectorAll("[data-horizon]")].map((card) => [card.dataset.horizon, card]),
);

const setTheme = (theme) => {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
};

const savedTheme = localStorage.getItem("tradermate-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(savedTheme || preferredTheme);

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  localStorage.setItem("tradermate-theme", theme);
});

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Australia/Adelaide",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Australia/Adelaide",
  timeZoneName: "short",
});

const money = (value, currency = "AUD") => new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency,
  minimumFractionDigits: 2,
}).format(value);

const field = (card, name) => card.querySelector(`[data-field="${name}"]`);

const progressPercent = (pick, asOf) => {
  const opened = new Date(pick.openedAt).getTime();
  const closes = new Date(pick.closesAt).getTime();
  const current = new Date(asOf).getTime();
  if (!Number.isFinite(opened + closes + current) || closes <= opened) return 0;
  return Math.max(0, Math.min(100, ((current - opened) / (closes - opened)) * 100));
};

const renderPick = (pick, asOf) => {
  const card = cards.get(pick.horizon);
  if (!card) return;

  field(card, "duration").textContent = pick.durationLabel;
  field(card, "status").textContent = pick.status === "open" ? "Paper trade open" : "Paper trade closed";
  field(card, "symbol").textContent = `${pick.exchange}: ${pick.symbol}`;
  field(card, "company").textContent = pick.companyName;
  field(card, "sector").textContent = pick.sector;
  field(card, "price").textContent = money(pick.entryPrice, pick.currency);
  field(card, "picked-date").textContent = dateFormatter.format(new Date(pick.openedAt));
  field(card, "confidence").textContent = `${Math.round(pick.confidence)}%`;
  field(card, "progress").style.width = `${progressPercent(pick, asOf)}%`;
  field(card, "closes").textContent = `Closes ${dateFormatter.format(new Date(pick.closesAt))}`;
};

const renderModel = (data) => {
  const closed = data.paperTrades.filter((trade) => trade.status === "closed");
  const wins = closed.filter((trade) => trade.success === true).length;
  const accuracy = closed.length ? (wins / closed.length) * 100 : null;

  document.querySelector("#model-accuracy").textContent = accuracy === null ? "—" : `${accuracy.toFixed(1)}%`;
  const demoLabel = data.mode === "live" ? "" : " demo";
  document.querySelector("#model-record-detail").textContent = closed.length
    ? `${wins} of ${closed.length} closed${demoLabel} paper trades`
    : "Building a verified paper-trade record";

  const dataState = document.querySelector("#data-state");
  const live = data.mode === "live";
  dataState.classList.toggle("is-live", live);
  dataState.lastChild.textContent = live ? " Live ASX data" : " Demo data";
  document.querySelector("#last-updated").textContent = `Updated ${dateTimeFormatter.format(new Date(data.asOf))}`;
  data.picks.forEach((pick) => renderPick(pick, data.asOf));
};

fetch("./api/recommendations.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error(`Data request failed: ${response.status}`);
    return response.json();
  })
  .then(renderModel)
  .catch(() => {
    document.querySelector("#data-state").lastChild.textContent = " Demo data";
  });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
