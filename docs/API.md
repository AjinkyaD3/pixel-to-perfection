# ACES Platform API Documentation

## Base URL
```
https://api.aces-platform.com/v1
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