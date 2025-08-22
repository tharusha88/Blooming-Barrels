# Blooming Barrel Backend

A modern PHP backend with OOP architecture for the Blooming Barrel application.

## Features

- **Object-Oriented Architecture**: Clean MVC pattern with proper separation of concerns
- **Database Layer**: PDO-based database connection with prepared statements
- **Authentication System**: Session-based authentication with password hashing
- **Input Validation**: Comprehensive validation utilities
- **CORS Support**: Configurable CORS headers for frontend integration
- **Error Handling**: Centralized error logging and handling
- **Rate Limiting**: Basic rate limiting implementation
- **RESTful API**: Clean API endpoints following REST conventions

## Project Structure

```
backend/
├── config/
│   ├── Database.php      # PDO database connection class
│   └── constants.php     # Configuration constants
├── controllers/
│   └── AuthController.php # Authentication controller
├── models/
│   └── User.php          # User model
├── public/
│   └── index.php         # Main router and entry point
├── utils/
│   ├── Response.php      # JSON response utility
│   ├── Validator.php     # Input validation utility
│   └── helpers.php       # Helper functions
├── logs/                 # Error logs (auto-created)
└── README.md
```

## Database Configuration

Update the database constants in `config/constants.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'blooming_barrels');
define('DB_USER', 'root');
define('DB_PASS', '');
```

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user information

### Request/Response Format

All requests should be JSON with `Content-Type: application/json` header.

#### Registration Request:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zip_code": "12345"
}
```

#### Login Request:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Success Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Error Response:
```json
{
  "error": "Invalid credentials"
}
```

## Setup Instructions

1. **Database Setup**: Ensure your MySQL database is running with the existing schema
2. **Configuration**: Update database credentials in `config/constants.php`
3. **Web Server**: Point your web server document root to the `backend/public/` directory
4. **Permissions**: Ensure the `logs/` directory is writable
5. **Frontend Integration**: Update frontend API base URL to point to your backend

## Security Features

- Password hashing using PHP's `password_hash()`
- Prepared statements for SQL injection prevention
- Input validation and sanitization
- Session-based authentication
- CORS protection
- Rate limiting
- Error logging without exposing sensitive data

## Development

For local development, you can use PHP's built-in server:

```bash
cd backend/public
php -S localhost:8000
```

Then your API will be available at `http://localhost:8000/`

## Frontend Integration

Update your frontend API configuration to use the backend endpoints:

```javascript
const API_BASE_URL = 'http://localhost:8000';

// Instead of mock functions, use real API calls:
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for session cookies
    body: JSON.stringify(credentials),
  });
  return response.json();
};
```

## Extending the API

To add new endpoints:

1. Create a new controller in `controllers/`
2. Create corresponding models in `models/`
3. Add routes in `public/index.php`
4. Follow the existing patterns for validation and error handling

## Production Considerations

- Use environment variables for sensitive configuration
- Implement proper logging and monitoring
- Use a reverse proxy (nginx/Apache) instead of PHP built-in server
- Implement more sophisticated rate limiting (Redis-based)
- Add API documentation (OpenAPI/Swagger)
- Implement proper session storage for load balancing
