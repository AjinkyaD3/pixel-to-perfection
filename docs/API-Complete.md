# ACES Platform API Documentation

## Base URL
```
https://api.aces-platform.com
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting
- Public routes: 100 requests per 15 minutes
- Authentication routes: 5 requests per minute
- Protected routes: 1000 requests per 15 minutes

## Error Responses
All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## API Endpoints

### Authentication

#### Sign Up
```http
POST /auth/signup
```
Request body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string" // admin, committee, student
}
```
Response:
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Login
```http
POST /auth/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Logout
```http
POST /auth/logout
```
Response:
```json
{
  "success": true,
  "data": {}
}
```

#### Google Login
```http
POST /auth/google
```
Request body:
```json
{
  "tokenId": "string"
}
```
Response:
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Get Current User
```http
GET /auth/me
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Forgot Password
```http
POST /auth/forgot-password
```
Request body:
```json
{
  "email": "string"
}
```
Response:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Reset Password
```http
POST /auth/reset-password/:token
```
Request body:
```json
{
  "password": "string",
  "confirmPassword": "string"
}
```
Response:
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Verify Email
```http
GET /auth/verify-email/:token
```
Response:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Refresh Token
```http
POST /auth/refresh-token
```
Request body:
```json
{
  "refreshToken": "string"
}
```
Response:
```json
{
  "success": true,
  "token": "string"
}
```

#### Update Password
```http
PUT /auth/update-password
```
Request body:
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```
Response:
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Events

#### Get All Events
```http
GET /events
```
Query parameters:
- `type`: string (optional)
- `status`: string (optional)
- `search`: string (optional)
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

Response:
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "data": [
    {
      "id": "string",
      "title": "string",
      "type": "string",
      "description": "string",
      "date": "string",
      "time": "string",
      "venue": "string",
      "maxCapacity": 0,
      "registeredStudents": [],
      "status": "string",
      "createdBy": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
}
```

#### Get Single Event
```http
GET /events/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "type": "string",
    "description": "string",
    "date": "string",
    "time": "string",
    "venue": "string",
    "maxCapacity": 0,
    "registeredStudents": [],
    "status": "string",
    "createdBy": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "budget": {
      "id": "string",
      "totalAmount": 0,
      "spentAmount": 0
    }
  }
}
```

#### Create Event
```http
POST /events
```
Request body:
```json
{
  "title": "string",
  "type": "string",
  "description": "string",
  "date": "string",
  "time": "string",
  "venue": "string",
  "maxCapacity": 0,
  "speaker": {
    "name": "string",
    "designation": "string",
    "organization": "string",
    "bio": "string"
  }
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "type": "string",
    "description": "string",
    "date": "string",
    "time": "string",
    "venue": "string",
    "maxCapacity": 0,
    "status": "upcoming",
    "createdBy": "string"
  }
}
```

#### Update Event
```http
PUT /events/:id
```
Request body:
```json
{
  "title": "string",
  "type": "string",
  "description": "string",
  "date": "string",
  "time": "string",
  "venue": "string",
  "maxCapacity": 0,
  "speaker": {
    "name": "string",
    "designation": "string",
    "organization": "string",
    "bio": "string"
  }
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "type": "string",
    "description": "string",
    "date": "string",
    "time": "string",
    "venue": "string",
    "maxCapacity": 0,
    "status": "string",
    "createdBy": "string"
  }
}
```

#### Delete Event
```http
DELETE /events/:id
```
Response:
```json
{
  "success": true,
  "data": {}
}
```

#### Register for Event
```http
POST /events/:id/register
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "registeredStudents": ["string"]
  }
}
```

#### Check In to Event
```http
POST /events/:id/checkin
```
Request body:
```json
{
  "studentId": "string"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "checkIns": [
      {
        "student": "string",
        "timestamp": "string"
      }
    ]
  }
}
```

#### Generate QR Code for Event
```http
GET /events/:id/qrcode
```
Response:
```json
{
  "success": true,
  "data": "data:image/png;base64,..."
}
```

#### Get Event Analytics
```http
GET /events/analytics
```
Query parameters:
- `startDate`: string (optional, YYYY-MM-DD)
- `endDate`: string (optional, YYYY-MM-DD)

