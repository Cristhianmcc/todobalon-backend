# TodoBalon Backend - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a Node.js Express API backend for TodoBalon authentication system using Supabase as the database.

## Key Technologies
- **Express.js**: Web server framework
- **Supabase**: PostgreSQL database and authentication
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## Architecture
- RESTful API endpoints for authentication
- Admin code generation system
- User registration with authorization codes
- Session management with JWT tokens
- Integration with Supabase database

## API Endpoints
- `POST /api/auth/login` - User login with access code
- `POST /api/auth/register` - User registration with auth code
- `POST /api/auth/generate` - Admin code generation
- `GET /api/auth/verify` - Token verification

## Database Schema
- `users` table: user profiles and access codes
- `auth_codes` table: admin authorization codes
- `sessions` table: active user sessions

## Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Supabase service role key
- `JWT_SECRET`: JWT signing secret
- `ADMIN_PASSWORD`: Admin panel password
- `NODE_ENV`: Environment (development/production)

## Coding Standards
- Use async/await for asynchronous operations
- Implement proper error handling and HTTP status codes
- Follow RESTful API conventions
- Use environment variables for configuration
- Implement input validation and sanitization
- Use proper logging for debugging and monitoring
