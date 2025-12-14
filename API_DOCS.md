# BookCircle API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login User
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

## Books

### Get All Books
**GET** `/books`

Query Parameters:
- `status` (optional): Filter by status (proposed, voting, reading, completed)

Response:
```json
[
  {
    "_id": "book_id",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel...",
    "totalPages": 180,
    "status": "voting",
    "votes": [],
    "proposedBy": {
      "_id": "user_id",
      "username": "johndoe"
    }
  }
]
```

### Get Single Book
**GET** `/books/:id`

Response: Single book object with populated votes and proposedBy fields

### Propose a Book
**POST** `/books` (Authenticated)

Request Body:
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel set in the Jazz Age...",
  "isbn": "9780743273565",
  "coverImage": "https://example.com/cover.jpg",
  "totalPages": 180
}
```

### Vote on a Book
**POST** `/books/:id/vote` (Authenticated)

Request Body:
```json
{
  "voteType": "upvote"
}
```
or
```json
{
  "voteType": "downvote"
}
```

### Remove Vote
**DELETE** `/books/:id/vote` (Authenticated)

### Update Book Status
**PUT** `/books/:id/status` (Authenticated)

Request Body:
```json
{
  "status": "reading"
}
```

Valid statuses: proposed, voting, reading, completed

## Progress

### Get My Progress
**GET** `/progress` (Authenticated)

Response: Array of progress objects with populated book information

### Get Progress for Book
**GET** `/progress/:bookId` (Authenticated)

Response: Single progress object

### Update Progress
**POST** `/progress/:bookId` (Authenticated)

Request Body:
```json
{
  "currentPage": 150,
  "notes": "Great chapter about the green light symbolism"
}
```

### Get All Users' Progress for a Book
**GET** `/progress/book/:bookId/all`

Response: Array of all users' progress for the specified book

## Discussions

### Get Discussions for Book
**GET** `/discussions/book/:bookId`

Response: Array of discussion objects with replies

### Get Single Discussion
**GET** `/discussions/:id`

Response: Single discussion object with populated user and replies

### Create Discussion
**POST** `/discussions` (Authenticated)

Request Body:
```json
{
  "bookId": "book_id",
  "title": "Symbolism in Chapter 5",
  "content": "I found the green light symbolism particularly interesting..."
}
```

### Add Reply to Discussion
**POST** `/discussions/:id/reply` (Authenticated)

Request Body:
```json
{
  "content": "Great observation! I also noticed..."
}
```

### Delete Discussion
**DELETE** `/discussions/:id` (Authenticated)

Note: Only the discussion author can delete their discussion

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error message here"
}
```

or with validation errors:

```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
