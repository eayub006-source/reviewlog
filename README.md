# ReviewLog

ReviewLog is a modern, full-stack review and journaling platform for books and movies. Designed as a personal library and community feed, the platform enables users to explore external book and movie catalogs, rate them, write reviews, maintain a personal vault of saved favorites, and share public reviews with the community.

## 🚀 Live Demo & API Root

The application is deployed across cloud environments:

*   **Frontend Client (Vercel):** [https://reviewlog.vercel.app](https://reviewlog.vercel.app)
*   **Backend Server API (Render):** [https://reviewlog.onrender.com](https://reviewlog.onrender.com)
    *   *API Entry Point:* `https://reviewlog.onrender.com/api/`

---

## 🛠️ Tech Stack

### Frontend Client
*   **React 19 & Vite:** Ultra-fast bundling and rendering.
*   **Tailwind CSS (v4):** Modern utility-first CSS using OKLCH color mappings and dark-theme configurations.
*   **React Router DOM (v7):** Client-side routing, protected route guards, and lazy-loading.
*   **Axios:** Configured with request/response interceptors for advanced JWT management.
*   **Lucide Icons:** Unified vector icon system.

### Backend Server
*   **Django & Django REST Framework (DRF):** Robust API framework, model serializers, and custom permissions.
*   **SimpleJWT:** JSON Web Token authentication standard.
*   **SQLite:** Deployed for lightweight database management.
*   **WhiteNoise & Gunicorn:** Production-ready static asset hosting and WSGI server scaling.
*   **CORS (django-cors-headers):** Restricted origin-sharing for frontend-backend isolation.

### External Integration APIs
*   **Open Library API:** Catalog searching for books.
*   **The Movie Database (TMDB) API:** Catalog searching and poster rendering for movies.

---

## 📦 Project Structure

The project maintains a clean separation of concerns between presentation and business logic:

```text
reviewlog/
│
├── frontend/                     # React/Vite Client
│   ├── src/
│   │   ├── api/                  # Global Axios instances & interceptors
│   │   ├── components/           # UI Primitives, headers & page components
│   │   ├── context/              # Contexts (AuthContext, ToastContext)
│   │   ├── hooks/                # Stateful hooks (useAuth, useReviews, useProfile)
│   │   ├── layouts/              # Wrapper structures (AuthLayout, DashboardLayout)
│   │   ├── pages/                # Route container screens
│   │   ├── routes/               # Route definitions & ProtectedRoute guards
│   │   ├── services/             # Stateless API client calls
│   │   └── utils/                # Token storage, API error parsers, and merges
│   └── package.json
│
├── reviews/                      # Django Core App
│   ├── serializers/              # Schema representation & validations
│   ├── services/                 # External proxy adapters (OpenLibrary & TMDB)
│   ├── views/                    # Modular viewsets & API endpoints
│   ├── models.py                 # SQLite Schema mapping
│   ├── urls.py                   # App routing endpoints
│   └── permissions.py            # Object-level security guards
│
├── reviewlog_backend/            # Django Project Settings
│   ├── settings.py
│   └── urls.py
│
├── manage.py
└── requirements.txt
```

---

## ✨ Features

*   **User Accounts & Registrations:** Complete secure sign-up, login, and profile administration.
*   **JWT Security Architecture:** Robust authentication featuring automatic token headers injection, automatic JWT access-token refresh using the refresh token, and safe 401 error containment.
*   **Unified Media Search & Discovery:** Debounced, cancelable paged search for books and movies proxied server-side to hide third-party API keys securely.
*   **Review Logging & Journaling:** Create, read, update, and delete (CRUD) reviews. Supports five-star ratings, visibility controls (Public/Private), and title metadata.
*   **Favorites Vault:** A user-scoped personal collection to bookmark books and movies for future journaling.
*   **Recently Viewed Logging:** Automatically logs recently selected media to render a customized "Continue Journaling" panel on the home page.
*   **Community Reviews Feed:** A public feed displaying reviews published as "Public" by any community traveller.
*   **Global Toasts & Offline Notices:** Custom toast messaging context and offline listener widgets to protect user input states.

---

## 🎨 Frontend Design Direction

ReviewLog is progressively transitioning toward a **cinematic, dark, media-focused UI** inspired by the modern media-discovery usability and visual richness of **TMDB (The Movie Database)**:

*   **Cinematic Default Dark Theme:** Engineered using high-contrast typography, deep obsidian panel elevations (`oklch(17% 0.02 256)`), and a carbon canvas (`oklch(12% 0.015 256)`) to focus purely on poster imagery.
*   **Glowing Design System Accents:** Utilizes TMDB-inspired bright teal (`#01b4e4`) and emerald secondary brand colors, combined with glowing rating gold (`#f5c518`) star highlights.
*   **Global Top Navigation Header:** Desktop layouts have migrated to a horizontal top-bar header with responsive navigation states, secondary settings dropdowns, and clear "+ Add Review" shortcuts.
*   **Accessible Mobile Overlays:** Mobile responsive drawers feature focus-trapping tab locks, keyboard Escape triggers, and full accessibility labels.
*   *Note: This visual redesign is being implemented progressively in phases and is currently in progress.*

---

## 🛡️ Authentication & Performance Fixes

In our latest stability sprint, we resolved several critical session bottlenecks:
*   **Interceptor Boundary Patch:** The Axios response interceptor completely bypasses the automatic refresh loop for non-authenticated endpoints (`/token/` or `/register/`). Wrong password login attempts reject instantly, shaving **3.5+ seconds** of redundant network latency.
*   **Race-Condition Double-Navigations Mitigated:** Resolved a race condition where the rendering state re-evaluation triggered double navigations to `/dashboard`. This completely protects the SQLite database from concurrent query overloads.
*   **Reduced Login Redirection Work:** Removed artificial `600ms` setTimeout delays during sign-in, allowing a fluid transition and reducing unnecessary authentication/navigation work.
*   **Visual Flashing Guard:** Bound an `isInitializing` bootstrap context check around the router wrapper, displaying a full-screen spinner to shield the viewport until JWT authorization completes on cold-reloads.

---

## 🔗 Major API Endpoints

All endpoints except `register`, `token`, and `token/refresh` require an `Authorization: Bearer <access_token>` request header.

### Authentication
*   `POST /api/register/` — Register a new account.
*   `POST /api/token/` — Login and fetch JWT access/refresh tokens.
*   `POST /api/token/refresh/` — Refresh an expired access token.

### User Management
*   `GET /api/profile/` — Retrieve the current user's profile details.
*   `PATCH /api/profile/` — Modify profile attributes.

### Review Journaling
*   `GET /api/reviews/` — List the authenticated user's reviews.
*   `POST /api/reviews/` — Log a new review.
*   `GET/PUT/PATCH/DELETE /api/reviews/<id>/` — View or manage specific reviews (enforces strict object-level user ownership).
*   `GET /api/public-reviews/` — Browse published community reviews.

### Catalog Proxies
*   `GET /api/catalog/books/?q=<query>&page=<n>` — Search OpenLibrary books.
*   `GET /api/catalog/movies/?q=<query>&page=<n>` — Search TMDB movies.

### Personal Collections
*   `GET/POST /api/favorites/` — Retrieve or save favorite books/movies.
*   `DELETE /api/favorites/<id>/` — Remove an item from user favorites.
*   `GET/POST /api/recent-items/` — List or record recently viewed catalog cards.
*   `GET /api/dashboard/stats/` — Fetch aggregate review metrics.

---

## 🔒 Environment Variables

Sensitive configuration keys must never be committed to GitHub. Maintain them inside a local `.env` file or within your production platform's environment fields:

### Backend Django
*   `DJANGO_SECRET_KEY` — Unique cryptographic secret for encryption.
*   `DJANGO_DEBUG` — Set to `false` in production.
*   `ALLOWED_HOSTS` — Comma-separated list of approved DNS hosts.
*   `CORS_ALLOWED_ORIGINS` — Comma-separated list of approved frontend client origins.
*   `TMDB_API_KEY` — Your private key for TMDB catalog proxied requests.

---

## 💻 Local Setup & Development

### 1. Backend Server Setup
From the project root:

1.  **Create and activate a virtual environment:**
    ```bash
    # Create
    python -m venv .venv
    
    # Activate (Windows)
    .venv\Scripts\activate
    
    # Activate (macOS/Linux)
    source .venv/bin/activate
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Apply database migrations:**
    ```bash
    python manage.py migrate
    ```
4.  **Launch the development server:**
    ```bash
    python manage.py runserver
    ```
    *The API will run at `http://127.0.0.1:8000/api/`*

### 2. Frontend Client Setup
From the `frontend/` directory:

1.  **Install node dependencies:**
    ```bash
    npm install
    ```
2.  **Run development server (Vite):**
    ```bash
    npm run dev
    ```
    *The web app will run locally at `http://localhost:5173/` and securely proxy queries to the warm deployed Render backend.*
3.  **Verify compilation & bundles:**
    ```bash
    npm run build
    ```
4.  **Run static linting checks (Oxlint):**
    ```bash
    npm run lint
    ```

---

## 📈 Development Status

### Completed
*   Django REST Framework CRUD endpoints and schemas.
*   Server-side Open Library & TMDB catalog search wrappers.
*   JWT authentication lifecycle, storage, and auto-refresh Axios interceptors.
*   Bootstrap visual state guards preventing router flashing.
*   Eliminated double-navigation loops and corrected 401 interceptor bypass loops.
*   Cinematic, dark-mode OKLCH design variables in `index.css`.
*   A fully redesigned desktop top navigation Header and mobile drawers.

### In Progress
*   TMDB-inspired visual page refinements (Home, Search, Grid feeds).
*   Reusable aspect-ratio media cards and horizontal carousel lane structures.

### Next Up
*   **Phase 3: Reusable Posters & Skeletons**

---

## 📝 Recent Checkpoint

*   **Commit:** `ebb7907`
*   **Message:** `feat: overhaul visual foundations and optimize auth performance`
*   **Description:** Implemented cinematic dark styling foundations, designed the global top Navbar navigation header, corrected bootstrap login layout shifts, and resolved interceptor loop delays.

---

**Author:** Eshal Ayub  
*Developed as part of a software engineering internship assignment utilizing Django REST Framework and React 19.*