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

---

# Authentication

All protected endpoints require a JWT Bearer Token.

Example Header

```
Authorization: Bearer <your_access_token>
```

---

# Future Improvements

- React Frontend
- Search Reviews
- Pagination
- Categories & Tags
- Image Uploads
- Deployment
- PostgreSQL Support

---

# Author
Eshal Ayub

Developed as part of an internship assignment using Django REST Framework.
