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

- **`package.json`** - Tool dependencies and scripts:
  - `npm start` - Serve public/ on port 3000
  - `npm run compare` - Run visual comparison
  - `npm run build` - No-op for static site

- **`vercel.json`** - Vercel static deployment configuration

### Documentation

- **`README.md`** - Complete documentation:
  - Project structure
  - Local development instructions
  - Visual comparison usage
  - Vercel deployment guide
  - Development notes

- **`PR_DESCRIPTION.md`** - This file

### Updated `.gitignore`

Added exclusions for:
- `tools/node_modules/`
- `tools/output/`
- Image assets (to be added separately)

## Manual Steps Required

After merging this PR, maintainers should:

1. **Add Images**:
   - Add hero background image
   - Add property listing images
   - Add location images
   - Add HomeHNI logo
   - See `public/homehni/assets/README.txt` for full list

2. **Run Local Comparison**:
   ```bash
   cd tools
   npm install
   npm start &
   npm run compare
   ```

3. **Verify Deployment**:
   - Deploy to Vercel staging
   - Verify all sections render correctly
   - Test responsive breakpoints

## TODOs

- [ ] Replace all placeholder images with actual assets
- [ ] Confirm brand colors (#1E90FF, #FF7A59) with design team
- [ ] Add HomeHNI logo (SVG preferred)
- [ ] Review typography choices
- [ ] Add favicon
- [ ] Implement search functionality
- [ ] Add property detail pages
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Performance optimization (image compression, lazy loading)
- [ ] SEO meta tags

## CI/CD Notes

⚠️ **Network Restrictions**: The visual comparison script may not be able to capture bayut.ae screenshots in CI environments due to network restrictions. This is expected behavior.

To perform a full visual comparison:
1. Clone the repository locally
2. Run `npm install` in the `tools/` directory
3. Start the local server: `npm start`
4. Run comparison: `npm run compare`
5. Review output images in `tools/output/`

## Screenshots

### HomeHNI Homepage Prototype

![HomeHNI Homepage](https://github.com/user-attachments/assets/f6d02c7b-e482-4c0a-b080-1a5bc527cb20)

## Testing Checklist

- [x] HTML validates (W3C)
- [x] CSS validates (W3C)
- [x] Responsive on mobile
- [x] Responsive on tablet
- [x] Responsive on desktop
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Visual comparison with Bayut.ae
- [ ] Vercel deployment test
