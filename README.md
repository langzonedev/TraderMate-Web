# TraderMate-Web

Public-facing prototype for TraderMate: a calm, plain-language dashboard concept for reviewing Australian-equity research ideas.

Published with GitHub Pages at <https://langzonedev.github.io/TraderMate-Web/>.

## Prototype boundary

- Uses fictional companies, symbols, prices, and signals.
- Contains no live market data, trading capability, proprietary algorithm, credentials, personal data, or financial advice.
- Demonstrates the intended information hierarchy, responsive behaviour, accessibility, and public/private contract boundary.
- The private research, scoring, evaluation, source configuration, and publication controls belong in the private `TraderMate` repository.

## Run locally

Open `index.html` in a modern browser. No installation, build step, or environment variables are required.

## Included interactions

- Filter idea cards by investment horizon.
- Expand “Why this idea?” evidence and risk summaries.
- Keyboard-accessible controls and visible focus states.
- Responsive card layout and an explicit illustrative-data notice.
- Offline app-shell caching after the first successful visit.
- A public explanation of the four research lenses without exposing private scoring weights.

## Deployment

Changes merged to `main` deploy through `.github/workflows/pages.yml`. The workflow publishes this repository as a static GitHub Pages site and requires no runtime, database, API key, or paid hosting service.

## Before connecting live data

Approve the legal/advice position, data licences, performance metric, public API contract, authentication scope, retention, deployment, and security review. Connect only to a sanitised public projection API—never directly to private scoring services.
