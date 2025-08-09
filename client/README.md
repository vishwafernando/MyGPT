# MyGPT Frontend

This is the React-based frontend for the MyGPT AI chat app. It is designed for local development only.

## Features

- Gemini AI chat interface (Google Gemini API)
- Clerk authentication (sign up, sign in, user management)
- Chat history sidebar and conversation management
- Image upload via ImageKit
- Responsive design (mobile and desktop)
- React Query for server state
- React Router for navigation

## Environment Variables

Create a `.env` file in this directory (never commit real keys):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
VITE_API_URL=http://localhost:5000
```

## Development

```bash
# Install dependencies
npm install

# Start development server (localhost:5173)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

The frontend reads the API base URL from `VITE_API_URL` (defaults to `http://localhost:5000` during development via your `.env`).

## Project Structure

```
src/
├── ai model/           # Gemini AI integration
├── components/         # Reusable components
│   ├── chatlist/      # Chat history sidebar
│   ├── common/        # Common utilities
│   ├── newprompt/     # Chat input component
│   └── upload/        # File upload component
├── layouts/           # Layout components
├── pages/             # Page components
├── index.css          # Global styles
└── main.jsx           # App entry point
```

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Run ESLint

## Troubleshooting

- If the frontend doesn't load, check your `.env` and API keys
- Make sure the backend is running on http://localhost:5000
- Check browser console for errors

## License

MIT License