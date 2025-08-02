import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userchats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT;
const app = express();

// Trust Cloudflare proxy for correct IP detection and HTTPS headers
app.set('trust proxy', true);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Checking environment variables...');
const requiredEnvVars = ['MONGO_URL', 'IMAGE_KIT_ENDPOINT', 'IMAGE_KIT_PUBLIC_KEY', 'IMAGE_KIT_PRIVATE_KEY'];
const optionalEnvVars = ['CLIENT_URL', 'GEMINI_API_KEY']; // CLIENT_URL is now optional

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  } else {
    console.log(`✅ ${envVar} is set`);
  }
}

for (const envVar of optionalEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`⚠️  ${envVar} is not set (optional)`);
  }
}

// CORS configuration for local development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',            // Vite dev server
      'http://localhost:3000',            // Alternative dev server
      'http://localhost:3001',            // Another alternative
      'http://localhost'                  // Local access
    ];
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed for:', origin);
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware to log requests (development only)
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()}: ${req.method} ${req.url}`);
  console.log(`🌐 Origin: ${req.get('origin') || 'none'}`);
  next();
});

// Remove production HTTPS redirect middleware - not needed for local development

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    const userChats = await UserChats.find({ userId: userId });
    if (!userChats.length) {
      const newUserChat = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
            createdAt: savedChat.createdAt,
          },
        ],
      });
      await newUserChat.save();
    } else {
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
              createdAt: savedChat.createdAt,
            },
          },
        }
      );
    }
    res.status(201).send(newChat._id);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId: userId });
    if (userChats.length && userChats[0].chats) {
      res.status(200).send(userChats[0].chats);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching user chats");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching user chat");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const { question, answer, img } = req.body;
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    let newItems = [];
    if (
      question &&
      (!chat.history.length ||
        chat.history[chat.history.length - 1].role !== "user" ||
        chat.history[chat.history.length - 1].parts[0].text !== question)
    ) {
      newItems.push({ role: "user", parts: [{ text: question }], ...(img && { img }) });
    }
    newItems.push({ role: "model", parts: [{ text: answer }] });

    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId: userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding user chat");
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log('Health check requested from:', req.ip);
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development',
    port: port,
    server: 'MyGPT Backend (Local Development)',
    version: '1.0.0'
  });
});

// Remove production static file serving - not needed for local development
// In local development, Vite serves the frontend separately

app.use((error, req, res, next) => {
  console.error('Error occurred:', error.message);
  console.error('Stack:', error.stack);
  
  // Handle CORS errors specifically
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS policy violation', 
      message: 'Origin not allowed',
      origin: req.headers.origin 
    });
  }
  
  // Handle other types of errors
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Default error response
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message // Show error details in local development
  });
});

app.listen(port, () => {
  connect();
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Local development mode`);
  console.log(`🔗 Frontend should run on: http://localhost:5173`);
  console.log(`� Backend API available at: http://localhost:${port}`);
});