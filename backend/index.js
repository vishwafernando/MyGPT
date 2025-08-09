import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userchats.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT;
const app = express();

app.set('trust proxy', true);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Checking environment variables...');
const requiredEnvVars = ['MONGO_URL', 'IMAGE_KIT_ENDPOINT', 'IMAGE_KIT_PUBLIC_KEY', 'IMAGE_KIT_PRIVATE_KEY', 'CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'];
const optionalEnvVars = ['CLIENT_URL', 'GEMINI_API_KEY', 'STABILITY_API_KEY']; 

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

console.log('🔐 Configuring Clerk authentication...');

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
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
app.use(clerkMiddleware());

console.log('🔐 Clerk Express middleware configured');

app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()}: ${req.method} ${req.url}`);
  console.log(`🌐 Host: ${req.get('host')}`);
  console.log(`🔗 Origin: ${req.get('origin') || 'none'}`);
  console.log(`👤 User-Agent: ${req.get('user-agent')?.substring(0, 50)}...`);
  console.log(`🔒 Protocol: ${req.protocol}`);
  console.log(`🔐 Secure: ${req.secure}`);
  console.log(`🌐 X-Forwarded-Proto: ${req.get('x-forwarded-proto')}`);
  
  if (req.get('cf-ray')) {
    console.log(`☁️ Cloudflare Ray ID: ${req.get('cf-ray')}`);
    console.log(`🌍 CF Country: ${req.get('cf-ipcountry')}`);
    console.log(`📡 CF Connecting IP: ${req.get('cf-connecting-ip')}`);
  }
  
  next();
});

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && 
      !req.secure && 
      req.get('x-forwarded-proto') !== 'https' &&
      !req.url.startsWith('/api/health')) { 
    console.log(`🔄 Redirecting to HTTPS: ${req.url}`);
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
});

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

async function checkColabHealth(apiUrl) {
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      timeout: 10000 
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function waitForColabReady(apiUrl, maxWaitTime = 180000) { 
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const isHealthy = await checkColabHealth(apiUrl);
    if (isHealthy) {
      return true;
    }
    console.log('⏳ Waiting for Colab API to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
  }
  
  return false;
}

app.post("/api/generate-image", requireAuth(), async (req, res) => {
  const { prompt, guidance_scale = 7.5, width = 1024, height = 1024 } = req.body;
  const userId = req.auth.userId;

  try {
    console.log(`🎨 Generating image with Cloudflare Workers AI for user ${userId} with prompt: ${prompt}`);

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_AI_API_TOKEN;
    if (!accountId || !apiToken) {
      return res.json({
        success: false,
        message: "Cloudflare AI credentials not configured.",
        error: "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_AI_API_TOKEN"
      });
    }

    const cfEndpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`;

    const payload = {
      prompt
      // 
    };

    const cfResponse = await fetch(cfEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`
      },
      body: JSON.stringify(payload),
      timeout: 120000
    });

    if (!cfResponse.ok) {
      throw new Error(`Cloudflare AI returned ${cfResponse.status}: ${cfResponse.statusText}`);
    }

    const contentType = cfResponse.headers.get("content-type");
    let imageBuffer;
    if (contentType && contentType.includes("application/json")) {
      const cfResult = await cfResponse.json();
      if (cfResult.result && cfResult.result.base64) {
        imageBuffer = Buffer.from(cfResult.result.base64, "base64");
      } else {
        throw new Error("Cloudflare AI did not return a valid image");
      }
    } else if (contentType && contentType.includes("image/png")) {
      imageBuffer = Buffer.from(await cfResponse.arrayBuffer());
    } else {
      throw new Error(`Unexpected Cloudflare response type: ${contentType}`);
    }

    const uploadResult = await imagekit.upload({
      file: imageBuffer,
      fileName: `cf-sdxl-generated-${Date.now()}.png`,
      folder: "/ai-generated/cf-sdxl/",
      useUniqueFileName: true
    });

    console.log("✅ Cloudflare SDXL image uploaded to ImageKit:", uploadResult.filePath);

    res.json({
      success: true,
      imagePath: uploadResult.filePath,
      imageUrl: uploadResult.url,
      modelUsed: "cloudflare-stable-diffusion-xl-base-1.0",
      prompt,
      guidance_scale,
      dimensions: { width, height }
    });
  } catch (error) {
    console.error("❌ Cloudflare image generation error:", error);
    console.error("❌ Error details:", error.message);
    res.json({
      success: false,
      message: `An error occurred during Cloudflare image generation: ${error.message}`,
      originalPrompt: prompt,
      error: error.message
    });
  }
});

app.post("/api/chats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;
    const username = user.username;

    const newChat = new Chat({
      userId: userId,
      email,
      username,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    const userChats = await UserChats.find({ userId: userId });
    if (!userChats.length) {
      const newUserChat = new UserChats({
        userId: userId,
        email,
        username,
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

app.get("/api/userchats", requireAuth(), async (req, res) => {
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

app.get("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching user chat");
  }
});

app.put("/api/chats/:id", requireAuth(), async (req, res) => {
  const { question, answer, img, aiGeneratedImg, modelUsed } = req.body;
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
      newItems.push({ 
        role: "user", 
        parts: [{ text: question }], 
        ...(img && { img }),
        ...(modelUsed && { modelUsed })
      });
    }
    
    newItems.push({ 
      role: "model", 
      parts: [{ text: answer }], 
      ...(aiGeneratedImg && { aiImg: aiGeneratedImg }),
      ...(modelUsed && { modelUsed })
    });

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

app.get("/api/health", (req, res) => {
  console.log('Health check requested from:', req.ip);
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    domain: process.env.CLIENT_URL || 'localhost',
    port: port,
    server: 'MyGPT Backend',
    version: '1.0.0'
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    console.log('Serving React app for path:', req.path);
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

app.use((error, req, res, next) => {
  console.error('Error occurred:', error.message);
  console.error('Stack:', error.stack);
  
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS policy violation', 
      message: 'Origin not allowed',
      origin: req.headers.origin 
    });
  }
  
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message 
  });
});

app.listen(port, () => {
  connect();
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.CLIENT_URL) {
      console.log(`🔗 CORS allowed origin from CLIENT_URL: ${process.env.CLIENT_URL}`);
    }
    if (process.env.NODE_ENV === 'production') {
      console.log(`📁 Serving static files from: ${path.join(__dirname, "../client/dist")}`);
      console.log(`🌐 Deployment URL: http://localhost:${port}`);
    }
});