# Django-Vue Blog Application

A full-stack blog application with a Django REST API backend and Vue.js frontend. Features include user authentication, blog post management, and comments.

## Features

- User authentication (register, login, logout)
- Blog post creation, editing, and deletion
- Custom user model with enhanced profile details
- Token-based authentication
- Responsive design using Tailwind CSS

## Project Structure

- `django_api/` - Django project settings
- `authentication/` - Custom user model and authentication endpoints
- `blog_configuration/` - Blog models and API endpoints
- `frontend/` - Vue.js application

## Setup Instructions

### Backend (Django)

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/django-vue.git
   cd django-vue
   ```

2. Create and activate a virtual environment:

   ```bash
   # For Windows
   python -m venv venv
   venv\Scripts\activate

   # For macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser (admin account):

   ```bash
   python manage.py createsuperuser
   ```

6. Run the Django development server:

   ```bash
   python manage.py runserver
   ```

   The backend API will be available at `http://localhost:8000/`

### Frontend (Vue.js)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Run the Vue.js development server:

   ```bash
   npm run dev
   ```

   The frontend application will be available at `http://localhost:5173/`

## Using the Application

1. Open your browser and navigate to `http://localhost:5173/`
2. Register a new account or log in with existing credentials
3. Create, view, edit, and delete blog posts
4. Log out when finished

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register/`

  ```json
  {
    "username": "username",
    "email": "user@example.com",
    "password": "password123",
    "password2": "password123",
    "first_name": "First",
    "last_name": "Last"
  }
  ```

- **Login**: `POST /api/auth/login/`

  ```json
  {
    "username": "username",
    "password": "password123"
  }
  ```

  Note: You can use either username or email for the username field.

- **Logout**: `POST /api/auth/logout/` (requires authentication)

- **User Profile**: `GET /api/auth/profile/` (requires authentication)

### Blog

- **List Posts**: `GET /api/blog/posts/`
- **Create Post**: `POST /api/blog/posts/` (requires authentication)
- **View Post**: `GET /api/blog/posts/{id}/`
- **Update Post**: `PUT/PATCH /api/blog/posts/{id}/` (author or admin only)
- **Delete Post**: `DELETE /api/blog/posts/{id}/` (author or admin only)

## Admin Interface

Access the Django admin interface at `http://localhost:8000/admin/` using your superuser credentials.

## Deployment

### Backend Deployment to Render

1. Push your code to a GitHub repository.

2. Log into [Render](https://render.com) and create a new Web Service.

3. Connect your GitHub repository.

4. Configure your new Web Service with the following settings:

   - **Name**: Choose a name for your service
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command**: `gunicorn django_api.wsgi`

5. Add the following environment variables:
   - `SECRET_KEY`: Generate a secure random key
   - `DEBUG`: Set to False for production
   - `ALLOWED_HOSTS`: Include your Render domain, e.g., `your-app.onrender.com`
   - `CORS_ALLOWED_ORIGINS`: URL of your frontend application
   - `DATABASE_URL`: Automatically set by Render if you create a PostgreSQL database
6. Create a PostgreSQL database in Render and link it to your web service.

### Frontend Deployment to Render

1. In your frontend directory, create a `vite.config.js` file that includes proper configuration for production:

   ```js
   export default {
     build: {
       outDir: "dist",
     },
     // Set the API URL to your deployed backend
     define: {
       "process.env.VITE_API_URL": JSON.stringify(
         "https://your-backend.onrender.com"
       ),
     },
   };
   ```

2. Create a new Static Site on Render.

3. Connect your GitHub repository.

4. Configure with the following settings:

   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

5. Under Environment settings, add any required environment variables.

## Development Notes

- The frontend uses Axios for API requests
- Authentication is managed using tokens
- Tailwind CSS is used for styling
- Pinia is used for state management

## Troubleshooting

- If you encounter CORS issues, ensure the Django CORS settings are properly configured
- For authentication issues, check that tokens are being properly stored and included in requests
- If the frontend cannot connect to the backend, ensure both servers are running and the API URLs are correct
