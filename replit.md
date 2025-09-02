# Overview

This is a full-stack e-commerce application for luxury cufflinks called "LuxeCuffs". The application features a modern React frontend with a Node.js/Express backend, implementing a complete online store with product catalog, shopping cart, checkout with Stripe payments, and admin dashboard functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for cart and theme state, TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Forms**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store
- **Payment Processing**: Stripe integration for secure payment handling
- **Email**: Nodemailer for order confirmations and notifications

## Data Storage
- **Primary Database**: PostgreSQL via Neon Database serverless platform
- **ORM**: Drizzle ORM with schema-first approach
- **Schema**: Four main entities - users, products, orders, and order_items
- **Migrations**: Drizzle Kit for database schema management

## Authentication & Authorization
- **Admin Authentication**: Simple session-based authentication stored in localStorage (development approach)
- **Session Storage**: Express sessions with PostgreSQL backing store
- **Route Protection**: Client-side route guards for admin dashboard access

## External Dependencies
- **Payment Gateway**: Stripe for payment processing with React Stripe.js integration
- **Database Hosting**: Neon Database for serverless PostgreSQL
- **Email Service**: Configurable SMTP via Nodemailer (defaults to Ethereal for development)
- **CDN/Assets**: Unsplash for product images
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono)
- **Development Tools**: Replit-specific plugins for development environment