Response:
```json
{
  "success": true,
  "data": {
    "totalEvents": 0,
    "totalRegistrations": 0,
    "totalCheckIns": 0,
    "eventsByType": {
      "workshop": 0,
      "seminar": 0,
      "competition": 0,
      "hackathon": 0
    },
    "attendanceRate": 0
  }
}
```

#### Export Events to Excel
```http
GET /events/export
```
Response: Binary file (Excel spreadsheet)

### Students

#### Get All Students
```http
GET /students
```
Query parameters:
- `year`: string (optional)
- `division`: string (optional)
- `search`: string (optional)
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

Response:
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "id": "string",
      "name": "string",
      "rollNo": "string",
      "email": "string",
      "year": "string",
      "division": "string",
      "skills": ["string"],
      "events": ["string"]
    }
  ]
}
```

#### Get Single Student
```http
GET /students/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "rollNo": "string",
    "email": "string",
    "year": "string",
    "division": "string",
    "skills": ["string"],
    "events": ["string"]
  }
}
```

#### Create Student
```http
POST /students
```
Request body:
```json
{
  "name": "string",
  "rollNo": "string",
  "email": "string",
  "year": "string",
  "division": "string",
  "skills": ["string"]
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "rollNo": "string",
    "email": "string",
    "year": "string",
    "division": "string",
    "skills": ["string"]
  }
}
```

#### Update Student
```http
PUT /students/:id
```
Request body:
```json
{
  "name": "string",
  "rollNo": "string",
  "email": "string",
  "year": "string",
  "division": "string",
  "skills": ["string"]
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "rollNo": "string",
    "email": "string",
    "year": "string",
    "division": "string",
    "skills": ["string"]
  }
}
```

#### Delete Student
```http
DELETE /students/:id
```
Response:
```json
{
  "success": true,
  "data": {}
}
```

#### Upload Students via CSV
```http
POST /students/upload
```
Request body:
```
multipart/form-data
file: [CSV file]
```
Response:
```json
{
  "success": true,
  "data": {
    "totalProcessed": 0,
    "successCount": 0,
    "errorCount": 0,
    "errors": []
  }
}
```

#### Get Student Analytics
```http
GET /students/analytics
```
Response:
```json
{
  "success": true,
  "data": {
    "totalStudents": 0,
    "studentsByYear": {
      "FE": 0,
      "SE": 0,
      "TE": 0,
      "BE": 0
    },
    "studentsByDivision": {
      "A": 0,
      "B": 0,
      "C": 0
    },
    "participationRate": 0
  }
}
```

#### Export Students to Excel
```http
GET /students/export
```
Response: Binary file (Excel spreadsheet)

### Budgets

#### Get All Budgets
```http
GET /budgets
```
Query parameters:
- `eventId`: string (optional)
- `status`: string (optional)
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

Response:
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "data": [
    {
      "id": "string",
      "eventId": "string",
      "totalAmount": 0,
      "spentAmount": 0,
      "expenses": [
        {
          "id": "string",
          "category": "string",
          "amount": 0,
          "description": "string",
          "date": "string",
          "status": "string"
        }
      ]
    }
  ]
}
```

#### Get Single Budget
```http
GET /budgets/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "eventId": "string",
    "totalAmount": 0,
    "spentAmount": 0,
    "expenses": [
      {
        "id": "string",
        "category": "string",
        "amount": 0,
        "description": "string",
        "date": "string",
        "paidBy": "string",
        "receipt": "string",
        "status": "string",
        "notes": "string"
      }
    ]
  }
}
```

#### Create Budget
```http
POST /budgets
```
Request body:
```json
{
  "eventId": "string",
  "totalAmount": 0,
  "expenses": [
    {
      "category": "string",
      "amount": 0,
      "description": "string",
      "date": "string",
      "receipt": "string"
    }
  ]
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "eventId": "string",
    "totalAmount": 0,
    "spentAmount": 0,
    "expenses": []
  }
}
```

#### Update Budget
```http
PUT /budgets/:id
```
Request body:
```json
{
  "totalAmount": 0
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "eventId": "string",
    "totalAmount": 0,
    "spentAmount": 0,
    "expenses": []
  }
}
```

#### Delete Budget
```http
DELETE /budgets/:id
```
Response:
```json
{
  "success": true,
  "data": {}
}
```

