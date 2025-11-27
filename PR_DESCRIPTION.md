# Pull Request: Add HomeHNI Homepage Prototype

## Summary

This PR adds a standalone homepage prototype for HomeHNI that replicates the layout and structure of Bayut.ae using HomeHNI branding and placeholder content.

## Changes

### Added Files

1. **`public/index.html`** - Main homepage with:
   - Header with logo and navigation
   - Hero section with search form
   - Featured listings grid (4 placeholder cards)
   - Why HomeHNI features section
   - Footer with company info

2. **`public/styles.css`** - Responsive stylesheet with:
   - CSS variables for brand colors
   - Mobile-first responsive design
   - Card hover animations
   - Clean, modern typography

3. **`public/assets/README.txt`** - Instructions for adding placeholder images

4. **`tools/compare-homepages.js`** - Puppeteer-based comparison script that:
   - Captures screenshots of Bayut and local page
   - Creates visual diff using pixelmatch
   - Reports pixel difference percentage
   - Exits non-zero if difference exceeds threshold

5. **`README.md`** - Documentation for local development and deployment

6. **`PR_DESCRIPTION.md`** - This file

### Modified Files

- **`.gitignore`** - Added exclusions for tools/output and screenshots
- **`vercel.json`** - Updated for static file serving

## How to Test

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start local server:
   ```bash
   npm start
   ```

3. Open http://localhost:3000 in browser

4. (Optional) Run comparison:
   ```bash
   npm run compare
   ```

## Screenshots

_Run locally to capture screenshots. They will be saved to `tools/output/`._

## Manual Steps Required

- [ ] Add placeholder images to `public/assets/`:
  - `placeholder-1.jpg`
  - `placeholder-2.jpg`
  - `placeholder-3.jpg`
  - `placeholder-4.jpg`
- [ ] Add HomeHNI logo (`logo.png` or `logo.svg`)
- [ ] Confirm brand colors match design guidelines

## TODO Items

- Replace placeholder images with real property photos
- Update navigation links when routes are ready
- Add favicon
- Add Open Graph meta tags for social sharing
- Consider adding loading states and error handling

## Notes

- The Bayut homepage capture may fail in CI due to network restrictions. Run the comparison script locally for full visual diff.
- All CSS uses CSS variables for easy theming adjustments.
- The design is responsive and works on mobile devices.
