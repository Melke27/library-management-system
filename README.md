# Library Management System

A comprehensive CRUD (Create, Read, Update, Delete) application built with Node.js, Express.js, MySQL, and Docker for managing a library's books and authors.

## 🚀 Features

- **Complete CRUD Operations** for Books and Authors
- **RESTful API** with proper HTTP status codes
- **Database Relations** (One-to-Many: Authors to Books)
- **Input Validation** using express-validator
- **Docker Containerization** with Docker Compose
- **Security Features** (Helmet, CORS, Rate Limiting)
- **Search & Filtering** capabilities
- **Stock Management** for books
- **Comprehensive Error Handling**
- **Health Check Endpoint**

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0
- **Containerization**: Docker, Docker Compose
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator
- **Environment Management**: dotenv

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) (version 20.0+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- [Node.js](https://nodejs.org/) (version 16.0+) - if running locally
- [Git](https://git-scm.com/) - for cloning the repository

## 🚀 Quick Start with Docker

1. **Clone the repository** (if using Git):
   ```bash
   git clone <your-repo-url>
   cd library-management-system
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Verify the application is running**:
   ```bash
   curl http://localhost:3000/health
   ```

4. **Access the API**:
   - Base URL: `http://localhost:3000`
   - Authors API: `http://localhost:3000/api/v1/authors`
   - Books API: `http://localhost:3000/api/v1/books`

## 🔧 Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start MySQL** (using Docker):
   ```bash
   docker-compose up mysql -d
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. **Start the application**:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Authors Table
```sql
CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    birth_date DATE,
    nationality VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    author_id INT NOT NULL,
    genre VARCHAR(100),
    publication_date DATE,
    pages INT,
    price DECIMAL(10, 2),
    description TEXT,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {...},
  "meta": {...}
}
```

---

## 👤 Authors API

### GET /authors
Get all authors with optional search and pagination.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Number of results to skip (default: 0)
- `search` (optional): Search term for name or email

**Example:**
```bash
curl "http://localhost:3000/api/v1/authors?limit=10&search=rowling"
```

### GET /authors/:id
Get a specific author by ID.

**Example:**
```bash
curl "http://localhost:3000/api/v1/authors/1"
```

### GET /authors/:id/books
Get all books by a specific author.

**Example:**
```bash
curl "http://localhost:3000/api/v1/authors/1/books"
```

### POST /authors
Create a new author.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@email.com",
  "birth_date": "1980-05-15",
  "nationality": "American",
  "bio": "Author biography"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/authors" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@email.com",
    "nationality": "British"
  }'
```

### PUT /authors/:id
Update an existing author.

**Request Body:** Same as POST (all fields optional)

**Example:**
```bash
curl -X PUT "http://localhost:3000/api/v1/authors/1" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated author biography"
  }'
```

### DELETE /authors/:id
Delete an author (and all their books due to CASCADE).

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/authors/1"
```

---

## 📖 Books API

### GET /books
Get all books with optional filtering and pagination.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Number of results to skip (default: 0)
- `search` (optional): Search term for title, ISBN, genre, or description
- `genre` (optional): Filter by genre
- `author_id` (optional): Filter by author ID

**Example:**
```bash
curl "http://localhost:3000/api/v1/books?genre=Fantasy&limit=5"
```

### GET /books/:id
Get a specific book by ID (includes author information).

**Example:**
```bash
curl "http://localhost:3000/api/v1/books/1"
```

### GET /books/isbn/:isbn
Get a book by its ISBN.

**Example:**
```bash
curl "http://localhost:3000/api/v1/books/isbn/978-0747532699"
```

### GET /books/low-stock
Get books with low stock quantity.

**Query Parameters:**
- `threshold` (optional): Stock threshold (default: 5)

**Example:**
```bash
curl "http://localhost:3000/api/v1/books/low-stock?threshold=10"
```

### POST /books
Create a new book.

**Request Body:**
```json
{
  "title": "Sample Book",
  "isbn": "978-1234567890",
  "author_id": 1,
  "genre": "Fiction",
  "publication_date": "2023-01-15",
  "pages": 300,
  "price": 19.99,
  "description": "A sample book description",
  "stock_quantity": 50
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Adventure",
    "isbn": "978-9876543210",
    "author_id": 1,
    "genre": "Adventure",
    "price": 24.99,
    "stock_quantity": 25
  }'
```

### PUT /books/:id
Update an existing book.

**Request Body:** Same as POST (all fields optional)

**Example:**
```bash
curl -X PUT "http://localhost:3000/api/v1/books/1" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 22.99,
    "stock_quantity": 75
  }'
```

### PATCH /books/:id/stock
Update only the stock quantity of a book.

**Request Body:**
```json
{
  "stock_quantity": 100
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/v1/books/1/stock" \
  -H "Content-Type: application/json" \
  -d '{"stock_quantity": 150}'
```

### DELETE /books/:id
Delete a book.

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/books/1"
```

---

## 🔍 Health Check

### GET /health
Check the health status of the application and database connection.

**Example:**
```bash
curl "http://localhost:3000/health"
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2023-09-07T12:00:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## 🐳 Docker Commands

### Start all services
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f app
```

### Stop all services
```bash
docker-compose down
```

### Rebuild and restart
```bash
docker-compose down
docker-compose up --build -d
```

### Access MySQL database
```bash
docker-compose exec mysql mysql -u library_user -p library_management
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3307
DB_USER=library_user
DB_PASSWORD=library_password
DB_NAME=library_management

# Application Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Security
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing the API

### Sample Data
The database is pre-populated with sample authors and books for testing:
- Authors: J.K. Rowling, George Orwell, Agatha Christie, Stephen King
- Books: Harry Potter series, 1984, Animal Farm, Murder on the Orient Express, The Shining

### Testing Workflow
1. **Get all authors**: `curl http://localhost:3000/api/v1/authors`
2. **Create a new author**: Use the POST example above
3. **Get all books**: `curl http://localhost:3000/api/v1/books`
4. **Search books**: `curl "http://localhost:3000/api/v1/books?search=Harry"`
5. **Update book stock**: Use the PATCH /books/:id/stock example above

## 🚨 Error Handling

The API returns appropriate HTTP status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate entries)
- `500` - Internal Server Error

Example error response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates all user inputs
- **SQL Injection Protection**: Using parameterized queries

## 📁 Project Structure

```
library-management-system/
├── src/
│   ├── controllers/          # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── app.js              # Main application
├── config/
│   └── database.js         # Database configuration
├── database/
│   └── schema.sql          # Database schema
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile              # Docker image configuration
├── package.json            # Node.js dependencies
├── .env                    # Environment variables
├── healthcheck.js          # Docker health check
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Email: your.email@example.com
- GitHub: [@your-username](https://github.com/your-username)

## 📞 Support

If you have any questions or issues, please:
1. Check the existing documentation
2. Search for existing issues in the GitHub repository
3. Create a new issue with detailed information

---

**Note**: This project was created as part of Week 8 Assignment for the Final Project, demonstrating a complete CRUD application with Node.js, Express, MySQL, and Docker integration.