#### Add Expense
```http
POST /budgets/:id/expenses
```
Request body:
```json
{
  "category": "string",
  "amount": 0,
  "description": "string",
  "date": "string",
  "receipt": "string"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "expenses": [
      {
        "id": "string",
        "category": "string",
        "amount": 0,
        "description": "string",
        "date": "string",
        "receipt": "string",
        "status": "pending"
      }
    ]
  }
}
```

#### Update Expense
```http
PUT /budgets/:id/expenses/:expenseId
```
Request body:
```json
{
  "category": "string",
  "amount": 0,
  "description": "string",
  "date": "string",
  "receipt": "string"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "expenses": [
      {
        "id": "string",
        "category": "string",
        "amount": 0,
        "description": "string",
        "date": "string",
        "receipt": "string",
        "status": "string"
      }
    ]
  }
}
```

#### Delete Expense
```http
DELETE /budgets/:id/expenses/:expenseId
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "expenses": []
  }
}
```

#### Approve Expense
```http
PUT /budgets/:id/expenses/:expenseId/approve
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "expenses": [
      {
        "id": "string",
        "category": "string",
        "amount": 0,
        "description": "string",
        "date": "string",
        "receipt": "string",
        "status": "approved"
      }
    ]
  }
}
```

#### Get Budget Analytics
```http
GET /budgets/analytics
```
Query parameters:
- `startDate`: string (optional, YYYY-MM-DD)
- `endDate`: string (optional, YYYY-MM-DD)

Response:
```json
{
  "success": true,
  "data": {
    "totalBudgets": 0,
    "totalAllocated": 0,
    "totalSpent": 0,
    "expensesByCategory": {
      "venue": 0,
      "food": 0,
      "prizes": 0,
      "marketing": 0,
      "other": 0
    },
    "utilization": 0
  }
}
```

#### Export Budget
```http
GET /budgets/:id/export
```
Response: Binary file (PDF document)

### Announcements

#### Get All Announcements
```http
GET /announcements
```
Query parameters:
- `type`: string (optional)
- `targetAudience`: string (optional)
- `pinned`: boolean (optional)
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

Response:
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "type": "string",
      "targetAudience": "string",
      "pinned": boolean,
      "createdBy": {
        "id": "string",
        "name": "string"
      },
      "createdAt": "string"
    }
  ]
}
```

#### Get Single Announcement
```http
GET /announcements/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "type": "string",
    "targetAudience": "string",
    "pinned": boolean,
    "createdBy": {
      "id": "string",
      "name": "string"
    },
    "createdAt": "string"
  }
}
```

#### Create Announcement
```http
POST /announcements
```
Request body:
```json
{
  "title": "string",
  "content": "string",
  "type": "string",
  "targetAudience": "string"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "type": "string",
    "targetAudience": "string",
    "pinned": false,
    "createdBy": "string",
    "createdAt": "string"
  }
}
```

#### Update Announcement
```http
PUT /announcements/:id
```
Request body:
```json
{
  "title": "string",
  "content": "string",
  "type": "string",
  "targetAudience": "string"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "type": "string",
    "targetAudience": "string",
    "pinned": boolean,
    "createdBy": "string",
    "createdAt": "string"
  }
}
```

#### Delete Announcement
```http
DELETE /announcements/:id
```
Response:
```json
{
  "success": true,
  "data": {}
}
```

#### Pin/Unpin Announcement
```http
PUT /announcements/:id/pin
```
Response:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "pinned": boolean
  }
}
```

#### Get Announcement Analytics
```http
GET /announcements/analytics
```
Response:
```json
{
  "success": true,
  "data": {
    "totalAnnouncements": 0,
    "announcementsByType": {
      "general": 0,
      "event": 0,
      "urgent": 0,
      "other": 0
    },
    "announcementsByTarget": {
      "all": 0,
      "students": 0,
      "committee": 0,
      "admin": 0
    },
    "pinnedAnnouncements": 0
  }
}
```

## WebSocket Events

### Real-time Announcements
```javascript
// Subscribe to announcements
socket.on('announcement', (data) => {
  console.log('New announcement:', data);
});

// Subscribe to event updates
socket.on('eventUpdate', (data) => {
  console.log('Event updated:', data);
});
```

## Response Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error 