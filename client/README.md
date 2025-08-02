# MyGPT Frontend

React-based frontend for the MyGPT AI chat application.

## Features

- Modern React 19 with Vite for fast development
- Clerk authentication integration
- Google Gemini AI chat interface
- ImageKit integration for file uploads
- Responsive design with custom CSS
- React Router for navigation
- React Query for server state management

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file in this directory with:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
```

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

The development server runs on http://localhost:5173 and proxies API requests to http://localhost:5000.