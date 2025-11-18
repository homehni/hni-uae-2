# Bayut UAE Property Portal - Replit Documentation

## Overview

This is a real estate property portal application inspired by Bayut.com, designed for browsing and searching properties for sale and rent in the UAE. The application provides a comprehensive property listing platform with advanced filtering, agent information, and detailed property views.

**Core Functionality:**
- Property search and filtering (by type, location, price, bedrooms, amenities)
- Detailed property listings with image galleries
- Agent profiles with verification badges
- Wishlist functionality with localStorage persistence
- Responsive design for mobile and desktop
- Featured properties and new project showcases

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool:**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing (not React Router)
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System:**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- **Inter font** from Google Fonts for typography
- Components follow the "New York" style variant from shadcn

**State Management:**
- Server state: TanStack Query with custom query functions
- Local state: React hooks (useState, useEffect)
- Persistent state: localStorage for wishlist functionality
- Custom events for cross-component communication (wishlist updates)

**Key Frontend Patterns:**
- Component composition with separate UI components in `/client/src/components`
- Page-based routing with components in `/client/src/pages`
- Custom hooks in `/client/src/hooks` (e.g., `use-mobile`, `use-toast`)
- Utility functions in `/client/src/lib` for common operations
- Path aliases configured (`@/` for client/src, `@shared/` for shared code)

### Backend Architecture

**Server Framework:**
- **Express.js** running on Node.js
- TypeScript throughout the entire stack
- ESM modules (not CommonJS)

**API Design:**
- RESTful API endpoints under `/api/*` prefix
- JSON request/response format
- Query parameter-based filtering for GET requests
- Route handlers in `/server/routes.ts`
- Custom logging middleware for API requests

**Data Layer:**
- In-memory storage implementation (`MemStorage` class in `/server/storage.ts`)
- Mock data initialization for development
- Interface-based storage abstraction (`IStorage`) for future database integration
- Pre-populated with sample properties, agents, and location data

**Development Server:**
- Vite middleware integration for HMR in development
- Static file serving in production
- Custom error handling and logging

### Data Storage Solutions

**Current Implementation:**
- **In-memory storage** using Map data structures
- Mock data for properties, agents, and locations
- No database currently provisioned despite Drizzle configuration

**Database Schema (Prepared but Not Active):**
- **Drizzle ORM** configured for PostgreSQL
- Schema defined in `/shared/schema.ts`:
  - `properties` table: Full property details including images, amenities, pricing
  - `agents` table: Agent profiles with verification status and ratings
- **Neon Database** serverless driver configured (`@neondatabase/serverless`)
- Zod schemas for type-safe validation (`drizzle-zod`)

**Data Models:**
- Properties: Title, description, type, price, location, bedrooms, bathrooms, area, amenities, images
- Agents: Name, company, contact info, verification status, rating, property count
- Property filters: Support for complex multi-criteria filtering

### Authentication and Authorization

**Current Status:**
- No authentication system implemented
- No user accounts or login functionality
- All features are publicly accessible
- Session management dependencies present (`express-session`, `connect-pg-simple`) but not configured

**Future Considerations:**
- Session store configured for PostgreSQL sessions (`connect-pg-simple`)
- Foundation exists for adding user authentication later

### External Dependencies

**UI Component Libraries:**
- **Radix UI**: Comprehensive set of accessible, unstyled React primitives
  - Dialog, Dropdown, Popover, Select, Slider, Toast, and 20+ other components
  - Provides keyboard navigation and ARIA compliance
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Pre-built component patterns combining Radix UI + Tailwind

**Form Handling:**
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Validation resolver integration
- **Zod**: Runtime type validation and schema definition

**Data Fetching:**
- **TanStack Query**: Async state management, caching, and background updates
- Custom query client configuration in `/client/src/lib/queryClient.ts`

**Utilities:**
- **date-fns**: Date manipulation and formatting
- **clsx** and **tailwind-merge**: Dynamic className composition
- **class-variance-authority**: Type-safe component variants

**Icons:**
- **lucide-react**: Primary icon library
- **react-icons/si**: Social/brand icons (WhatsApp)

**Image Carousel:**
- **embla-carousel-react**: Touch-friendly carousel component

**Development Tools:**
- **Replit-specific plugins**: Runtime error modal, cartographer, dev banner
- **tsx**: TypeScript execution for development server
- **esbuild**: Production build bundler for server code

**Database (Configured but Inactive):**
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- Database connection expected via `DATABASE_URL` environment variable
- Migration system configured (`drizzle-kit`) but no migrations exist

**Build & Development:**
- **Vite**: Frontend build tool with React plugin
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **TypeScript**: Full type safety across frontend and backend