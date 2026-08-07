# ReviewLog Development Roadmap

## Current Status

- [x] Django REST Framework backend completed
- [x] CRUD APIs implemented
- [x] Backend deployed on Render (`https://reviewlog.onrender.com/api/`)
- [x] JWT authentication (register, login, token refresh)
- [x] User profile APIs
- [x] Public/private review visibility
- [x] Object-level review permissions (owner-only edit/delete)
- [x] CORS configured for local frontend (`localhost:5173`)
- [x] React frontend completed (Vite + React 19 + Tailwind)
- [x] Dashboard, reviews CRUD, public feed, profile, and settings pages
- [x] Frontend dependency and Vite configuration updated

---

## Backend Enhancements

### Authentication
- [x] User Registration
- [x] JWT package installed
- [x] Token Refresh
- [x] Protected Routes

### User Management
- [x] Associate Reviews with Users
- [x] User Profile
- [x] Profile APIs

### Review Features
- [x] Public/Private Reviews
- [x] Public Reviews Feed
- [x] User Review APIs
- [ ] Search Reviews (backend)
- [ ] Filter Reviews (backend)
- [ ] Pagination (backend)

### Security
- [x] Review Permissions
- [x] Validation
- [ ] Error Handling (standardized API error responses)

### Backend Configuration
- [x] CORS
- [ ] Environment Variables (production secrets via env)
- [ ] API Documentation (Swagger/OpenAPI)

### Frontend
- [x] React integration with deployed backend
- [x] JWT auth with auto token refresh
- [x] Protected routes and dashboard shell
- [x] Review CRUD with search, filters, sorting, and pagination (client-side)
- [x] Public reviews discovery page
- [x] Responsive layout and shared UI components

---

## Remaining / Future Work

- [ ] Backend search, filter, and pagination endpoints
- [ ] Review categories and tags
- [ ] Image uploads for reviews
- [ ] Profile editing API support
- [ ] PostgreSQL for production database
- [ ] API documentation
- [ ] Deployment for frontend (Vite `dist/` build)

---

## Last Updated

- **Date:** August 7, 2026
- **Notes:** Synced roadmap with current backend and frontend implementation status.
