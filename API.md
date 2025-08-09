# API Documentation

This document describes the backend API endpoints for the MyGPT application.

## Base URL

- Development: `http://localhost:5000` (or set via `CLIENT_URL`/`VITE_API_URL`)
- Production: Set via environment (`CLIENT_URL` and deploy URL)

## Authentication

Most endpoints require authentication using Clerk. Include the Clerk session token in the Authorization header:

```
Authorization: Bearer <clerk_session_token>
```

## Endpoints

### Health Check

#### GET /api/health

Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "environment": "development",
  "domain": "localhost",
  "port": 5000,
  "server": "MyGPT Backend",
  "version": "1.0.0"
}
```

### Image Upload

#### GET /api/upload

Get ImageKit authentication parameters for client-side upload.

**Response:**
```json
{
  "signature": "...",
  "expire": 1640995200,
  "token": "..."
}
```

### User Chats

#### GET /api/userchats

Get all chats for the authenticated user.

**Headers:**
- `Authorization: Bearer <clerk_token>`

**Response:**
```json
[
  {
    "_id": "chat_id",
    "title": "Chat title",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
]
```

#### POST /api/chats

Create a new chat.

**Headers:**
- `Authorization: Bearer <clerk_token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "text": "Initial message"
}
```

**Response:**
```
"new_chat_id"
```

### Individual Chats

#### GET /api/chats/:id

Get a specific chat by ID.

**Headers:**
- `Authorization: Bearer <clerk_token>`

**Response:**
```json
{
  "_id": "chat_id",
  "userId": "user_id",
  "history": [
    {
      "role": "user",
      "parts": [{ "text": "Hello" }],
      "img": "optional_image_url"
    },
    {
      "role": "model",
      "parts": [{ "text": "Hi there!" }]
    }
  ],
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

#### PUT /api/chats/:id

Add a new message to an existing chat.

**Headers:**
- `Authorization: Bearer <clerk_token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "question": "User message",
  "answer": "AI response",
  "img": "optional_image_url"
}
```

**Response:**
```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 CORS Error
```json
{
  "error": "CORS policy violation",
  "message": "Origin not allowed",
  "origin": "http://example.com"
}
```

### 404 Not Found
```json
{
  "error": "API endpoint not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error description"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production deployments.

## CORS Configuration

 The server allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)
- `http://localhost` (Local access)
- Environment variable `CLIENT_URL` (for production)

## Database Models

### Chat Model
```javascript
{
  userId: String,      // Clerk user ID
  history: [
    {
      role: String,    // "user" or "model"
      parts: [{ text: String }],
      img: String      // Optional image URL
    }
  ],
  createdAt: Date
}
```

### UserChats Model
```javascript
{
  userId: String,      // Clerk user ID
  chats: [
    {
      _id: ObjectId,   // Chat ID reference
      title: String,   // Chat title (first 40 chars)
      createdAt: Date
    }
  ]
}
```

## Environment Variables

Required environment variables for the backend:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URL` | MongoDB connection string |
| `IMAGE_KIT_ENDPOINT` | ImageKit URL endpoint |
| `IMAGE_KIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGE_KIT_PRIVATE_KEY` | ImageKit private key |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | Environment (development/production) |
