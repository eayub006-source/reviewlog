# ReviewLog Backend

A Django REST Framework backend for **ReviewLog**, a review management application that allows users to create, manage, and share reviews securely using JWT authentication.

---

##  Features

### Authentication
- User Registration
- JWT Login Authentication
- JWT Token Refresh
- Protected API Endpoints

### User Management
- View Profile
- Update Profile

### Reviews
- Create Reviews
- Read Reviews
- Update Reviews
- Delete Reviews
- Reviews linked to authenticated users
- Users can only modify their own reviews
- Review internal entries, Open Library books, and TMDB movies through one shared review model

### External Catalogs
- Authenticated book search through Open Library
- Authenticated movie search through a server-side TMDB proxy (`TMDB_API_KEY` never reaches the frontend)
- Paged search, debouncing, cancellation, cached provider results, empty/loading states, and search history
- Favorites and recently viewed books/movies per user

### Public Reviews
- Public/Private review visibility
- Public reviews endpoint for everyone

### Validation
- Rating validation (1–5)
- Serializer validation
- Model validation

### Security
- JWT Authentication
- Object-level permissions
- User ownership enforcement

### Backend Improvements
- Modular project structure
- Separate Views
- Separate Serializers
- Custom Permissions
- CORS configured for frontend integration

---

#  Tech Stack

- Python 3.x
- Django
- Django REST Framework
- Simple JWT
- SQLite (Development)
- django-cors-headers

---

#  Project Structure

```
reviews/
│
├── migrations/
├── serializers/
│   ├── auth_serializer.py
│   └── review_serializer.py
│
├── views/
│   ├── auth_views.py
│   └── review_views.py
│
├── permissions.py
├── models.py
├── urls.py
└── admin.py
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register/` | Register User |
| POST | `/api/token/` | Login |
| POST | `/api/token/refresh/` | Refresh JWT Token |

---

## Profile

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/profile/` | Get Current User |
| PATCH | `/api/profile/` | Update Profile |

---

## Reviews

| Method | Endpoint |
|---------|----------|
| GET | `/api/` |
| POST | `/api/` |
| GET | `/api/<id>/` |
| PUT | `/api/<id>/` |
| PATCH | `/api/<id>/` |
| DELETE | `/api/<id>/` |

---

## Public Reviews

| Method | Endpoint |
|---------|----------|
| GET | `/api/public-reviews/` |

## External catalog endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/catalog/books/?q=<query>&page=1` | Search Open Library books |
| GET | `/api/catalog/movies/?q=<query>&page=1` | Search TMDB movies |
| GET/POST | `/api/favorites/` | List or save favorites |
| DELETE | `/api/favorites/<id>/` | Remove a favorite |
| GET/POST | `/api/recent-items/` | List or record recently viewed items |
| GET | `/api/dashboard/stats/` | Review and favorite dashboard totals |

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Create virtual environment

```bash
python -m venv .venv
```

Activate virtual environment

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Apply migrations

```bash
python manage.py migrate
```

Run the server

```bash
python manage.py runserver
```

For movie search, set `TMDB_API_KEY` in the backend environment (for example, your Render environment variables). Do not use `VITE_TMDB_API_KEY`.

---

# Authentication

All protected endpoints require a JWT Bearer Token.

Example Header

```
Authorization: Bearer <your_access_token>
```

---

# Frontend

The React frontend lives in `frontend/`. See [frontend/README.md](frontend/README.md) for setup, routes, and architecture.

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173/` and connects to the deployed API at `https://reviewlog.onrender.com/api/`.

---

# Future Improvements

- Backend search, filter, and pagination
- Categories & Tags
- Image Uploads
- Frontend deployment
- PostgreSQL Support
- API documentation (Swagger/OpenAPI)

---

# Author
Eshal Ayub

Developed as part of an internship assignment using Django REST Framework.
