# Auth Service

Authentication and authorization microservice for the e-commerce platform.

## Responsibilities

### 1. Authentication

- User login with email/password
- User registration
- Email verification
- Password reset via email
- Token refresh
- Logout and session termination

### 2. Authorization

- Role-based access control (RBAC)
- Permission management
- Token validation
- API endpoint protection

### 3. Token Management

- JWT token generation
- Token validation
- Token refresh mechanism
- Token blacklisting (for logout)

### 4. OAuth/SSO

- Google OAuth integration
- Facebook OAuth integration
- Other social login providers
- Enterprise SSO (optional)

### 5. Security

- Password hashing (bcrypt)
- Rate limiting for login attempts
- Account lockout after failed attempts
- Secure token storage
- HTTPS enforcement

## Architecture

### Clean Architecture Layers

1. **Presentation Layer** (`controllers/`)

   - HTTP request handlers
   - Request/response mapping
   - Input validation

2. **Application Layer** (`use-cases/`)

   - Login use case
   - Registration use case
   - Password reset use case
   - Token refresh use case

3. **Domain Layer** (`domain/`)

   - User entity
   - Token entity
   - Business rules and validation

4. **Infrastructure Layer** (`infrastructure/`)
   - Database repositories
   - JWT service
   - Email service
   - Password hashing service

## API Endpoints

### Authentication

- POST /auth/register - Register new user
- POST /auth/login - Login user
- POST /auth/logout - Logout user
- POST /auth/refresh - Refresh access token
- POST /auth/verify-email - Verify email address
- POST /auth/forgot-password - Request password reset
- POST /auth/reset-password - Reset password

### Authorization

- GET /auth/me - Get current user
- POST /auth/validate - Validate token

## Database Schema

### Users Table

- id, email, password_hash, first_name, last_name
- role, is_active, email_verified, created_at, updated_at

### Tokens Table

- id, user_id, token, type (refresh/reset), expires_at, created_at

## Technology Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- TypeORM
- JWT (jsonwebtoken)
- bcryptjs
