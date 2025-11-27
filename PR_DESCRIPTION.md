# Pull Request: Add HomeHNI Homepage Prototype and Visual Comparison Tools

## Summary

This PR adds a standalone HomeHNI homepage prototype that reproduces Bayut's layout and structure, along with visual comparison tools for development and testing.

## What's Added

### Static Homepage (`public/homehni/`)

- **`index.html`** - Complete homepage with:
  - Header with navigation and action buttons
  - Hero section with property search box
  - Featured listings grid (6 property cards)
  - Popular locations section
  - "Why Choose HomeHNI?" features section
  - Full footer with links and contact info

- **`styles.css`** - Responsive styles using CSS variables:
  - Primary: `#1E90FF`
  - Accent: `#FF7A59`
  - Background: `#FFFFFF`
  - Text: `#222222`

- **`assets/README.txt`** - Placeholder instructions for adding images

### Visual Comparison Tools (`tools/`)

- **`compare-homepages.js`** - Puppeteer script that:
  - Captures screenshots of bayut.ae and local HomeHNI
  - Generates a pixel-level diff image
  - Exits non-zero if difference exceeds threshold
  - Handles CI network restrictions gracefully

- Uses project root `package.json` with compare script:
  - `npm run compare` - Run visual comparison

### Build Integration

- **`vite.config.ts`** - Updated to copy homehni files to build output
- **`vercel.json`** - Updated with rewrites for `/homehni` route

### Documentation

- **`README.md`** - Complete documentation:
  - Project structure
  - Local development instructions
  - Visual comparison usage
  - Vercel deployment guide
  - Development notes

## TODOs (Require User Input)

- [ ] Replace placeholder logo with actual HomeHNI logo
- [ ] Replace placeholder property images with real photos
- [ ] Update hero background image
- [ ] Review and adjust color palette to match brand guidelines
- [ ] Update placeholder text content
- [ ] Add actual navigation links
- [ ] Consider using proper icon library instead of emoji icons

## Notes

- Bayut screenshot is a placeholder due to network restrictions in CI
- Run comparison script locally with network access for actual capture
- Color palette uses CSS variables for easy customization
