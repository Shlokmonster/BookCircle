# BookCircle Backend

A comprehensive MERN stack backend for a collaborative book club platform where learners vote on books, track reading progress, schedule meetings, and discuss together.

## Features

### Core Features
- **Authentication**: JWT-based user authentication with registration and login
- **Book Management**: CRUD operations for books with ratings and reviews
- **Club Management**: Create and manage book clubs with member roles and permissions
- **Voting System**: Democratic book selection with single and ranked voting options
- **Reading Progress**: Track pages read, notes, highlights, and reading sessions
- **Meeting Scheduling**: Schedule and manage club meetings with agendas and RSVPs
- **Quote Sharing**: Share and discuss favorite book quotes with likes and comments

### Advanced Features
- **User Profiles**: Enhanced profiles with bio, favorite genres, reading goals, and social links
- **Progress Analytics**: Reading statistics and club progress tracking
- **Meeting Types**: Support for in-person, virtual, and hybrid meetings
- **Quote Collections**: Organize quotes into custom collections
- **Book History**: Track completed books and ratings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Clubs
- `POST /api/clubs` - Create new club
- `GET /api/clubs` - Get all public clubs (with pagination, search, filters)
- `GET /api/clubs/my-clubs` - Get user's clubs
- `GET /api/clubs/:id` - Get club by ID
- `PUT /api/clubs/:id` - Update club (admin only)
- `DELETE /api/clubs/:id` - Delete club (admin only)
- `POST /api/clubs/:id/join` - Join club (with invite code if private)
- `POST /api/clubs/:id/leave` - Leave club
- `DELETE /api/clubs/:id/members/:memberId` - Remove member (admin only)
- `PUT /api/clubs/:id/current-book` - Set current book (admin only)

### Books
- `POST /api/books` - Add new book
- `GET /api/books` - Get all books (with pagination, search, filters)
- `GET /api/books/genres` - Get all genres
- `GET /api/books/popular` - Get popular books
- `GET /api/books/recent` - Get recent books
- `GET /api/books/:id` - Get book by ID
- `PUT /api/books/:id` - Update book (owner only)
- `DELETE /api/books/:id` - Delete book (owner only)
- `POST /api/books/:id/rate` - Rate book (1-5 stars)

### Voting
- `POST /api/votes` - Create new vote
- `GET /api/votes` - Get votes (with filters)
- `GET /api/votes/:id` - Get vote by ID
- `POST /api/votes/:id/vote` - Cast vote
- `DELETE /api/votes/:id/vote` - Remove vote
- `GET /api/votes/:id/results` - Get voting results
- `POST /api/votes/:id/end` - End voting (creator only)
- `DELETE /api/votes/:id` - Delete vote (creator only)

### Reading Progress
- `POST /api/reading-progress` - Create reading progress entry
- `GET /api/reading-progress` - Get reading progress (with filters)
- `GET /api/reading-progress/club/:clubId/stats` - Get club reading statistics
- `GET /api/reading-progress/user/:userId/stats` - Get user reading statistics
- `GET /api/reading-progress/:id` - Get progress by ID
- `PUT /api/reading-progress/:id/progress` - Update page progress
- `POST /api/reading-progress/:id/notes` - Add reading note
- `POST /api/reading-progress/:id/highlights` - Add highlight
- `PUT /api/reading-progress/:id/rate` - Rate and review book

### Meetings
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings` - Get meetings (with filters)
- `GET /api/meetings/upcoming` - Get upcoming meetings
- `GET /api/meetings/my-meetings` - Get user's meetings
- `GET /api/meetings/:id` - Get meeting by ID
- `PUT /api/meetings/:id` - Update meeting (host/creator only)
- `DELETE /api/meetings/:id` - Delete meeting (host/creator only)
- `POST /api/meetings/:id/rsvp` - RSVP to meeting
- `POST /api/meetings/:id/agenda` - Add agenda item (host/creator only)
- `PUT /api/meetings/:id/status` - Update meeting status (host/creator only)

### Quotes
- `POST /api/quotes` - Create new quote
- `GET /api/quotes` - Get quotes (with filters)
- `GET /api/quotes/popular` - Get popular quotes
- `GET /api/quotes/user/:userId` - Get user's quotes
- `GET /api/quotes/:id` - Get quote by ID
- `PUT /api/quotes/:id` - Update quote (owner only)
- `DELETE /api/quotes/:id` - Delete quote (owner only)
- `POST /api/quotes/:id/like` - Like quote
- `DELETE /api/quotes/:id/like` - Unlike quote
- `POST /api/quotes/:id/comments` - Add comment
- `POST /api/quotes/:id/comments/like` - Like comment
- `POST /api/quotes/:id/collection` - Add to collection
- `POST /api/quotes/:id/favorite` - Toggle favorite

## Database Models

### User
- Basic info: name, email, password
- Profile: profilePicture, bio, favoriteGenres
- Reading goals: booksPerYear, pagesPerWeek
- Social links: goodreads, twitter, instagram
- Privacy settings: isPublic

### Book
- Details: title, author, description, coverImage, isbn
- Metadata: totalPages, genre, publishedYear
- Community: addedBy, averageRating, ratingCount

### Club
- Info: name, description, admin, members
- Settings: isPrivate, inviteCode, maxMembers, tags
- Reading: currentBook, bookHistory, readingGoal

### Vote
- Details: title, description, votingOptions, votingType
- Timing: startDate, endDate, status
- Settings: maxVotesPerUser, isAnonymous
- Results: winner, vote tracking

### ReadingProgress
- Tracking: user, book, club, currentPage, totalPages
- Status: status, startDate, completionDate
- Content: notes, highlights, readingSessions
- Review: rating, review

### Meeting
- Details: title, description, book, scheduledDate
- Settings: location, meetingType, virtualMeetingLink
- Participants: host, attendees, agenda
- Progress: readingProgress, status, recording

### Quote
- Content: content, pageNumber, chapter, context
- Organization: book, club, user, tags, collections
- Engagement: likes, comments, isFavorite
- Settings: isPublic, color

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   mongo_url=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Start Server**
   ```bash
   npm start
   ```

The server will run on port 3000 (or as specified in your environment).

## Authentication

All API endpoints (except authentication) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API uses consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Success responses follow this format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

## Pagination

List endpoints support pagination with these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10/20 depending on endpoint)

## Search and Filtering

Many endpoints support search and filtering:
- `search` - Text search across relevant fields
- `genre` - Filter by genre(s)
- `author` - Filter by author
- `tags` - Filter by tags
- `status` - Filter by status
- `clubId` - Filter by club
- `userId` - Filter by user

## Rate Limiting

The API includes basic rate limiting to prevent abuse. Consider implementing more sophisticated rate limiting for production.

## Security Features

- JWT authentication with secure token handling
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- Private club access with invite codes

## Contributing

This backend provides a complete foundation for a book club platform. Key areas for enhancement:
- Real-time notifications
- File upload for book covers
- Advanced search with Elasticsearch
- Recommendation engine
- Social features and following
- Reading challenges and achievements
