# API Documentation

This document outlines all APIs available in the project, including authentication, user management, and activities endpoints.

## Base URL
All endpoints are relative to the base URL of the API server: `https://levelup-7vvn.onrender.com/api/`.

## Authentication
Certain endpoints require authentication via JWT token. Include the token in the Authorization header as `Bearer <token>`. Tokens are obtained via login and can be verified.

## Endpoints

### Authentication APIs (`/auth`)

#### 1. User Signup
- **Method**: POST
- **Endpoint**: `/auth/signup`
- **Description**: Registers a new user.

#### Input Data (Request Body)
- `username` (string, required): Unique username.
- `email` (string, required): Unique email address.
- `password` (string, required): Password for the account.

#### Example Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Response
- **Success (201 Created)**:
  ```json
  {
    "message": "User created successfully"
  }
  ```
- **Error (400 Bad Request)**: If username or email already exists or validation fails.
  ```json
  {
    "error": "Username or email already exists"
  }
  ```

#### 2. User Login
- **Method**: POST
- **Endpoint**: `/auth/login`
- **Description**: Authenticates a user and returns a JWT token.

#### Input Data (Request Body)
- `email` (string, required): User's email.
- `password` (string, required): User's password.

#### Example Request Body
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Response
- **Success (200 OK)**:
  ```json
  {
    "message": "successfully logged in!",
    "token": "jwt_token_here"
  }
  ```
- **Error (401 Unauthorized)**: Invalid credentials.
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

#### 3. Verify Token
- **Method**: GET
- **Endpoint**: `/auth/verify`
- **Description**: Verifies if the provided JWT token is valid.

#### Input Data
Token via cookie (`authToken`) or Authorization header (`Bearer <token>`).

#### Response
- **Success (200 OK)**:
  ```json
  {
    "authenticated": true,
    "user": {
      "id": "user_id",
      "email": "user_email"
    }
  }
  ```
- **Failure (200 OK)**:
  ```json
  {
    "authenticated": false
  }
  ```

#### 4. User Logout
- **Method**: POST
- **Endpoint**: `/auth/logout`
- **Description**: Logs out the user by clearing the auth cookie.

#### Input Data
None.

#### Response
- **Success (200 OK)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### User APIs (`/users`)

#### 1. Get User Profile
- **Method**: GET
- **Endpoint**: `/users/profile`
- **Description**: Retrieves the profile of the authenticated user.

#### Input Data
None. User identified via auth token.

#### Response
- **Success (200 OK)**: Returns user object.
  ```json
  {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
  ```
- **Error (500 Internal Server Error)**:
  ```json
  {
    "error": "error message"
  }
  ```

### Activities APIs (`/activities`)

#### 1. Create a New Activity
- **Method**: POST
- **Endpoint**: `/activities/activity`
- **Description**: Creates a new activity for the authenticated user.

#### Input Data (Request Body)
- `title` (string, required): The title of the activity. Must not be empty or only whitespace.
- `createdDate` (string, required): The creation date. Must be a valid ISO date string.
- `streak` (number, optional): Initial streak count. Defaults to 0.
- `dailyStatus` (array, optional): Array of daily statuses. Defaults to empty array.

#### Example Request Body (Minimal)
```json
{
  "title": "Morning Run",
  "createdDate": "2023-10-01"
}
```

#### Example Request Body (All Fields)
```json
{
  "title": "Morning Run",
  "createdDate": "2023-10-01",
  "streak": 5,
  "dailyStatus": [true, false, true]
}
```

#### Response
- **Success (201 Created)**:
  ```json
  {
    "message": "Activity created successfully",
    "activity": {
      "_id": "activity_id",
      "title": "Morning Run",
      "createdDate": "2023-10-01T00:00:00.000Z",
      "streak": 5,
      "dailyStatus": [true, false, true],
      "createdBy": "user_id"
    }
  }
  ```
- **Error (400 Bad Request)**: Validation errors.
  ```json
  {
    "error": "title is required and cannot be empty"
  }
  ```

#### 2. Get All Activities for the User
- **Method**: GET
- **Endpoint**: `/activities/`
- **Description**: Retrieves all activities for the authenticated user.

#### Input Data
None.

#### Response
- **Success (200 OK)**: Array of activities.
  ```json
  [
    {
      "_id": "activity_id",
      "title": "Morning Run",
      "createdDate": "2023-10-01T00:00:00.000Z",
      "streak": 5,
      "dailyStatus": [true, false, true],
      "createdBy": "user_id"
    }
  ]
  ```
- **Error (500 Internal Server Error)**:
  ```json
  {
    "error": "error message"
  }
  ```

#### 3. Get Activity by ID
- **Method**: GET
- **Endpoint**: `/activities/:id`
- **Description**: Retrieves a specific activity by ID for the authenticated user.

#### Input Data
- **URL Parameter**: `id` (string, required): Activity ID.

#### Response
- **Success (200 OK)**: Activity object.
  ```json
  {
    "_id": "activity_id",
    "title": "Morning Run",
    "createdDate": "2023-10-01T00:00:00.000Z",
    "streak": 5,
    "dailyStatus": [true, false, true],
    "createdBy": "user_id"
  }
  ```
- **Error (404 Not Found)**:
  ```json
  {
    "error": "Activity not found"
  }
  ```

#### 4. Update Activity
- **Method**: PUT
- **Endpoint**: `/activities/:id`
- **Description**: Updates a specific activity by ID for the authenticated user.

#### Input Data (Request Body)
- `title` (string, optional): New title.
- `createdDate` (string, optional): New creation date.
- `streak` (number, optional): New streak.
- `dailyStatus` (array, optional): New daily status.
- `completed` (boolean, optional): Completion status.

#### Example Request Body
```json
{
  "title": "Updated Run",
  "streak": 6
}
```

#### Response
- **Success (200 OK)**:
  ```json
  {
    "message": "Activity updated successfully",
    "activity": { ... }
  }
  ```
- **Error (404 Not Found)**:
  ```json
  {
    "error": "Activity not found"
  }
  ```

#### 5. Delete an Activity
- **Method**: DELETE
- **Endpoint**: `/activities/:id`
- **Description**: Deletes a specific activity by ID for the authenticated user.

#### Input Data
- **URL Parameter**: `id` (string, required): Activity ID.

#### Response
- **Success (200 OK)**:
  ```json
  {
    "message": "Activity deleted successfully",
    "activity": { ... }
  }
  ```
- **Error (404 Not Found)**:
  ```json
  {
    "error": "Activity not found or unauthorized"
  }
  ```
