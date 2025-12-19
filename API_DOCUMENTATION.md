# BookCircle API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

---

## Club Endpoints

### Create Club
```http
POST /clubs
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sci-Fi Book Club",
  "description": "We love science fiction!",
  "isPrivate": false,
  "maxMembers": 20,
  "tags": ["sci-fi", "fiction"],
  "readingGoal": {
    "pagesPerWeek": 50,
    "meetingFrequency": "weekly"
  }
}
```

### Get All Clubs (Public)
```http
GET /clubs?page=1&limit=10&search=sci-fi&tags=fiction
Authorization: Bearer <token>
```

### Get User's Clubs
```http
GET /clubs/my-clubs
Authorization: Bearer <token>
```

### Get Club by ID
```http
GET /clubs/:clubId
Authorization: Bearer <token>
```

### Update Club (Admin Only)
```http
PUT /clubs/:clubId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Club Name",
  "description": "Updated description"
}
```

### Join Club
```http
POST /clubs/:clubId/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "inviteCode": "ABC123" // Only required for private clubs
}
```

### Leave Club
```http
POST /clubs/:clubId/leave
Authorization: Bearer <token>
```

### Set Current Book (Admin Only)
```http
PUT /clubs/:clubId/current-book
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "64f8a1b2c3d4e5f6a7b8c9d0"
}
```

---

## Book Endpoints

### Add Book
```http
POST /books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Dune",
  "author": "Frank Herbert",
  "description": "A classic science fiction novel",
  "coverImage": "https://example.com/dune.jpg",
  "isbn": "9780441013593",
  "totalPages": 688,
  "genre": ["science-fiction", "classic"],
  "publishedYear": 1965
}
```

### Get All Books
```http
GET /books?page=1&limit=20&search=dune&author=frank&genre=science-fiction&minRating=4
Authorization: Bearer <token>
```

### Get Book by ID
```http
GET /books/:bookId
Authorization: Bearer <token>
```

### Rate Book
```http
POST /books/:bookId/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}
```

---

## Voting Endpoints

### Create Vote
```http
POST /votes
Authorization: Bearer <token>
Content-Type: application/json

{
  "clubId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Next Book Selection",
  "description": "Choose our next book to read",
  "votingOptions": [
    { "book": "64f8a1b2c3d4e5f6a7b8c9d1" },
    { "book": "64f8a1b2c3d4e5f6a7b8c9d2" }
  ],
  "endDate": "2024-02-01T00:00:00.000Z",
  "votingType": "single",
  "maxVotesPerUser": 1,
  "isAnonymous": false
}
```

### Get Votes
```http
GET /votes?clubId=64f8a1b2c3d4e5f6a7b8c9d0&status=active
Authorization: Bearer <token>
```

### Cast Vote
```http
POST /votes/:voteId/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "preference": 1
}
```

### Get Vote Results
```http
GET /votes/:voteId/results
Authorization: Bearer <token>
```

---

## Reading Progress Endpoints

### Create Reading Progress
```http
POST /reading-progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "clubId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "bookId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "totalPages": 688
}
```

### Get Reading Progress
```http
GET /reading-progress?clubId=64f8a1b2c3d4e5f6a7b8c9d0&bookId=64f8a1b2c3d4e5f6a7b8c9d1
Authorization: Bearer <token>
```

### Update Progress
```http
PUT /reading-progress/:progressId/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "pagesRead": 25,
  "sessionDuration": 45
}
```

### Add Note
```http
POST /reading-progress/:progressId/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "page": 150,
  "content": "Interesting plot development here..."
}
```

### Add Highlight
```http
POST /reading-progress/:progressId/highlights
Authorization: Bearer <token>
Content-Type: application/json

{
  "page": 200,
  "text": "Fear is the mind-killer."
}
```

---

## Meeting Endpoints

### Create Meeting
```http
POST /meetings
Authorization: Bearer <token>
Content-Type: application/json

{
  "clubId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Dune Discussion - Chapters 1-5",
  "description": "Discuss the first five chapters",
  "bookId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "scheduledDate": "2024-01-15T19:00:00.000Z",
  "duration": 90,
  "meetingType": "virtual",
  "virtualMeetingLink": "https://zoom.us/j/123456789",
  "readingProgress": {
    "startPage": 1,
    "endPage": 100
  }
}
```

### Get Meetings
```http
GET /meetings?clubId=64f8a1b2c3d4e5f6a7b8c9d0&status=scheduled
Authorization: Bearer <token>
```

### RSVP to Meeting
```http
POST /meetings/:meetingId/rsvp
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "attending" // "attending", "maybe", "not_attending"
}
```

---
## Quote Endpoints

### Create Quote
```http
POST /quotes
Authorization: Bearer <token>
Content-Type: application/json

{
  "clubId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "bookId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "content": "I must not fear. Fear is the mind-killer.",
  "pageNumber": 7,
  "chapter": "Book 1",
  "tags": ["motivation", "classic"],
  "isPublic": true,
  "color": "#ffffff"
}
```

### Get Quotes
```http
GET /quotes?clubId=64f8a1b2c3d4e5f6a7b8c9d0&tags=motivation&page=1&limit=20
Authorization: Bearer <token>
```

### Like Quote
```http
POST /quotes/:quoteId/like
Authorization: Bearer <token>
```

### Add Comment
```http
POST /quotes/:quoteId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is my favorite quote from the book!"
}
```

---

## Data Models

### User Model
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "profilePicture": "string",
  "bio": "string",
  "favoriteGenres": ["string"],
  "readingGoals": {
    "booksPerYear": "number",
    "pagesPerWeek": "number"
  },
  "socialLinks": {
    "goodreads": "string",
    "twitter": "string",
    "instagram": "string"
  },
  "isPublic": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Club Model
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "admin": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "members": [
    {
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "joinedAt": "date",
      "role": "member|moderator"
    }
  ],
  "currentBook": {
    "id": "string",
    "title": "string",
    "author": "string",
    "coverImage": "string"
  },
  "isPrivate": "boolean",
  "inviteCode": "string",
  "maxMembers": "number",
  "tags": ["string"],
  "readingGoal": {
    "pagesPerWeek": "number",
    "meetingFrequency": "weekly|biweekly|monthly"
  }
}
```

### Book Model
```json
{
  "id": "string",
  "title": "string",
  "author": "string",
  "description": "string",
  "coverImage": "string",
  "isbn": "string",
  "totalPages": "number",
  "genre": ["string"],
  "publishedYear": "number",
  "averageRating": "number",
  "ratingCount": "number",
  "addedBy": {
    "id": "string",
    "name": "string"
  }
}
```

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Testing the API

You can test endpoints using:
1. Postman
2. curl commands
3. Browser's Network tab
4. Frontend application

Example curl command:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination
List endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10/20)

Response includes pagination info:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```
