# levelup
the history of comeback!!
Base URL: http://localhost:3000

1. Signup (Create User)
Method: POST
URL: http://localhost:3000/api/auth/signup
Headers:
Content-Type: application/json
Body (JSON):

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
Expected Response: 201 Created with message "User created successfully"
2. Login (Authenticate User)
Method: POST
URL: http://localhost:3000/api/auth/login
Headers:
Content-Type: application/json
Body (JSON):

{
  "email": "test@example.com",
  "password": "password123"
}
Expected Response: 200 OK with JWT token

{
  "token": "your_jwt_token_here"
}
3. Get User Profile (Requires Authentication)
Method: GET
URL: http://localhost:3000/api/users/profile
Headers:
Authorization: Bearer your_jwt_token_here (replace with token from login)
Expected Response: 200 OK with user data
4. API Status Check
Method: GET
URL: http://localhost:3000/api/status
Expected Response: 200 OK

{
  "status": "API is running"
}
Notes
Ensure the backend server is running on port 3000.
For the profile endpoint, use the token obtained from the login response in the Authorization header.
Test signup first, then login, then profile.