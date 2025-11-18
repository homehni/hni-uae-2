# Bayut.com Replica - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing from established real estate portals (Zillow, Realtor.com, Rightmove) and specifically Bayut.com's patterns for property search, filtering, and browsing interfaces.

**Core Principles**:
- Visual hierarchy emphasizing property imagery and pricing
- Dense information architecture with clear categorization
- Trust signals through agent verification and property details
- Efficient search and filter mechanisms

## Typography System

**Font Families** (Google Fonts):
- Primary: Inter (headings, UI elements, property titles)
- Secondary: System default for body text and descriptions

**Scale & Hierarchy**:
- Hero headlines: text-4xl to text-5xl, font-bold
- Section headings: text-2xl to text-3xl, font-semibold
- Property titles: text-lg to text-xl, font-semibold
- Property prices: text-xl to text-2xl, font-bold
- Metadata/specs: text-sm, font-medium
- Body text: text-base, font-normal
- Filter labels: text-sm, font-medium

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section spacing: py-12, py-16, py-20
- Card gaps: gap-4, gap-6
- Grid gutters: gap-6, gap-8

**Container Strategy**:
- Full-width: Header, hero search, footer
- Constrained content: max-w-7xl mx-auto px-4
- Property grids: max-w-7xl

**Grid Layouts**:
- Property cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Featured sections: grid-cols-2 lg:grid-cols-4
- New projects by city: Horizontal scroll cards on mobile, grid on desktop
- Filter sidebar: Fixed width 280px on desktop, drawer on mobile

## Component Library

### Navigation
- Sticky header with logo, location selector, Buy/Rent toggle, Sign In
- Search bar prominence with autocomplete dropdown
- Secondary nav: Find Agent, New Projects, Commercial, Mortgages

### Hero Section
- Large search interface with location input, property type selector, price range
- "Buy" and "Rent" toggle buttons
- Quick filters: Bedrooms, Property Type, Price Range
- Background: Subtle gradient or cityscape image (Dubai skyline)

### Property Cards
- 16:9 aspect ratio image with gallery indicators
- Badge overlays: "Featured", "New Project", "Price Reduced"
- Heart icon (wishlist) top-right
- Price prominent (AED format with M/K abbreviations)
- Location breadcrumb: Area > Subarea > Building
- Key specs row: Beds • Baths • Sq Ft
- Agent thumbnail with name/company (small)
- WhatsApp contact button
- Hover: Subtle lift shadow, no complex animations

### Filter Panel
- Collapsible sections: Location, Property Type, Price, Beds & Baths, Area Size, Amenities
- Multi-select checkboxes with counts
- Range sliders for price and area
- "Apply Filters" sticky button
- Clear all filters link

### Property Detail Page
- Full-width image gallery (main + thumbnails, lightbox on click)
- Two-column layout: Left (images, description, amenities) | Right (price card with agent contact)
- Location map embedded (Google Maps iframe)
- Similar properties carousel at bottom
- Breadcrumb navigation at top

### New Projects Section
- Tabbed navigation by city (Dubai, Abu Dhabi, Sharjah, etc.)
- Horizontal scrollable cards showing: Project name, property types, location, launch price, handover date
- WhatsApp contact on each card

### Agent Profiles
- Circular profile images (80x80px)
- Agent name, company, rating stars
- "View Profile" and "Contact" buttons
- Verification badge for trusted agents

### Footer
- Multi-column layout with links organized by: Popular Searches, Property Types, Areas, Company Info
- Newsletter signup form
- Social media icons
- App download badges (iOS/Android)
- Language selector (English/Arabic)

## Images

**Hero Section**: 
- Full-width background image of Dubai skyline or modern UAE architecture
- Overlaid with semi-transparent gradient for search interface readability

**Property Images**:
- All property cards require hero images (3-5 images per property in gallery)
- Minimum 800x600px, optimized WebP format
- Image types: Exterior, living room, bedroom, amenities, location views

**Agent Photos**: 
- Professional headshots, circular crop
- Placeholder: Generic avatar icons for demo

**New Projects**:
- Architectural renderings or completed building exteriors
- 400x300px thumbnails in project cards

## Responsive Behavior

**Desktop (lg:)**: 
- 4-column property grid
- Sidebar filters visible
- Full navigation menu

**Tablet (md:)**:
- 2-column property grid
- Drawer filters
- Condensed navigation

**Mobile (base)**:
- Single column cards
- Bottom sheet filters
- Hamburger menu
- Sticky search button

## Icons
**Library**: Heroicons (via CDN)
- Search, location pin, bed, bath, ruler (area), heart, share, phone, WhatsApp logo
- Filter icon, close, chevrons, star (ratings)

## Key Interactions
- Filter changes update results instantly (no page reload)
- Property card click navigates to detail page
- Wishlist heart toggle (local storage)
- Map markers clustered by area
- "Load More" pagination for listings
- Sort dropdown: Price, Date, Featured

## Trust & Verification Elements
- "TruBroker™" badge on verified agents
- "TruEstimate™" price evaluation widget
- Property verification indicators
- Handover date and launch price transparency for new projects