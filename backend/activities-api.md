# Activities API Documentation

This document outlines the APIs available in the `backend/routes/activities.js` file, including their endpoints, required inputs, and expected responses.

## Base URL
All endpoints are relative to the base URL of the API server (e.g., `http://localhost:3000/api/activities`).

## Authentication
All endpoints require authentication via the `authMiddleware`. Requests must include a valid JWT token in the Authorization header (e.g., `Bearer <token>`).

## Endpoints

### 1. Create a New Activity
- **Method**: POST
- **Endpoint**: `/activity`
- **Description**: Creates a new activity for the authenticated user.

#### Input Data (Request Body)
The request body must be in JSON format and include the following fields:

- `title` (string, required): The title of the activity. Must not be empty or only whitespace.
- `createdDate` (string, required): The creation date of the activity. Must be a valid date in YYYY-MM-DD format or ISO date string.
- `streak` (number, optional): The initial streak count. Defaults to 0 if not provided.
- `dailyStatus` (array, optional): An array representing daily status. Defaults to an empty array if not provided.

**Note:** Only `title` and `createdDate` are required. The optional fields `streak` and `dailyStatus` can be omitted, and the API will use default values.

#### Example Request Body (Minimal - Required Fields Only)
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
- **Error (400 Bad Request)**: If validation fails (e.g., missing title, invalid date).
  ```json
  {
    "error": "title is required and cannot be empty"
  }
  ```
- **Error (400 Bad Request)**: General error during creation.
  ```json
  {
    "error": "error message"
  }
  ```

### 2. Get All Activities for the User
- **Method**: GET
- **Endpoint**: `/`
- **Description**: Retrieves all activities created by the authenticated user.

#### Input Data
No request body required. The user is identified via the authentication token.

#### Response
- **Success (200 OK)**: Returns a JSON array of activities.
  ```json
  [
    {
      "_id": "activity_id_1",
      "title": "Morning Run",
      "createdDate": "2023-10-01T00:00:00.000Z",
      "streak": 5,
      "dailyStatus": [true, false, true],
      "createdBy": "user_id"
    },
    {
      "_id": "activity_id_2",
      "title": "Reading",
      "createdDate": "2023-10-02T00:00:00.000Z",
      "streak": 0,
      "dailyStatus": [],
      "createdBy": "user_id"
    }
  ]
  ```
- **Error (500 Internal Server Error)**: If there's an issue retrieving activities.
  ```json
  {
    "error": "error message"
  }
o  ```

### 3. Delete an Activity
- **Method**: DELETE
- **Endpoint**: `/activity/:id`
- **Description**: Deletes a specific activity by its ID for the authenticated user. Only the creator of the activity can delete it.

#### Input Data
- **URL Parameter**: `id` (string, required): The ID of the activity to delete.
- No request body required. The user is identified via the authentication token.

#### Response
- **Success (200 OK)**: Returns a confirmation message.
  ```json
  {
    "message": "Activity deleted successfully"
  }
  ```
- **Error (404 Not Found)**: If the activity does not exist or does not belong to the user.
  ```json
  {
    "error": "Activity not found"
  }
  ```
- **Error (500 Internal Server Error)**: If there's an issue deleting the activity.
  ```json
  {
    "error": "error message"
  }
