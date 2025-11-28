# HomeHNI Homepage Prototype

A static homepage prototype for HomeHNI, designed to replicate Bayut's layout and structure with HomeHNI branding and placeholder content.

## Color Palette

- **Primary**: `#1E90FF` (Dodger Blue)
- **Accent**: `#FF7A59` (Coral)
- **Background**: `#FFFFFF` (White)
- **Text**: `#222222` (Dark Gray)

## Project Structure

```
├── public/
│   └── homehni/
│       ├── index.html      # Homepage HTML
│       ├── styles.css      # Styles with CSS variables
│       └── assets/
│           └── README.txt  # Asset placeholder instructions
├── tools/
│   ├── compare-homepages.js  # Visual comparison script
│   ├── package.json          # Dependencies for tools
│   ├── vercel.json           # Vercel configuration
│   └── output/               # Screenshot output directory
├── README.md                 # This file
├── PR_DESCRIPTION.md         # Pull request description
└── .gitignore
```

## Running Locally

### Option 1: Using the tools directory

```bash
# Navigate to tools directory
cd tools

# Install dependencies
npm install

# Start local server (serves public/ on port 3000)
npm start

# Open in browser
open http://localhost:3000/homehni/
```

### Option 2: Using any static file server

```bash
# Using Python
python -m http.server 3000 --directory public

# Using npx serve directly
npx serve public -p 3000

# Open in browser
open http://localhost:3000/homehni/
```

## Visual Comparison Tool

Compare the HomeHNI prototype against Bayut.ae using Puppeteer and pixelmatch:

```bash
cd tools

# Install dependencies (if not already done)
npm install

# Start the local server in one terminal
npm start

# In another terminal, run the comparison
npm run compare
```

### Output

The comparison script generates:
- `tools/output/bayut.png` - Screenshot of bayut.ae
- `tools/output/homehni.png` - Screenshot of local HomeHNI
- `tools/output/diff.png` - Visual diff highlighting differences

### CI/CD Notes

The Bayut.ae screenshot may fail in CI environments due to network restrictions. In such cases:

1. Run the comparison script locally for manual review
2. Only the HomeHNI screenshot will be captured in CI
3. The script will not fail if only the external site is unreachable

## Deploying to Vercel

### Quick Deploy

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the tools directory: `cd tools`
3. Deploy: `vercel`

### Manual Configuration

The `tools/vercel.json` is configured to:
- Serve static files from the `public/` directory
- Route `/homehni` and `/homehni/*` to the prototype

### Vercel Dashboard

1. Import the repository on [vercel.com](https://vercel.com)
2. Set the root directory to `tools/`
3. Deploy

## TODOs

- [ ] Replace placeholder images with actual property photos
- [ ] Confirm brand colors with design team
- [ ] Add actual HomeHNI logo
- [ ] Implement responsive testing
- [ ] Add accessibility improvements
- [ ] Connect search functionality to backend
- [ ] Add property listing pages

## Development Notes

### CSS Variables

Colors are defined using CSS custom properties for easy theming:

```css
:root {
  --color-primary: #1E90FF;
  --color-accent: #FF7A59;
  --color-background: #FFFFFF;
  --color-text: #222222;
}
```

### Structure

The homepage follows Bayut's general layout pattern:
- **Header**: Logo, navigation, action buttons
- **Hero**: Search box with tabs and filters
- **Featured Listings**: Grid of property cards
- **Popular Locations**: Location cards with images
- **Footer**: Links and contact information

### Responsiveness

The layout is responsive with breakpoints at:
- `992px` - Tablet landscape
- `768px` - Mobile/tablet portrait
