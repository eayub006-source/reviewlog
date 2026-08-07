# ReviewLog Frontend

ReviewLog is a production-focused React frontend for managing private and public reviews with secure JWT authentication and a polished SaaS-style dashboard experience.

## Project Overview

This frontend is built to consume the deployed Django REST backend and includes:

- JWT authentication with refresh-token handling
- Protected dashboard shell with sidebar and top navbar
- Full review CRUD workflows
- Public review discovery page
- Reusable design system and shared component architecture
- Responsive layouts from mobile to desktop

## Architecture

The app follows a clean frontend architecture:

- `pages/`: route-level screens and user flows
- `layouts/`: authenticated and public page shells
- `components/ui/`: low-level UI primitives
- `components/common/`: reusable product-level components
- `components/layout/`: navigation and chrome
- `services/`: API interactions and cache-aware calls
- `hooks/`: reusable stateful logic (`useReviews`, `useProfile`, `useAuth`, `useToast`)
- `context/`: shared app providers (auth, toast)
- `utils/`: formatting and API error normalization

## Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS v4
- shadcn/ui patterns
- Lucide React

## Features

### Authentication

- Login and registration forms
- JWT access + refresh storage
- Auto-refresh token interceptor
- Protected routes and auth-aware redirects

### Dashboard

- Responsive sidebar + top navbar shell
- Welcome, profile snapshot, and quick-action cards
- Live statistics from review data:
	- Total reviews
	- Public reviews
	- Private reviews
	- Average rating
- Recent reviews panel with empty states

### Reviews CRUD

- My Reviews listing with:
	- Search
	- Visibility filters
	- Sorting (newest, oldest, highest, lowest)
	- Pagination
- Create review form with validation + counters
- Edit review with prefilled data
- Delete review with confirmation dialog
- Unified toast notifications for CRUD outcomes

### Public Reviews

- Dedicated public feed page
- Search and pagination
- Shared reusable review-card UI

### Profile

- Backend-driven user profile
- Username, email, member summary, and review count
- Avatar placeholder and edit action placeholder

### Responsive Design

- Mobile drawer sidebar with overlay
- Adaptive card grids and spacing
- Navigation and forms optimized for smaller screens

### UX and Accessibility

- Unified toasts for success/error/info feedback
- Reusable skeleton loading states
- Semantic controls and ARIA-friendly interactions
- Keyboard-close support for menu overlays and dropdowns

## Backend API Integration

The frontend uses only the deployed backend:

`https://reviewlog.onrender.com/api/`

Primary endpoints:

- `POST /token/`
- `POST /token/refresh/`
- `POST /register/`
- `GET /profile/`
- `GET/POST /reviews/`
- `GET/PUT/DELETE /reviews/:id/`
- `GET /public-reviews/`

## Folder Structure

```text
src/
	api/
	components/
		common/
		layout/
		ui/
	constants/
	context/
	hooks/
	layouts/
	pages/
		auth/
		dashboard/
		errors/
		profile/
		reviews/
		settings/
	routes/
	services/
	styles/
	utils/
```

## Key Routes

- `/login`
- `/register`
- `/dashboard`
- `/reviews`
- `/reviews/new`
- `/reviews/:reviewId/edit`
- `/public-reviews`
- `/profile`
- `/settings`

## Installation

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment

- Frontend: Vite build output (`dist/`)
- Backend API: Render-hosted Django service
- Ensure production environment allows requests to `https://reviewlog.onrender.com/api/`

## Screenshots Placeholders

Add screenshots here as the UI evolves:

- Login page
- Registration page
- Dashboard overview
- My Reviews page
- Public Reviews page
- Profile page
- Mobile sidebar drawer

## Future Improvements

- Review attachments/media
- Review tags and categories
- Advanced analytics widgets
- Profile editing API support
- Notification center integration

## License

Internship project. Add an explicit license file if this repository is made public.
