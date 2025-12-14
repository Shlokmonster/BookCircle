# BookCircle 📚

A collaborative book club platform built with the MERN stack where learners vote on books, track reading progress, and discuss together.

## Features

- **Book Voting System**: Members can propose books and vote on which ones to read
- **Reading Progress Tracking**: Track your reading progress with page counts and notes
- **Discussion Forums**: Engage in discussions about books with other members
- **User Authentication**: Secure registration and login system
- **Book Status Management**: Books progress through proposed → voting → reading → completed states

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
BookCircle/
├── backend/
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── context/        # React context
    │   └── App.js          # Main component
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookcircle
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file if you need custom API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (optional query: `?status=voting`)
- `GET /api/books/:id` - Get a single book
- `POST /api/books` - Propose a new book (requires auth)
- `POST /api/books/:id/vote` - Vote on a book (requires auth)
- `DELETE /api/books/:id/vote` - Remove vote (requires auth)
- `PUT /api/books/:id/status` - Update book status (requires auth)

### Progress
- `GET /api/progress` - Get user's reading progress (requires auth)
- `GET /api/progress/:bookId` - Get progress for specific book (requires auth)
- `POST /api/progress/:bookId` - Update reading progress (requires auth)
- `GET /api/progress/book/:bookId/all` - Get all users' progress for a book

### Discussions
- `GET /api/discussions/book/:bookId` - Get discussions for a book
- `GET /api/discussions/:id` - Get a single discussion
- `POST /api/discussions` - Create a discussion (requires auth)
- `POST /api/discussions/:id/reply` - Add a reply (requires auth)
- `DELETE /api/discussions/:id` - Delete a discussion (requires auth)

## Usage

1. **Register/Login**: Create an account or login to access all features
2. **Browse Books**: View proposed and current books on the Books page
3. **Vote**: Vote on books you'd like to read
4. **Propose Books**: Suggest new books for the club
5. **Track Progress**: Update your reading progress as you read
6. **Discuss**: Join discussions about books you're reading

## Database Models

### User
- username, email, password
- role (member/admin)
- joinedDate

### Book
- title, author, description, isbn, coverImage
- totalPages, proposedBy
- status (proposed/voting/reading/completed)
- votes array
- startDate, endDate

### Progress
- user, book
- currentPage, notes
- updatedAt

### Discussion
- book, user
- title, content
- replies array
- timestamps

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
