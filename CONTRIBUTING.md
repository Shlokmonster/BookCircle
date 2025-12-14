# Contributing to BookCircle

Thank you for considering contributing to BookCircle! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shlokmonster/BookCircle.git
cd BookCircle
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm start
```

## Code Style

- Use consistent indentation (2 spaces)
- Follow existing code patterns
- Write meaningful commit messages
- Comment complex logic
- Use descriptive variable and function names

## Project Structure

```
BookCircle/
├── backend/          # Express.js backend
│   ├── src/
│   │   ├── models/   # Mongoose models
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Custom middleware
│   │   └── config/   # Configuration
│   └── package.json
└── frontend/         # React frontend
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/     # Page components
    │   ├── services/  # API services
    │   └── context/   # React context
    └── package.json
```

## Making Changes

### Adding a New Feature

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Implement your feature
3. Test your changes
4. Commit with descriptive messages:
```bash
git commit -m "Add feature: description of what you added"
```

### Fixing a Bug

1. Create a new branch:
```bash
git checkout -b fix/bug-description
```

2. Fix the bug
3. Test the fix
4. Commit with descriptive messages:
```bash
git commit -m "Fix: description of what you fixed"
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update the README.md if you've added features
4. Create a pull request with a clear title and description
5. Link any relevant issues
6. Wait for review and address any feedback

## Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep first line under 72 characters
- Reference issues and pull requests when relevant

Examples:
- `Add book recommendation algorithm`
- `Fix progress tracking bug`
- `Update README with deployment instructions`

## Testing

Currently, the project doesn't have automated tests. When adding tests:

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd frontend
npm test
```

## Areas for Contribution

Here are some areas where contributions would be particularly welcome:

### Features
- Book recommendation algorithm
- User profiles with reading statistics
- Email notifications for discussions
- Reading challenges and goals
- Book ratings and reviews
- Social features (following users, activity feed)
- Search and filtering improvements
- Mobile app version

### Technical Improvements
- Add automated tests
- Implement rate limiting
- Add caching layer
- Improve error handling
- Add logging system
- Performance optimizations
- Accessibility improvements

### Documentation
- API documentation improvements
- Tutorial videos or guides
- Deployment guides for different platforms
- Code comments and inline documentation

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Accept responsibility and apologize for mistakes

## Questions?

Feel free to open an issue with the "question" label if you need help or clarification on anything.

## License

By contributing to BookCircle, you agree that your contributions will be licensed under the MIT License.
