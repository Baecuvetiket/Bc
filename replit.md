# Replit.md - Baec UV Etiket E-Commerce Platform

## Overview

This is a modern, full-stack e-commerce web application for UV label sales inspired by uvetiket.com.tr. The application features professional UV-resistant labels with both normal and metallic printing options, dynamic pricing with bulk discounts, file upload capabilities, and comprehensive order management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

- Enhanced homepage with modern carousel banner showcasing product categories
- Added product showcase section with featured products and ratings
- Integrated customer information collection (name, email, phone) in order form
- Added comprehensive features section highlighting UV durability, waterproofing, and fast delivery
- Implemented WhatsApp contact integration for customer support
- Added detailed footer with contact information and navigation links
- Changed currency from USD to Turkish Lira (₺) for local market
- Added visual improvements with better color schemes and pricing display
- Integrated statistics display (500+ happy customers, 24h fast production, 99% quality guarantee)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **Database**: PostgreSQL with Drizzle ORM
- **File Handling**: Multer for multipart form data and file uploads
- **Session Management**: connect-pg-simple for PostgreSQL session store

### Database Design
- **Users Table**: Basic user authentication (id, username, password)
- **Orders Table**: Complete order tracking with file metadata, pricing, and status
- **ORM**: Drizzle ORM with Zod schema validation
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Client-Side Components
- **Home Page**: Main order placement interface with print type selection
- **File Upload**: Custom file upload component with validation
- **Price Calculator**: Dynamic pricing based on quantity and print type
- **UI Components**: Comprehensive shadcn/ui component library

### Server-Side Components
- **Order API**: RESTful endpoints for order creation and management
- **File Storage**: Local file system storage with size and type validation
- **Memory Storage**: In-memory data store for development (can be replaced with database)
- **Request Logging**: Custom middleware for API request logging

## Data Flow

1. **Order Creation Flow**:
   - User selects print type (normal/metallic) and quantity
   - System calculates pricing with automatic discounts
   - User uploads design file (PNG, JPG, PDF)
   - Order data is validated and stored
   - File is saved to local storage

2. **File Upload Flow**:
   - Client validates file type and size
   - Multer processes multipart form data
   - Server validates file against allowed types
   - File metadata is stored with order

3. **Pricing Logic**:
   - Normal printing: ₺2.50 per unit
   - Metallic printing: ₺5.00 per unit
   - Bulk discounts: 10% for 50+ items, 15% for 100+ items

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with class-variance-authority
- **Form Handling**: React Hook Form with Zod resolvers
- **Icons**: Lucide React icons

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **File Processing**: Multer for file uploads
- **Validation**: Zod for schema validation
- **Session**: connect-pg-simple for session management

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server for frontend with HMR
- **Backend**: tsx for TypeScript execution in development
- **Database**: PostgreSQL database (configured for Neon)

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Files**: Express serves built frontend files
- **Database**: PostgreSQL with connection pooling

### Configuration
- **Environment Variables**: DATABASE_URL required for database connection
- **File Storage**: Local uploads directory (can be configured for cloud storage)
- **Build Commands**: Separate build process for frontend and backend

## Technical Decisions

### Database Choice
- **PostgreSQL**: Chosen for production reliability and Drizzle ORM compatibility
- **Drizzle ORM**: Type-safe database queries with automatic TypeScript inference
- **Memory Storage**: Temporary development storage that can be easily replaced

### File Handling
- **Local Storage**: Simple file system storage for development
- **File Validation**: Both client and server-side validation for security
- **Size Limits**: 10MB maximum file size to prevent abuse

### Authentication Strategy
- **Session-based**: Uses PostgreSQL session store for scalability
- **Basic Schema**: Simple username/password for MVP

### Frontend Architecture
- **Component Library**: shadcn/ui for consistent, accessible UI components
- **State Management**: TanStack Query for efficient server state caching
- **Form Handling**: React Hook Form with Zod for type-safe validation