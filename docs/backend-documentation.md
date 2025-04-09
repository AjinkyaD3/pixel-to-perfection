# Backend Documentation

## Overview

The PixelToPerfection backend is built with Node.js and Express, using MongoDB as the database through Mongoose ORM. It implements a RESTful API for a college event management system that handles users, students, events, committee members, announcements, and budgets.

## Table of Contents

- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users & Students](#users--students)
  - [Events](#events)
  - [Announcements](#announcements)
  - [Budgets](#budgets)
  - [Committee Members](#committee-members)
- [Models](#models)
  - [User](#user)
  - [Student](#student)
  - [Event](#event)
  - [Budget](#budget)
  - [Announcement](#announcement)
  - [Member](#member)
  - [QRCodeCheckIn](#qrcodecheckin)
  - [Registration](#registration)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [File Operations](#file-operations)
- [Security Measures](#security-measures)

## Project Structure

```
backend/
├── controllers/       # Request handlers and business logic
├── models/            # Database schemas and models
├── middleware/        # Custom middleware functions
├── routes/            # API route definitions
├── utils/             # Utility functions
├── validators/        # Request validation schemas
├── services/          # Business logic separated from controllers
├── logs/              # Application logs
├── .env               # Environment variables (not tracked in git)
├── .env.example       # Example environment variables
├── server.js          # Main application entry point
└── package.json       # Project dependencies and scripts
```

## Configuration

The application uses environment variables for configuration. These are defined in the `.env` file:

- `PORT`: The port the server runs on
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: Token expiration time
- `JWT_REFRESH_SECRET`: Secret for refresh tokens
- `JWT_REFRESH_EXPIRE`: Refresh token expiration
- `SMTP_*`: SMTP server settings for email
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `CLIENT_URL`: Frontend application URL

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| POST | `/api/auth/google` | Login with Google | Public |
| GET | `/api/auth/me` | Get current user's profile | Private |
| POST | `/api/auth/logout` | Logout user | Private |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password/:token` | Reset password | Public |
| PUT | `/api/auth/update-password` | Update password | Private |
| POST | `/api/auth/refresh-token` | Refresh JWT token | Public |
| GET | `/api/auth/verify-email/:token` | Verify email address | Public |

#### Request/Response Examples

**Signup Request**:
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "rollNumber": "IT2020001",
  "year": "TE",
  "division": "A",
  "skills": ["JavaScript", "React"]
}
```

**Login Request**:
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users & Students

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/students` | Get all students with pagination | Private/Admin |
| GET | `/api/students/:id` | Get a specific student | Private |
| POST | `/api/students` | Create a new student | Private/Admin |
| PUT | `/api/students/:id` | Update a student | Private/Admin |
| DELETE | `/api/students/:id` | Delete a student (soft delete) | Private/Admin |
| POST | `/api/students/upload` | Upload students via CSV | Private/Admin |

#### Query Parameters for GET /api/students
- `page`: Page number (default: 1)
- `limit`: Number of records per page (default: 10)
- `year`: Filter by year (FE, SE, TE, BE)
- `division`: Filter by division (A, B, C)
- `search`: Search by name, roll number, or email

#### Request/Response Examples

**Create Student Request**:
```json
POST /api/students
{
  "name": "Jane Smith",
  "rollNo": "IT2020002",
  "division": "B",
  "year": "SE",
  "email": "jane@example.com",
  "skills": ["Python", "Machine Learning"]
}
```

### Events

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/events` | Get all events with filters | Public |
| GET | `/api/events/:id` | Get a specific event | Public |
| POST | `/api/events` | Create a new event | Private/Committee+ |
| PUT | `/api/events/:id` | Update an event | Private/Committee+ |
| DELETE | `/api/events/:id` | Delete an event (soft delete) | Private/Committee+ |
| POST | `/api/events/:id/register` | Register for an event | Private |
| POST | `/api/events/:id/checkin` | Check in a student | Private/Committee+ |
| GET | `/api/events/:id/qrcode` | Generate QR code for event | Private/Committee+ |
| GET | `/api/events/analytics` | Get event analytics | Private/Committee+ |
| GET | `/api/events/export` | Export events to Excel | Private/Committee+ |

#### Query Parameters for GET /api/events
- `page`: Page number (default: 1)
- `limit`: Number of records per page (default: 10)
- `type`: Filter by event type (workshop, seminar, competition, etc.)
- `status`: Filter by status (upcoming, ongoing, completed, cancelled)
- `search`: Search by title, description, venue, or speaker name

#### Request/Response Examples

**Create Event Request**:
```json
POST /api/events
{
  "title": "Web Development Workshop",
  "type": "workshop",
  "description": "Learn the basics of web development",
  "date": "2023-06-15",
  "time": "10:00 AM - 2:00 PM",
  "venue": "Seminar Hall",
  "speaker": {
    "name": "John Smith",
    "designation": "Senior Developer",
    "organization": "Tech Company",
    "bio": "10+ years of experience"
  },
  "maxCapacity": 50,
  "budget": {
    "totalAmount": 5000
  }
}
```

### Announcements

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/announcements` | Get all announcements | Public |
| GET | `/api/announcements/:id` | Get a specific announcement | Public |
| POST | `/api/announcements` | Create a new announcement | Private/Committee+ |
| PUT | `/api/announcements/:id` | Update an announcement | Private/Committee+ |
| DELETE | `/api/announcements/:id` | Delete an announcement | Private/Committee+ |
| PUT | `/api/announcements/:id/pin` | Pin/unpin an announcement | Private/Admin |

#### Query Parameters for GET /api/announcements
- `page`: Page number (default: 1)
- `limit`: Number of records per page (default: 10)
- `type`: Filter by type (general, event, important, urgent)
- `targetAudience`: Filter by audience (all, committee, students, specific_year)
- `isPinned`: Filter by pinned status (true/false)
- `search`: Search by title or content

#### Request/Response Examples

**Create Announcement Request**:
```json
POST /api/announcements
{
  "title": "Important Notice",
  "content": "Classes will be suspended on Friday due to maintenance",
  "type": "important",
  "targetAudience": "all",
  "attachments": [
    {
      "name": "schedule.pdf",
      "url": "url-to-file",
      "type": "application/pdf"
    }
  ]
}
```

### Budgets

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/budgets` | Get all budgets | Private/Committee+ |
| GET | `/api/budgets/:id` | Get a specific budget | Private/Committee+ |
| POST | `/api/budgets` | Create a new budget | Private/Committee+ |
| PUT | `/api/budgets/:id` | Update a budget | Private/Committee+ |
| DELETE | `/api/budgets/:id` | Delete a budget | Private/Admin |
| POST | `/api/budgets/:id/expenses` | Add an expense | Private/Committee+ |
| PUT | `/api/budgets/:id/expenses/:expenseId` | Update an expense | Private/Committee+ |
| DELETE | `/api/budgets/:id/expenses/:expenseId` | Delete an expense | Private/Committee+ |
| PUT | `/api/budgets/:id/expenses/:expenseId/approve` | Approve an expense | Private/Admin |
| GET | `/api/budgets/analytics` | Get budget analytics | Private/Admin |
| GET | `/api/budgets/:id/export` | Export budget to PDF | Private/Committee+ |

#### Request/Response Examples

**Add Expense Request**:
```json
POST /api/budgets/:id/expenses
{
  "category": "food",
  "amount": 1200,
  "description": "Refreshments for workshop",
  "date": "2023-06-15",
  "receipt": "receipt-image-url"
}
```

### Committee Members

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/members` | Get all committee members | Public |
| GET | `/api/members/:id` | Get a specific member | Public |
| POST | `/api/members` | Create a new committee member | Private/Admin |
| PUT | `/api/members/:id` | Update a member | Private/Admin |
| DELETE | `/api/members/:id` | Delete a member (soft delete) | Private/Admin |
| POST | `/api/members/upload` | Upload members via CSV | Private/Admin |

#### Query Parameters for GET /api/members
- `page`: Page number (default: 1)
- `limit`: Number of records per page (default: 10)
- `role`: Filter by role (President, Vice President, etc.)
- `position`: Filter by position
- `search`: Search by name, email, or position

## Models

### User

```javascript
{
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'committee', 'student'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  verified: {
    type: Boolean,
    default: true
  },
  refreshToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationExpire: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  rollNumber: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  year: {
    type: String,
    enum: ['FE', 'SE', 'TE', 'BE'],
    required: function() {
      return this.role === 'student';
    }
  },
  division: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: function() {
      return this.role === 'student';
    }
  },
  skills: [String],
  profilePicture: String,
  googleId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Student

```javascript
{
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  division: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C']
  },
  year: {
    type: String,
    required: true,
    enum: ['FE', 'SE', 'TE', 'BE']
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  skills: [String],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Event

```javascript
{
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['workshop', 'seminar', 'competition', 'hackathon', 'other']
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  speaker: {
    name: String,
    designation: String,
    organization: String,
    bio: String
  },
  posterUrl: {
    type: String,
    default: 'default-poster.png'
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  qrCode: String,
  checkIns: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Budget

```javascript
{
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  spentAmount: {
    type: Number,
    default: 0
  },
  expenses: [{
    category: {
      type: String,
      required: true,
      enum: ['venue', 'food', 'transportation', 'materials', 'marketing', 'speaker', 'other']
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receipt: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Announcement

```javascript
{
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['general', 'event', 'important', 'urgent']
  },
  targetAudience: {
    type: String,
    required: true,
    enum: ['all', 'committee', 'students', 'specific_year']
  },
  year: {
    type: String,
    enum: ['FE', 'SE', 'TE', 'BE'],
    required: function() {
      return this.targetAudience === 'specific_year';
    }
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Member

```javascript
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Technical Head', 'Event Head', 'Publicity Head', 'Member']
  },
  position: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: String,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Authorization

### JWT Authentication
- Token-based authentication using JSON Web Tokens
- Access tokens valid for a short period (e.g., 1 hour)
- Refresh tokens for obtaining new access tokens
- Tokens are sent via Authorization header: `Bearer <token>`

### Authorization Middleware
Roles are enforced using middleware:

```javascript
// Protect routes - requires authentication
exports.protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Verify token
    // Attach user to request object
  } catch (error) {
    // Handle errors
  }
};

// Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }
    next();
  };
};
```

### Usage in Routes
```javascript
// Example route with authentication and authorization
router.post('/events', 
  protect, 
  authorize('admin', 'committee'), 
  createEvent
);
```

## Error Handling

The application uses a centralized error handling middleware:

```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err.stack);

  // Handle various error types (Mongoose validation errors, duplicate keys, etc.)

  // Send response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack trace (development only)"
}
```

## Validation

Request validation is performed using express-validator:

```javascript
// Example validation for creating an event
exports.validateCreateEvent = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn(['workshop', 'seminar', 'competition', 'hackathon', 'other'])
    .withMessage('Invalid event type'),
  body('date').isDate().withMessage('Valid date is required'),
  body('maxCapacity').isNumeric().withMessage('Max capacity must be a number'),
  // More validations...
];
```

Controllers also perform additional validation to ensure all required fields are present and valid before database operations.

## File Operations

### File Uploads
- Uses multer for handling multipart/form-data
- Supports uploads for event posters, expense receipts, student photos, etc.
- Files are validated for type and size

### Export Operations
- Event lists can be exported to Excel using ExcelJS
- Budgets can be exported to PDF using PDFKit
- CSV imports are supported for batch student and member creation

## Security Measures

1. **Password Hashing**: bcrypt for password hashing
2. **Input Sanitization**: express-validator to prevent injection attacks
3. **Rate Limiting**: express-rate-limit to prevent brute force attacks
4. **CORS**: Configured to restrict origins
5. **Helmet**: HTTP headers for security
6. **JWT Security**: Short-lived tokens, refresh token rotation
7. **Data Validation**: Both client and server-side validation 