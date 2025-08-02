# MyGPT - AI Chat Application (Local Development)

A full-stack AI chat application built with React, Node.js, Express, and Google's Gemini AI. This application provides a ChatGPT-like interface with user authentication, chat history, and image upload capabilities.

**Note: This project is configured for local development only.**

## Features

- 🤖 AI-powered chat interface using Google Gemini AI
- 🔐 User authentication with Clerk
- 💬 Chat history and conversation management
- 📁 Image upload and processing with ImageKit
- 📱 Responsive design
- �️ Easy local development setup

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Clerk React** - Authentication
- **React Query** - Server state management
- **React Markdown** - Markdown rendering
- **PrismJS** - Code syntax highlighting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Clerk SDK** - Authentication middleware
- **ImageKit** - Image processing and storage
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 20 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## API Keys Required

You'll need to obtain the following API keys and service accounts:

### 1. Google Gemini AI API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new project or select an existing one
4. Generate your API key
5. Keep this key secure - you'll add it to your environment variables

### 2. Clerk Authentication
1. Go to [Clerk.com](https://clerk.com/)
2. Create a free account
3. Create a new application
4. Note down your:
   - Publishable Key
   - Secret Key
5. Configure your application settings in the Clerk dashboard

### 3. ImageKit Account
1. Go to [ImageKit.io](https://imagekit.io/)
2. Create a free account
3. Go to the Developer section
4. Note down your:
   - URL Endpoint
   - Public Key
   - Private Key

### 4. MongoDB Database
1. **Option A: MongoDB Atlas (Recommended)**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster
   - Get your connection string

2. **Option B: Local MongoDB**
   - Install MongoDB locally
   - Use connection string: `mongodb://localhost:27017/mygpt`

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd MyGPT-public
```

### 2. Install Dependencies
```bash
npm run install
```
This will install dependencies for both frontend and backend.

### 3. Environment Configuration

#### Backend Environment (.env)
Create a `.env` file in the `backend` directory:

```env
# Port configuration
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

#### Frontend Environment (.env)
Create a `.env` file in the `client` directory:

```env
# Vite requires VITE_ prefix for environment variables
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
```

### 4. Configure Clerk Authentication

1. In your Clerk dashboard, configure the following:
   - **Allowed redirect URLs**: 
     - `http://localhost:5173/*`
     - `http://localhost:3000/*` (if using alternative port)
   - **Sign-in URL**: `/sign-in`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

2. Enable the authentication methods you want (Email, Google, GitHub, etc.)

## Development

### Start Development Servers
```bash
npm run dev
```
This will start both the backend server (port 5000) and frontend development server (port 5173) concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Individual Commands
```bash
# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Lint frontend code
npm run lint

# Clean node_modules
npm run clean
```

## Project Structure

```
MyGPTAI-main/
├── backend/                 # Express.js backend
│   ├── models/             # MongoDB models
│   │   ├── chat.js         # Chat conversation model
│   │   └── userchats.js    # User chat list model
│   ├── index.js            # Main server file
│   └── package.json        # Backend dependencies
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── ai model/       # AI integration
│   │   ├── components/     # React components
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Frontend dependencies
└── package.json            # Root package.json
```

## API Endpoints

### Authentication Required Endpoints
All endpoints require valid Clerk authentication token.

- `GET /api/userchats` - Get user's chat list
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get specific chat
- `PUT /api/chats/:id` - Update chat with new messages

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/upload` - Get ImageKit upload authentication

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB connection string
   - Ensure MongoDB service is running (if using local MongoDB)
   - Check network access in MongoDB Atlas

2. **Clerk Authentication Issues**
   - Verify Clerk keys in environment variables
   - Check allowed redirect URLs in Clerk dashboard
   - Ensure Clerk application is properly configured

3. **Gemini AI API Issues**
   - Verify your Gemini API key
   - Check API quotas and billing in Google AI Studio
   - Ensure the API key has proper permissions

4. **ImageKit Upload Issues**
   - Verify ImageKit credentials
   - Check ImageKit dashboard for usage limits
   - Ensure CORS is properly configured in ImageKit

5. **CORS Issues**
   - Ensure both servers are running on correct ports
   - Restart both servers after changing environment variables
   - Check browser console for specific error messages

### Development Tips

- Use browser developer tools to check console for errors
- Monitor network requests for API call failures
- Check backend logs for server-side errors
- Verify environment variables are loaded correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in local development
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

## Acknowledgments

- Built with Google's Gemini AI
- Authentication powered by Clerk
- Image processing by ImageKit
- UI components and styling inspiration from modern chat applications
