# Django Vue Authentication Backend

This project implements a Django-based authentication backend and blog API for a Vue.js frontend application.

## API Endpoints

### Authentication

- **Register a new user**

  - URL: `/api/auth/register/`
  - Method: `POST`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "username": "username",
      "password": "password123"
    }
    ```
  - Response: User data with token

- **Login**

  - URL: `/api/auth/login/`
  - Method: `POST`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response: Authentication token with user data

- **Logout**

  - URL: `/api/auth/logout/`
  - Method: `POST`
  - Headers: `Authorization: Token <token>`
  - Response: 204 No Content

- **Get User Profile**
  - URL: `/api/auth/profile/`
  - Method: `GET`
  - Headers: `Authorization: Token <token>`
  - Response: User data

### Blog API

- **Categories**

  - List Categories: `GET /api/blog/categories/`
  - Create Category (staff only): `POST /api/blog/categories/`
  - Get Category Detail: `GET /api/blog/categories/{slug}/`
  - Update Category (staff only): `PUT/PATCH /api/blog/categories/{slug}/`
  - Delete Category (staff only): `DELETE /api/blog/categories/{slug}/`

- **Posts**

  - List Posts: `GET /api/blog/posts/`
  - Create Post (authenticated users): `POST /api/blog/posts/`
  - Get Post Detail: `GET /api/blog/posts/{id}/`
  - Update Post (author or staff): `PUT/PATCH /api/blog/posts/{id}/`
  - Delete Post (author or staff): `DELETE /api/blog/posts/{id}/`

- **Comments**
  - List Comments: `GET /api/blog/comments/`
  - Create Comment (authenticated users): `POST /api/blog/comments/`
  - Get Comment Detail: `GET /api/blog/comments/{id}/`
  - Update Comment (author or staff): `PUT/PATCH /api/blog/comments/{id}/`
  - Delete Comment (author or staff): `DELETE /api/blog/comments/{id}/`

## Test with Curl

### Authentication

#### Register a User

```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "username": "testuser", "password": "testpass123"}' http://localhost:8000/api/auth/register/
```

#### Login

```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "testpass123"}' http://localhost:8000/api/auth/login/
```

#### Logout (replace TOKEN with your token)

```bash
curl -X POST -H "Authorization: Token TOKEN" http://localhost:8000/api/auth/logout/
```

#### Get Profile

```bash
curl -H "Authorization: Token TOKEN" http://localhost:8000/api/auth/profile/
```

### Blog API

#### Create a Category (staff only)

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Token TOKEN" -d '{"name": "Technology", "slug": "technology"}' http://localhost:8000/api/blog/categories/
```

#### List Categories

```bash
curl http://localhost:8000/api/blog/categories/
```

#### Create a Post

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Token TOKEN" -d '{"title": "My First Post", "slug": "my-first-post", "content": "This is the content of my first post.", "status": "published", "category_ids": [1]}' http://localhost:8000/api/blog/posts/
```

#### List Posts

```bash
curl http://localhost:8000/api/blog/posts/
```

#### Add a Comment

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Token TOKEN" -d '{"post": 1, "content": "Great post!"}' http://localhost:8000/api/blog/comments/
```

## Setup Instructions

1. Install dependencies:

   ```bash
   pip install django djangorestframework django-cors-headers whitenoise django-filter
   ```

2. Run migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

4. Run the development server:
   ```bash
   python manage.py runserver
   ```
