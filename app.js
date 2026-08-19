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

const savedTheme = localStorage.getItem("market-horizons-theme") || localStorage.getItem("tradermate-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(savedTheme || preferredTheme);

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  localStorage.setItem("market-horizons-theme", theme);
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

const progressPercent = (observation, asOf) => {
  const opened = new Date(observation.observedAt).getTime();
  const closes = new Date(observation.reviewAt).getTime();
  const current = new Date(asOf).getTime();
  if (!Number.isFinite(opened + closes + current) || closes <= opened) return 0;
  return Math.max(0, Math.min(100, ((current - opened) / (closes - opened)) * 100));
};

const renderObservation = (observation, asOf) => {
  const card = cards.get(observation.horizon);
  if (!card) return;

  field(card, "duration").textContent = observation.durationLabel;
  field(card, "status").textContent = observation.status === "active" ? "Observation active" : "Observation complete";
  field(card, "symbol").textContent = `${observation.exchange}: ${observation.symbol}`;
  field(card, "company").textContent = observation.companyName;
  field(card, "sector").textContent = observation.sector;
  field(card, "price").textContent = money(observation.referencePrice, observation.currency);
  field(card, "picked-date").textContent = dateFormatter.format(new Date(observation.observedAt));
  field(card, "confidence").textContent = `${Math.round(observation.signalStrength)}%`;
  field(card, "progress").style.width = `${progressPercent(observation, asOf)}%`;
  field(card, "closes").textContent = `Review ${dateFormatter.format(new Date(observation.reviewAt))}`;
};

const renderModel = (data) => {
  const dataState = document.querySelector("#data-state");
  const live = data.mode === "live" && data.observations?.length === 3 && data.asOf;
  dataState.classList.toggle("is-live", Boolean(live));

  if (!live) {
    document.querySelector("#model-accuracy").textContent = "—";
    document.querySelector("#model-record-detail").textContent = "No completed live observations";
    dataState.lastChild.textContent = " Live feed pending";
    document.querySelector("#last-updated").textContent = "Live market feed pending";
    return;
  }

  const completed = data.outcomes.filter((outcome) => outcome.status === "complete");
  const positive = completed.filter((outcome) => outcome.positive === true).length;
  const outcomeRate = completed.length ? (positive / completed.length) * 100 : null;

  document.querySelector("#model-accuracy").textContent = outcomeRate === null ? "—" : `${outcomeRate.toFixed(1)}%`;
  document.querySelector("#model-record-detail").textContent = completed.length
    ? `${positive} of ${completed.length} completed observations positive`
    : "No completed live observations";

  dataState.lastChild.textContent = " Live ASX feed";
  document.querySelector("#last-updated").textContent = `Updated ${dateTimeFormatter.format(new Date(data.asOf))}`;
  data.observations.forEach((observation) => renderObservation(observation, data.asOf));
};

fetch("./api/recommendations.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error(`Data request failed: ${response.status}`);
    return response.json();
  })
  .then(renderModel)
  .catch(() => {
    document.querySelector("#data-state").lastChild.textContent = " Live feed unavailable";
  });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
