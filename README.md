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
└── vercel.json            # Vercel deployment configuration
```

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The main app will be available at http://localhost:5000/
The HomeHNI static page will be available at http://localhost:5000/homehni/

### Building for Production
```bash
npm run build
```

## Deploying to Vercel

### Quick Deploy
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

### Via Dashboard
1. Go to vercel.com
2. Import this GitHub repository
3. Vercel will auto-detect the configuration

## Homepage Comparison Tool

```bash
npm run compare
```

Or with options:
```bash
node tools/compare-homepages.js --homehni-url http://localhost:5000/homehni/
```

## Customizing the Homepage

### Color Palette
Edit CSS variables in `public/homehni/styles.css`:
```css
:root {
    --color-primary: #1E90FF;
    --color-accent: #FF7A59;
    --color-background: #FFFFFF;
    --color-text: #222222;
}
```

## License
MIT
