# Market Horizons

Public-facing TypeScript prototype for Market Horizons: four quantitative market observations for each of the short, mid and long horizons.

Published with GitHub Pages at <https://langzonedev.github.io/TraderMate-Web/>.

## Prototype boundary

- Contains no fictional companies, prices, outcomes or performance history. Empty states remain visible until the approved private live-data workflow is activated.
- Contains no live market data, trading capability, proprietary algorithm, credentials, personal data, or financial advice.
- Demonstrates the intended information hierarchy, responsive behaviour, accessibility, and public/private contract boundary.
- The private research, scoring, evaluation, multi-source aggregation, source configuration, and publication controls belong in the private `TraderMate` repository.

## Run locally

Install dependencies with `npm install`, then run `npm run dev`. No environment variables are required for the public shell.

## Current product surface

- Short, mid and long segmented views with four compact observation cards in each view.
- Reference price, observation window, signal strength and review date.
- Historical outcome rate calculated only from completed live observations.
- Responsive one-, two- and four-column layouts.
- Light and dark themes selected exclusively through the browser or operating-system preference.
- React and TypeScript source built with Vite.

## Deployment

Changes merged to `main` deploy through `.github/workflows/pages.yml`. The workflow publishes this repository as a static GitHub Pages site and requires no runtime, database, API key, or paid hosting service.

## Before connecting live data

The private Market Horizons workflow can replace `public/api/recommendations.json` with a sanitised live projection. EODHD is only the first adapter; the private architecture is designed to combine licensed price feeds with official Australian entity and macro data while retaining source provenance and deduplicating shared upstream feeds. Activation requires provider tokens, a narrowly scoped publication token, provider redistribution rights, and legal/licensing approval for named model observations. The browser never receives credentials, raw licensed data or private scoring state.
