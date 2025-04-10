# Pixel To Perfection

A full-stack web application with React frontend and Node.js backend.

## Project Structure

- `frontend/` - React frontend application with Vite, TypeScript, and Tailwind CSS
- `backend/` - Node.js backend API with Express and MongoDB

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## Getting Started

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd PixelToPerfection
   ```

2. Install dependencies for both frontend and backend
   ```
   npm run install:all
   ```

3. Environment Setup

   You can automatically set up the environment files by running:
   ```
   npm run setup
   ```

   This will copy the example environment files to their proper locations. You'll still need to update the variables with your specific configuration.

   #### Backend
   - Edit `.env` in the backend directory with your specific values
   - Update MongoDB connection string, JWT secret, etc.

   #### Frontend
   - Edit `.env` in the frontend directory if needed
   - By default, it will connect to the backend at http://localhost:5001/api

### Development

To run both frontend and backend simultaneously:
```
npm run dev
```

To run just the frontend:
```
npm run frontend
```

To run just the backend:
```
npm run backend
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a single student

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a single event
- `POST /api/events/:id/register` - Register for an event

### Announcements
- `GET /api/announcements` - Get all announcements

### Budget
- `GET /api/budgets` - Get all budget entries
- `POST /api/budgets` - Create a new budget entry

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get a single member

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- Axios
- Framer Motion
- React Query

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io

## License

MIT 