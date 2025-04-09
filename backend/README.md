# Pixel To Perfection - Backend

This is the backend API for the Pixel To Perfection platform, built using Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local installation or Atlas connection)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up the environment variables by creating a `.env` file based on the `.env.example` file.

## Running the Server

To start the development server:

```
npm run dev
```

To start the production server:

```
npm start
```

## Tests

Basic tests can be run with:

```
npm test
```

The test suite uses Jest and supertest for API testing.

### Test Requirements

For running tests, you'll need one of the following:
- A running local MongoDB instance (on port 27017)
- MongoDB Atlas connection with whitelisted IP
- MongoDB Memory Server for testing (installed via `npm install mongodb-memory-server --save-dev`)

### Simple Tests

To run the simple sanity tests:

```
npx jest tests/simple.test.js
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Database Models

- User: Authentication and user management
- Student: Student profile and information
- Event: Event management
- Budget: Budget tracking for events
- Announcement: Platform announcements 