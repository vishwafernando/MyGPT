
# MyGPT — AI Chat Application 

A full‑stack AI chat application for local development.

## Features
- AI chat via Google Gemini
- Clerk authentication (sign-in/sign-up, user session)
- Chat history and conversation management
- Image upload with ImageKit
- Modern, responsive UI

**Note**: This repo is dev‑focused. No production domains or secrets are included. Configure via environment variables.

## Tech Stack
**Frontend:** React 19, Vite, React Router DOM, Clerk React, React Query, React Markdown, PrismJS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Clerk SDK, ImageKit, dotenv, CORS, Helmet

## Prerequisites

- Node.js (v20+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Environment Variables
All keys are loaded from `.env` files. Use the provided examples:

- `backend/env.example` → copy to `backend/.env`
- `client/env.example` → copy to `client/.env`

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

## Quick Start
1. **Clone the repo:**
   ```bash
   git clone https://github.com/vishwafernando/MyGPT.git
   cd MyGPT-main
   ```
2. **Install dependencies:**
   ```bash
   npm run install
   ```
3. **Configure environment:**
   - Copy `backend/env.example` → `backend/.env`
   - Copy `client/env.example` → `client/.env`
   - Fill in your keys and URLs
4. **Run dev servers:**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Scripts
- `npm run install` — Install backend and frontend deps
- `npm run dev` — Run backend (5000) and frontend (5173) together
- `npm run build` — Build frontend (
  outputs to `client/dist`)
- `npm start` — Start backend only (requires `backend/.env`)
- `npm run deploy` — Build and start via PM2 using `ecosystem.config.json`

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
MyGPT-main/
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

## Docs & Troubleshooting
- API reference: see `API.md`
- Troubleshooting: see `TROUBLESHOOTING.md`

Common tips:
- **MongoDB:** Check connection string(add the db username and password when using mongodb atlas link), service status, Atlas network access
- **Clerk:** verify keys, allowed redirect URLs, and paths in clerk dashboard
- **Gemini:** Check API key, quotas, permissions
- **ImageKit:** verify endpoint and keys, credentials, imagekit.io dashboard and CORS
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
- Cloudflare workers AI 
