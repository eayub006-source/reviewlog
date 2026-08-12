# ReviewLog

## Overview

ReviewLog is a modern, full-stack review and journaling platform for books and movies. Designed as a personal library and community feed, the platform enables users to explore external book and movie catalogs, rate titles, write personal reviews, maintain a private vault of saved favorites, and share public reviews with the community.

The product is built with a warm editorial design system, featuring a cream and ivory color palette, forest green primary accents, and terracotta highlights. The interface focuses on cinematic media presentation and intuitive content discovery.

## Live Links

Frontend Client: https://reviewlog.vercel.app
Backend Server API: https://reviewlog.onrender.com
API Entry Point: https://reviewlog.onrender.com/api/

## Tech Stack

### Frontend

1. React 19 and Vite for fast development and optimized production builds.
2. Tailwind CSS v4 using OKLCH color mappings for the design system.
3. React Router DOM v7 for client-side routing and protected navigation.
4. Axios with request and response interceptors for JWT management and automatic token refresh.
5. Lucide Icons for a unified vector icon system.

### Backend

1. Django and Django REST Framework for the core API and business logic.
2. SimpleJWT for secure JSON Web Token authentication.
3. SQLite for the database implementation.
4. WhiteNoise and Gunicorn for static file hosting and production server scaling.
5. CORS (django-cors-headers) for secure origin management.

### External APIs

1. Open Library API for book catalog searching and metadata.
2. The Movie Database (TMDB) API for movie discovery and poster assets.

## Features

1. User Authentication: Secure registration, login, and logout.
2. One-Time Sign-In: Persistent authenticated sessions using secure browser storage.
3. Splash Screen: A branded entry point that intelligently routes users based on their authentication status.
4. Global Discovery: A unified search page for exploring both book and movie catalogs simultaneously.
5. Movie Discovery: Dedicated TMDB-powered search with cinematic poster grids.
6. Book Discovery: Dedicated Open Library-powered search with literary cover galleries.
7. Review Journaling: Full CRUD (Create, Read, Update, Delete) functionality for personal reviews.
8. View Toggles: Support for both Grid and List layouts in review feeds.
9. Community Feed: A public gallery of reviews shared by the ReviewLog community.
10. Favorites Vault: Personal collections for saving books and movies to revisit later.
11. Profile Management: Editable user profiles including display names, bios, and avatar support.
12. Account Settings: Persistent user preferences including language, region, and content filters.
13. Dashboard: A personalized home hub featuring a hero spotlight, recent activity carousels, and quick stats.

## Architecture

### Frontend Architecture

The React client is structured by responsibility:

1. api: Global Axios configuration and interceptors.
2. components: Reusable UI primitives (MediaCard, RatingRing, Carousel) and layout headers.
3. context: Global state providers for authentication and notifications.
4. hooks: Stateful logic hooks for reviews, profiles, and search.
5. layouts: Structural wrappers for authenticated and public routes.
6. pages: Route-level screen components.
7. routes: Routing definitions and protected route guards.
8. services: Stateless API client implementations.
9. utils: Helper utilities for storage and error parsing.

### Backend Architecture

The Django backend is organized into modular components:

1. Models: Database schemas including the core Review, UserProfile, and UserSettings models.
2. Serializers: Schema representations and writable nested validation logic.
3. Views: API endpoints and viewsets for business logic execution.
4. Services: External provider adapters for TMDB and Open Library proxies.
5. Migrations: Managed database schema history (including migration 0006 for profiles and settings).

### Security Architecture

1. JWT Authentication: Stateless session management using access and refresh tokens.
2. Axios Interceptors: Automatic injection of Authorization Bearer headers and automatic JWT access-token refresh using the refresh token.
3. Protected Routes: Frontend route guards that prevent unauthorized access to private data.
4. Object-Level Permissions: Backend enforcement ensuring users can only modify their own reviews and profiles.
5. API Proxying: Third-party API keys are managed strictly on the server to prevent exposure.

## Project Structure

```text
reviewlog/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── reviews/
│   ├── migrations/
│   ├── serializers/
│   ├── services/
│   ├── views/
│   ├── models.py
│   └── urls.py
│
├── reviewlog_backend/
│   ├── settings.py
│   └── urls.py
│
├── manage.py
└── requirements.txt
```

## Major API Endpoints

### Authentication

1. POST /api/register/ - User registration.
2. POST /api/token/ - Login to obtain JWT tokens.
3. POST /api/token/refresh/ - Obtain a new access token.

### User and Profile

1. GET /api/profile/ - Retrieve current user profile.
2. PATCH /api/profile/ - Update profile details (name, bio, avatar).
3. GET /api/dashboard/stats/ - Aggregate metrics for the dashboard.

### Reviews

1. GET /api/reviews/ - List authenticated user reviews.
2. POST /api/reviews/ - Create a new review.
3. GET/PUT/PATCH/DELETE /api/reviews/<id>/ - Manage a specific review.
4. GET /api/public-reviews/ - List all public community reviews.

### Catalog and Favorites

1. GET /api/catalog/books/ - Search the book catalog.
2. GET /api/catalog/movies/ - Search the movie catalog.
3. GET/POST /api/favorites/ - List or save favorite items.
4. DELETE /api/favorites/<id>/ - Remove an item from favorites.
5. GET/POST /api/recent-items/ - Track recently viewed catalog items.

## Environment Variables

### Backend

1. DJANGO_SECRET_KEY: Unique secret key for encryption.
2. DJANGO_DEBUG: Boolean for debug mode (set to False in production).
3. ALLOWED_HOSTS: List of permitted hostnames.
4. CORS_ALLOWED_ORIGINS: Permitted frontend origins.
5. TMDB_API_KEY: Private key for movie catalog access.

## Local Setup

### Backend Setup

1. Create a virtual environment: python -m venv .venv
2. Activate the environment: .venv\Scripts\activate (Windows) or source .venv/bin/activate (macOS/Linux)
3. Install dependencies: pip install -r requirements.txt
4. Run migrations: python manage.py migrate
5. Start the server: python manage.py runserver

### Frontend Setup

1. Navigate to the frontend directory: cd frontend
2. Install dependencies: npm install
3. Start the development server: npm run dev
4. Build for production: npm run build
5. Run linter: npm run lint

## Development Status

### Completed

1. Backend foundation and REST API implementation.
2. JWT authentication with automatic token refresh.
3. Full CRUD for reviews and favorites.
4. External catalog integration for movies and books.
5. Migration 0006 for UserProfile and UserSettings support.
6. Warm editorial design system implementation.
7. Branded splash screen and split-screen authentication.
8. Core UI components: MediaCard, HeroBanner, RatingRing, Carousel.
9. Persistent account settings and profile editing with avatar support.
10. Global discovery hub and responsive top navigation.

### Recent Checkpoint

Commit: 73a498b
Message: feat: complete ReviewLog warm editorial redesign
Description: This checkpoint finalized the full-stack transition to the warm editorial design system, implemented persistent profile editing and settings, and optimized authentication performance.

## Author

Eshal Ayub
Developed as part of a software engineering internship assignment.
