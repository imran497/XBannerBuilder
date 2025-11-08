# Twitter/X Banner Generator

## Overview

A web application for designing custom Twitter/X banners (1500x500px) with a live preview interface. The application features a split-screen layout with a collapsible sidebar containing design controls and a canvas area for real-time banner editing. Users can customize backgrounds (solid colors or gradients), add and style text with Google Fonts, insert icons and images, and export production-ready PNG files.

The application aims to provide a productivity tool aesthetic inspired by Linear/Figma, with clean, functional interfaces that prioritize usability and minimize visual noise.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- React Query (@tanstack/react-query) for server state management

**UI Component System:**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Inter font as the primary typeface via Google Fonts
- Custom CSS variables for theming (light mode by default)

**Canvas Implementation:**
- Fabric.js for canvas manipulation and object management
- Custom `BannerCanvas` component with imperative handle for programmatic control
- Support for text objects (IText), SVG icons, and raster images
- Real-time preview at 1500x500px dimensions with scaling support

**Component Architecture:**
- Feature-based component organization (BackgroundSection, TextSection, IconSection, GitHubSection, ExportSection)
- Accordion-based collapsible sidebar sections for organized controls
- TwitterProfilePreview component showing banner in context of a Twitter profile
- Separation of presentational and container components

**State Management:**
- Local component state using React hooks (useState, useRef, useEffect)
- Lifted state pattern for sharing canvas state between sidebar and preview
- Custom hooks for mobile detection and toast notifications

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Custom Vite middleware integration for development
- Static file serving in production mode

**Storage Layer:**
- In-memory storage implementation (MemStorage class) implementing IStorage interface
- Designed for future database integration (schema ready for PostgreSQL)
- CRUD operations for users, GitHub users, and banner designs

**API Structure:**
- RESTful API design pattern (routes prefixed with /api)
- JSON request/response format
- Session-based logging middleware for request tracking

### Data Storage Solutions

**Database Schema (PostgreSQL via Drizzle ORM):**
- `users` table: Traditional authentication (username/password)
- `github_users` table: OAuth users with GitHub integration (githubId, username, avatarUrl, accessToken)
- `banner_designs` table: Saved banner configurations (canvasData as JSONB, timestamps)
- Relationships: banner_designs references github_users via foreign key

**ORM Configuration:**
- Drizzle ORM for type-safe database operations
- Schema-first approach with Zod validation
- Migration support via drizzle-kit
- Connection to Neon Database (serverless PostgreSQL)

**Data Models:**
- Type inference from Drizzle schema using `$inferSelect`
- Insert schemas using `createInsertSchema` with Zod
- Separation of insert types and full record types

### Authentication & Authorization

**Planned Implementation:**
- GitHub OAuth integration for user authentication
- Access token storage for GitHub API calls
- Session management (express-session with connect-pg-simple for PostgreSQL session store)
- User-scoped data access (banner designs tied to GitHub user)

**Current State:**
- Authentication scaffolding in place but not fully implemented
- Storage interface supports both traditional users and GitHub OAuth users

### External Dependencies

**Design & UI Libraries:**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icon components
- react-colorful for color picker functionality

**Canvas & Graphics:**
- Fabric.js for canvas manipulation and rendering
- HTML Canvas API for export functionality

**Third-Party Services:**
- GitHub API (planned): User profile data, contribution graphs
- Neon Database: Serverless PostgreSQL hosting
- Google Fonts: Web font delivery (Inter, Roboto, Montserrat, etc.)

**Development Tools:**
- Replit-specific plugins: runtime error overlay, cartographer, dev banner
- TypeScript for type checking
- ESBuild for production bundling
- PostCSS with Autoprefixer for CSS processing

**Utilities:**
- date-fns for date manipulation
- clsx and tailwind-merge for conditional class names
- nanoid for unique ID generation
- Zod for schema validation