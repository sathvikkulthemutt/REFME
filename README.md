# RefMe - Link Management App

RefMe is a web application for saving and managing links. The application includes user authentication, link management, and a modern UI design.

## Project Structure

- `backend/` - Flask backend with MongoDB
- `frontend/` - React frontend

## Backend Setup

1. Make sure MongoDB is installed and running on your system.
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the Flask application:
   ```
   python refme_app.py
   ```
   The backend will run on http://localhost:5001

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend/refme-app
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the React development server:
   ```
   npm start
   ```
   The frontend will run on http://localhost:3000

## Features

- User Registration and Authentication with JWT
- Save and organize links with categories
- Modern, responsive UI with animated elements
- Secure password handling
- Real-time notifications

## Technologies Used

### Backend
- Flask - Python web framework
- MongoDB - Database
- Flask-JWT-Extended - Authentication
- Flask-CORS - Cross-Origin Resource Sharing

### Frontend
- React - UI library
- React Router - Navigation
- Axios - HTTP client
- CSS3 with custom animations and effects 