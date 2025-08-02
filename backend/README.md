# MyGPT Backend

Node.js/Express backend for the MyGPT AI chat application with MongoDB, Clerk authentication, and AI integrations.

## Features

- **Express.js** REST API server
- **MongoDB** with Mongoose ODM for data persistence
- **Clerk** authentication middleware
- **Google Gemini AI** integration for chat responses
- **ImageKit** integration for file uploads
- **CORS** configured for local development
- **Error handling** optimized for development

## Tech Stack

- **Node.js** 20+
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Clerk SDK** - Authentication
- **ImageKit** - Image processing
- **dotenv** - Environment variables
- **CORS** - Cross-origin requests
- **Helmet** - Security headers

## Project Structure

```
backend/
├── models/
│   ├── chat.js         # Chat conversation model
│   └── userchats.js    # User chat list model
├── .env.example        # Environment variables template
├── index.js            # Main server file
└── package.json        # Dependencies and scripts
```

## Environment Variables

Create a `.env` file in the backend directory with these variables:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URL=your_mongodb_connection_string

# ImageKit Configuration
IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Getting API Keys

#### MongoDB
- **Atlas (Recommended)**: Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Local**: Use `mongodb://localhost:27017/mygpt`

#### ImageKit
1. Sign up at [ImageKit.io](https://imagekit.io/)
2. Go to Developer → API Keys
3. Copy URL Endpoint, Public Key, and Private Key

#### Clerk
1. Sign up at [Clerk.com](https://clerk.com/)
2. Create a new application
3. Copy Publishable Key and Secret Key from dashboard

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Public Endpoints

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "environment": "development",
  "port": 5000,
  "server": "MyGPT Backend (Local Development)",
  "version": "1.0.0"
}
```

#### GET /api/upload
Get ImageKit authentication parameters for client-side uploads.

**Response:**
```json
{
  "signature": "authentication_signature",
  "expire": 1640995200,
  "token": "upload_token"
}
```

### Protected Endpoints
*Require Clerk authentication token in Authorization header*

#### GET /api/userchats
Get all chat conversations for the authenticated user.

**Headers:**
```
Authorization: Bearer <clerk_session_token>
```

**Response:**
```json
[
  {
    "_id": "chat_id_1",
    "title": "Chat about AI",
    "createdAt": "2025-01-01T12:00:00.000Z"
  },
  {
    "_id": "chat_id_2", 
    "title": "Programming questions",
    "createdAt": "2025-01-01T11:00:00.000Z"
  }
]
```

#### POST /api/chats
Create a new chat conversation.

**Headers:**
```
Authorization: Bearer <clerk_session_token>
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Hello, I need help with React"
}
```

**Response:**
```json
"new_chat_id_string"
```

#### GET /api/chats/:id
Get a specific chat conversation by ID.

**Headers:**
```
Authorization: Bearer <clerk_session_token>
```

**Response:**
```json
{
  "_id": "chat_id",
  "userId": "user_clerk_id",
  "history": [
    {
      "role": "user",
      "parts": [{ "text": "Hello, I need help with React" }]
    },
    {
      "role": "model", 
      "parts": [{ "text": "I'd be happy to help you with React! What specific aspect would you like to learn about?" }]
    }
  ],
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:01:00.000Z"
}
```

#### PUT /api/chats/:id
Add new messages to an existing chat conversation.

**Headers:**
```
Authorization: Bearer <clerk_session_token>
Content-Type: application/json
```

**Body:**
```json
{
  "question": "How do I use useState?",
  "answer": "useState is a React Hook that lets you add state to functional components...",
  "img": "optional_image_url"
}
```

**Response:**
```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "matchedCount": 1
}
```

## Database Models

### Chat Model (`models/chat.js`)
Stores individual chat conversations with message history.

```javascript
{
  userId: String,        // Clerk user ID
  history: [
    {
      role: String,      // "user" or "model"  
      parts: [
        {
          text: String   // Message content
        }
      ],
      img: String        // Optional image URL
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### UserChats Model (`models/userchats.js`)
Stores the list of chats for each user (for sidebar display).

```javascript
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

1. **Frontend** sends request with Clerk session token
2. **ClerkExpressRequireAuth()** middleware validates token
3. **req.auth.userId** contains the authenticated user's ID
4. **Database queries** are filtered by userId for security

## Error Handling

The backend includes comprehensive error handling:

- **Authentication errors** (401 Unauthorized)
- **CORS errors** (403 Forbidden)
- **Validation errors** (400 Bad Request)
- **Database errors** (500 Internal Server Error)
- **Not found errors** (404 Not Found)

## CORS Configuration

Configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)  
- `http://localhost:3001` (Another alternative)
- `http://localhost` (General localhost)

## Development Features

### Debug Logging
The server logs all incoming requests with:
- Timestamp
- HTTP method and URL
- Request origin
- Simplified for local development

### Error Messages
Development-friendly error messages that help with debugging (unlike production where errors are generic for security).

## Common Development Tasks

### Adding New Endpoints
1. Add route handler in `index.js`
2. Add authentication middleware if needed
3. Update this README with endpoint documentation

### Database Changes
1. Modify models in `models/` directory
2. Test with existing data
3. Update API documentation

### Authentication Testing
Use tools like Postman or curl with Clerk session tokens:
```bash
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
     http://localhost:5000/api/userchats
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Test connection string
mongosh "your_connection_string"

# Check if MongoDB is running locally
mongo --version
```

### Clerk Authentication Issues
- Verify keys in `.env` file
- Check Clerk dashboard for key validity
- Ensure frontend is sending proper session tokens

### ImageKit Issues
- Verify all three keys (endpoint, public, private)
- Check ImageKit dashboard for usage limits
- Test authentication endpoint: `GET /api/upload`

### Port Conflicts
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

## Development Scripts

```bash
# Development with auto-restart
npm run dev

# Production mode
npm start

# Install dependencies
npm install

# Check for security vulnerabilities
npm audit
```

## Environment Setup Checklist

- [ ] Node.js 20+ installed
- [ ] MongoDB connection string configured
- [ ] Clerk keys added to `.env`
- [ ] ImageKit keys added to `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health endpoint accessible (`GET /api/health`)

## Related Documentation

- [Main README](../README.md) - Full project documentation
- [API Documentation](../API.md) - Complete API reference
- [Setup Guide](../SETUP.md) - Quick setup instructions
- [Troubleshooting](../TROUBLESHOOTING.md) - Common issues and solutions

## Contributing

When contributing to the backend:

1. Follow existing code style
2. Add error handling for new endpoints
3. Update this README if adding new features
4. Test with actual API calls
5. Ensure authentication is properly implemented

## Security Notes

- Never commit `.env` files
- Always validate user input
- Use Clerk middleware for protected endpoints
- Keep dependencies updated
- Follow principle of least privilege for database access
