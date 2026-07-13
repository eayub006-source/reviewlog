# ReviewLog

A Django REST Framework application for managing and reviewing books and movies. The project is being developed as part of a backend development internship to learn Django, REST APIs, database design, API testing, and full-stack integration.

---

## Project Overview

ReviewLog allows users to create, manage, update, retrieve, and delete reviews for books and movies through RESTful APIs.

The project demonstrates the complete backend development workflow using Django REST Framework.

---

## Features

### Week 1
- Django project setup
- Python virtual environment
- SQLite database integration
- Review model creation
- Django Admin configuration
- Database migrations
- Git & GitHub setup

### Week 2
- Django REST Framework integration
- ModelSerializer implementation
- ViewSets
- URL routing
- Complete CRUD API
- API testing using Django REST Framework
- API testing using Postman

---

## Tech Stack

- Python 3
- Django
- Django REST Framework
- SQLite
- Git
- GitHub
- Postman

---

## Database Model

Review

| Field | Type |
|--------|------|
| id | Integer |
| title | CharField |
| type | Book / Movie |
| rating | Integer |
| review | TextField |
| date | DateField |

---

## API Endpoints

### Retrieve all reviews

GET

```
/api/reviews/
```

---

### Retrieve a single review

GET

```
/api/reviews/<id>/
```

---

### Create a review

POST

```
/api/reviews/
```

Example

```json
{
    "title": "Interstellar",
    "type": "movie",
    "rating": 5,
    "review": "Amazing science fiction movie."
}
```

---

### Update a review

PUT

```
/api/reviews/<id>/
```

---

### Delete a review

DELETE

```
/api/reviews/<id>/
```

---

## Project Structure

```
reviewlog/
│
├── reviewlog_backend/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── reviews/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│
├── manage.py
├── requirements.txt
└── db.sqlite3
```

---

## Learning Outcomes

Through this project I learned:

- Django project architecture
- Database modeling using ORM
- SQLite integration
- Database migrations
- Django Admin
- REST API development
- Serializers
- ViewSets
- URL routing
- CRUD operations
- API testing using Postman
- Version control using Git and GitHub

---

## Future Development

- User Authentication
- JWT Authentication
- Permissions
- Search & Filtering
- Pagination
- React Frontend Integration
- Deployment

---

## Author

**Eshal Ayub**

Backend Development Internship Project
