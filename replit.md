# Video Streaming Platform

## Overview

This is a modern video streaming platform built with React and Express.js, designed for content management and video playback. The application features a responsive UI with dark theme styling, video categorization, search functionality, and an admin panel for content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring purple/orange/pink accent colors
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Request Handling**: Express middleware for request parsing and logging
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot module replacement with Vite integration

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for production)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing

## Key Components

### Data Models
- **Videos**: Core entity with title, embed URL, thumbnail, tags, category, and view tracking
- **Categories**: Predefined categories including JAV, Amateur, Professional, Office, Student, Teacher, Fetish, Featured, and Trending
- **Schema Validation**: Zod schemas for runtime type validation

### API Endpoints
- `GET /api/videos` - Retrieve all videos
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos/:id/view` - Increment view count
- `GET /api/videos/category/:category` - Filter by category
- `GET /api/videos/search/:query` - Search videos
- `POST /api/videos` - Create new video (admin)
- `PUT /api/videos/:id` - Update video (admin)
- `DELETE /api/videos/:id` - Delete video (admin)

### Frontend Pages
- **Home**: Video browsing with search, filtering, and categorization
- **Video Page**: Individual video viewing with related content
- **Admin Panel**: Content management interface with CRUD operations
- **404 Page**: Error handling for invalid routes

### UI Components
- **VideoCard**: Reusable video display component with hover effects
- **VideoModal**: Modal video player with view tracking
- **Navigation**: Header with search and category navigation
- **Admin Forms**: Video creation and editing interfaces
- **Admin Table**: Data management with sorting and actions

## Data Flow

1. **Video Browsing**: Users browse videos through the home page, which fetches data via React Query
2. **Search/Filter**: Navigation component updates URL parameters, triggering new API calls
3. **Video Viewing**: Clicking videos opens modal player and increments view count
4. **Admin Operations**: Admin panel provides CRUD interface for video management
5. **State Management**: React Query handles caching, background updates, and optimistic updates

## External Dependencies

### UI Framework
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing for Tailwind

### Database & ORM
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: PostgreSQL serverless database provider
- **Drizzle Kit**: Database migration and introspection tools

### Form Handling
- **React Hook Form**: Performant form library with validation
- **Zod**: Runtime type validation and schema definition

## Deployment Strategy

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Both builds are optimized for production deployment

### Environment Configuration
- **Development**: Uses Vite dev server with HMR and in-memory storage
- **Production**: Serves static files through Express with PostgreSQL database
- **Database**: Configured through `DATABASE_URL` environment variable

### Replit Integration
- **Modules**: Node.js 20, web server, and PostgreSQL 16
- **Autoscale Deployment**: Configured for automatic scaling
- **Port Configuration**: Development on port 5000, production on port 80

## Changelog
```
Changelog:
- June 21, 2025. Initial setup
- June 21, 2025. Removed promotional hero banner and feature badges for cleaner UI
- June 21, 2025. Created dedicated pages for new releases, videos, categories, channels, and featured content
- June 21, 2025. Implemented pagination system with 6 videos per page on homepage and 18 on videos page
- June 21, 2025. Updated navigation to use dedicated page routes instead of query parameters
- June 21, 2025. Added admin login authentication with username/password protection
- June 21, 2025. Enhanced iframe player with security attributes and fallback options for embedding issues
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```