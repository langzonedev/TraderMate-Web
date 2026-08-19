# TraderMate-Web

Public-facing prototype for TraderMate: one model pick for each of the short, mid and long market horizons.

Published with GitHub Pages at <https://langzonedev.github.io/TraderMate-Web/>.

## Prototype boundary

- Uses fictional companies, symbols, prices, and paper trades until the private live-data workflow is activated.
- Contains no live market data, trading capability, proprietary algorithm, credentials, personal data, or financial advice.
- Demonstrates the intended information hierarchy, responsive behaviour, accessibility, and public/private contract boundary.
- The private research, scoring, evaluation, source configuration, and publication controls belong in the private `TraderMate` repository.

## Run locally

Open `index.html` in a modern browser. No installation, build step, or environment variables are required.

## Current product surface

- Exactly three current cards: short, mid and long.
- Recommended entry price, intended duration, model confidence and paper-trade close date.
- Model accuracy calculated only from closed paper trades.
- Responsive layout with light and dark themes.
- Offline app-shell caching after the first successful visit.

## Deployment

Changes merged to `main` deploy through `.github/workflows/pages.yml`. The workflow publishes this repository as a static GitHub Pages site and requires no runtime, database, API key, or paid hosting service.

## Before connecting live data

The private `TraderMate` workflow can replace `api/recommendations.json` with a sanitised live projection. Activation requires the market-data token, a narrowly scoped publication token, provider redistribution rights, and legal/licensing approval for named model picks. The browser never receives either credential or private scoring state.
