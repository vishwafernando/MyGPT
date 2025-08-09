# MyGPT Backend

This is the Node.js/Express backend for the MyGPT AI chat app. It is designed for local development only.

## Features

- REST API for chat and user management
- Clerk authentication middleware (secure endpoints)
- Gemini AI integration for chat responses
- ImageKit integration for file uploads
- MongoDB with Mongoose ODM
- CORS configured for localhost
- Development-friendly error handling and logging

## Environment Variables

Create a `.env` file in the backend directory (never commit real keys):

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=http://localhost:5173
```

## Installation & Usage

```bash
# Install dependencies
npm install

# Start development server (localhost:5000)
npm run dev
```

## API Endpoints

**Public:**
- `GET /api/health` — Health check
- `GET /api/upload` — Get ImageKit upload authentication

**Protected (Clerk token required):**
- `GET /api/userchats` — Get user's chat list
- `POST /api/chats` — Create new chat
- `GET /api/chats/:id` — Get specific chat
- `PUT /api/chats/:id` — Update chat with new messages

## Database Models

**Chat Model (`models/chat.js`):**
```js
{
  userId: String,        // Clerk user ID
  history: [
    {
      role: String,      // "user" or "model"
      parts: [{ text: String }],
      img: String        // Optional image URL
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**UserChats Model (`models/userchats.js`):**
```js
{
  userId: String,        // Clerk user ID
  chats: [
    {
      _id: ObjectId,     // Reference to Chat document
      title: String,     // First 40 characters of initial message
      createdAt: Date
    }
  ]
}
```

## Authentication Flow

1. Frontend sends requests with Clerk session token
2. ClerkExpressRequireAuth middleware validates token
3. req.auth.userId contains authenticated user's ID
4. Database queries are filtered by userId

## Error Handling & CORS

- Authentication errors (401)
- CORS errors (403)
- Validation errors (400)
- Database errors (500)
- Not found errors (404)
- CORS allows requests from localhost only

## Development Tips

- Debug logging for all requests
- Development-friendly error messages
- Use Postman/curl for API testing

## Troubleshooting

- **MongoDB:** Check connection string, service status
- **Clerk:** Verify keys, dashboard config
- **ImageKit:** Check credentials, dashboard, CORS
- **Ports:** Check for conflicts, use netstat/taskkill

## Security Notes

- Never commit `.env` files
- Always validate user input
- Use Clerk middleware for protected endpoints
- Keep dependencies updated

## License

MIT License
