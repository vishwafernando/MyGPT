
# MyGPT - AI Chat Application (Local Development)

MyGPT is a full-stack AI chat app built for local development. It features:

- AI-powered chat using Google Gemini
- Secure user authentication with Clerk
- Chat history and conversation management
- Image upload and processing via ImageKit
- Responsive, modern UI
- Easy local setup and development

**Note:** This project is designed for local use only. No production domain or secrets are included. All configuration is via environment variables.

## Tech Stack

**Frontend:** React 19, Vite, React Router DOM, Clerk React, React Query, React Markdown, PrismJS
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Clerk SDK, ImageKit, dotenv, CORS, Helmet

## Prerequisites

- Node.js (v20+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Environment Variables

All API keys and credentials are loaded from `.env` files. Never commit real secrets. Provide `.env.example` files for both client and backend.

**Backend (`backend/.env`):**
```
PORT=5000
MONGO_URL=your_mongodb_connection_string
IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`):**
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
VITE_API_URL=http://localhost:5000
```

## Setup & Usage


1. **Clone the repo:**
   ```bash
   git clone <your-repository-url>
   cd MyGPT-public
   ```
2. **Install dependencies:**
   ```bash
   npm run install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` in both `client` and `backend` folders
   - Add your API keys and credentials
4. **Install concurrently (already configured in root devDependencies):**
   - Skipped unless you removed it.
5. **Run development servers:**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## API Endpoints

**Public:**
- `GET /api/health` — Health check
- `GET /api/upload` — Get ImageKit upload authentication

**Protected (Clerk token required):**
- `GET /api/userchats` — Get user's chat list
- `POST /api/chats` — Create new chat
- `GET /api/chats/:id` — Get specific chat
- `PUT /api/chats/:id` — Update chat with new messages

## Project Structure

```
MyGPT-public/
├── backend/                 # Express.js backend
│   ├── models/             # MongoDB models
│   │   ├── chat.js         # Chat conversation model
│   │   └── userchats.js    # User chat list model
│   ├── index.js            # Main server file
│   └── package.json        # Backend dependencies
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── ai model/       # Gemini AI integration
│   │   ├── components/     # React components
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js      # Vite config
│   └── package.json        # Frontend dependencies
└── package.json            # Root dependencies
```

## Troubleshooting

- **MongoDB:** Check connection string, service status, Atlas network access
- **Clerk:** Verify keys, redirect URLs, dashboard config
- **Gemini API:** Check key, quotas, permissions
- **ImageKit:** Check credentials, dashboard, CORS
- **CORS:** Ensure both servers run on correct ports, restart after env changes

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

## License

MIT License

## Support

If you have issues, check troubleshooting, search issues, or open a new issue with details.

## Acknowledgments

- Gemini AI by Google
- Clerk authentication
- ImageKit for uploads
