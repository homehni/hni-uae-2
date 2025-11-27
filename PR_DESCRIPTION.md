# Pull Request: Add HomeHNI Homepage Prototype and Visual Comparison Tools

## Summary
This PR adds a standalone HomeHNI homepage prototype that reproduces Bayut's layout and structure, along with visual comparison tools for development and testing.

## What's Added

### Static Homepage (`public/homehni/`)
- **index.html** - Complete homepage with header, hero, featured listings, popular areas, footer
- **styles.css** - Responsive styles using CSS variables for easy customization
- **assets/** - Placeholder images directory

### Visual Comparison Tools (`tools/`)
- **compare-homepages.js** - Puppeteer script for visual comparison with Bayut.ae

### Configuration
- **vercel.json** - Vercel deployment configuration
- **vite.config.ts** - Updated to copy homehni files to build output

## Color Palette (CSS Variables)
- Primary: `#1E90FF`
- Accent: `#FF7A59`
- Background: `#FFFFFF`
- Text: `#222222`

## TODO Items
- Replace placeholder logo with actual HomeHNI logo
- Replace placeholder property images with real photos
- Update hero background image
- Review and adjust color palette to match brand guidelines
