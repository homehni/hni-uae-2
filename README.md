# HomeHNI Homepage Prototype

A static homepage prototype for HomeHNI, a luxury real estate platform in the UAE.

## Overview

This repository contains:
- A standalone HTML/CSS homepage at `/public/index.html`
- Visual comparison tooling to compare with Bayut's homepage
- Vercel deployment configuration

## Quick Start

### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Installation

```bash
npm install
```

### Run Locally

Start the static file server:

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Homepage Comparison

In a separate terminal (while the server is running):

```bash
npm run compare
```

This will:
1. Capture a screenshot of https://www.bayut.ae/
2. Capture a screenshot of the local HomeHNI page
3. Generate a visual diff
4. Output results to `tools/output/`

**Note:** The Bayut screenshot may fail in CI environments due to network restrictions. Run locally for full comparison.

## Deployment

### Vercel

This project is configured for Vercel deployment. The `vercel.json` file routes all requests to `public/index.html`.

To deploy:
1. Connect the repository to Vercel
2. Vercel will automatically detect the configuration
3. Deploy via the Vercel dashboard

### Manual Static Hosting

Simply serve the `/public` directory with any static file server.

## Project Structure

```
├── public/
│   ├── index.html      # Main homepage
│   ├── styles.css      # Stylesheet
│   └── assets/         # Images and logo
│       └── README.txt  # Placeholder instructions
├── tools/
│   ├── compare-homepages.js  # Screenshot comparison script
│   └── output/               # Generated screenshots (gitignored)
├── package.json
├── vercel.json
├── README.md
└── PR_DESCRIPTION.md
```

## Color Palette

CSS variables defined in `styles.css`:

| Variable | Color | Usage |
|----------|-------|-------|
| `--color-primary` | `#1E90FF` | Logo, links, prices |
| `--color-accent` | `#FF7A59` | Buttons, CTAs |
| `--color-bg` | `#FFFFFF` | Background |
| `--color-text` | `#222222` | Body text |
| `--muted` | `#6b6b6b` | Secondary text |

## TODO

- [ ] Replace placeholder images with actual property photos
- [ ] Add HomeHNI logo (logo.png or logo.svg)
- [ ] Update navigation links to actual routes
- [ ] Confirm final brand colors with design team
- [ ] Add responsive testing for mobile breakpoints
- [ ] Integrate with main application routing

## License

MIT
