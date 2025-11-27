# HomeHNI - UAE Real Estate Platform

A modern real estate platform for finding properties in the UAE.

## Project Structure

```
├── client/                 # React frontend application
├── server/                 # Express backend API
├── public/
│   └── homehni/           # Static HomeHNI homepage
│       ├── index.html     # Homepage HTML
│       ├── styles.css     # Stylesheet with CSS variables
│       └── assets/        # Images and assets
├── tools/
│   ├── compare-homepages.js  # Visual comparison script
│   └── output/            # Comparison output files
├── assets/
│   └── bayut-homepage.png # Reference screenshot
└── vercel.json            # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- Chrome/Chromium (for comparison script)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The main app will be available at http://localhost:5000/  
The HomeHNI static page will be available at http://localhost:5000/homehni/

### Building for Production

```bash
npm run build
```

This will:
1. Build the React app to `dist/public/`
2. Copy the HomeHNI static page to `dist/public/homehni/`

## Deploying to Vercel

### Quick Deploy

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Manual Setup

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. The build command is `npm run build`
4. The output directory is `dist/public`

### Environment Variables

No environment variables are required for the static HomeHNI page.

For the full React app, set up any required database and API keys in Vercel's project settings.

## Homepage Comparison Tool

The comparison tool uses Puppeteer and pixelmatch to compare the Bayut homepage layout with the HomeHNI implementation.

### Running the Comparison

```bash
npm run compare
```

Or with custom options:

```bash
node tools/compare-homepages.js --homehni-url http://localhost:5000/homehni/ --threshold 0.15
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--bayut-url <url>` | URL of Bayut homepage | https://www.bayut.ae/ |
| `--homehni-url <url>` | URL of HomeHNI homepage | http://localhost:3000/homehni/ |
| `--threshold <number>` | Pixel difference threshold (0-1) | 0.1 |
| `--skip-bayut` | Skip Bayut screenshot (use existing) | false |
| `--help` | Show help | - |

### Output

The comparison generates these files in `tools/output/`:

- `bayut-screenshot.png` - Screenshot of Bayut homepage
- `homehni-screenshot.png` - Screenshot of HomeHNI homepage
- `diff.png` - Visual diff highlighting differences
- `comparison-report.json` - JSON report with metrics

### Exit Codes

- `0` - Success: pixel difference is below threshold
- `1` - Failure: pixel difference exceeds threshold or error

## Customizing the HomeHNI Homepage

### Color Palette

The color palette is defined using CSS variables in `public/homehni/styles.css`. To customize:

1. Open `public/homehni/styles.css`
2. Find the `:root` block at the top
3. Modify the color variables:

```css
:root {
    /* Primary Colors */
    --color-primary: #1E90FF;        /* Main brand color */
    --color-primary-dark: #1a7ce6;   /* Hover states */
    
    /* Accent Colors */
    --color-accent: #FF7A59;         /* Call-to-action */
    
    /* Background Colors */
    --color-background: #FFFFFF;     /* Main background */
    
    /* Text Colors */
    --color-text: #222222;           /* Primary text */
}
```

### Replacing Placeholder Content

The homepage uses placeholder content that should be replaced:

1. **Logo**: Replace `public/homehni/assets/logo.png` with actual HomeHNI logo
2. **Hero Background**: Replace `public/homehni/assets/hero-bg.png` with high-quality property image
3. **Property Images**: Replace `property-*.png` files with actual property photos
4. **Text Content**: Update placeholder text in `index.html` with actual HomeHNI content

### TODO Items

The following items require user input:

- [ ] Replace placeholder logo with actual HomeHNI logo
- [ ] Replace placeholder property images with real photos
- [ ] Update hero background image
- [ ] Review and adjust color palette to match brand guidelines
- [ ] Update placeholder text content
- [ ] Add actual navigation links
- [ ] Consider using proper icon library instead of emoji icons

## License

MIT
