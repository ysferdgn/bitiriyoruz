require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const userRoutes = require('./routes/users');
const aiChatRoutes = require('./routes/aiChat');
const conversationRoutes = require('./routes/conversations');

// Create Express app
const app = express();

console.log('🚀 Backend server is starting...');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('📁 Created uploads directory');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env file');
  process.exit(1);
}

console.log('🔌 Connecting to MongoDB Atlas...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully!');
  console.log('📊 Database: cluster0.valr7id.mongodb.net');
})
.catch(err => {
  console.log('❌ MongoDB connection failed!');
  console.error('Error details:', err.message);
  process.exit(1);
});

// Add mongoose debug logging
mongoose.set('debug', true);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/ai', aiChatRoutes);
app.use('/api/conversations', conversationRoutes);

console.log('📡 API Routes loaded successfully');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    details: err.message 
  });
});

// Handle 404 routes
app.use((req, res) => {
  console.log('⚠️  404 - Route not found:', req.url);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

// 3. Socket.IO için http sunucusu oluştur
const server = http.createServer(app); 

// 4. Socket.IO sunucusunu başlat ve CORS ayarlarını yap
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5001", // React app'in adresi
    methods: ["GET", "POST"]
  }
});

// 5. Bir kullanıcı bağlandığında çalışacak kod
io.on("connection", (socket) => {
  console.log(`🔌 WebSocket: User connected - ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 WebSocket: User disconnected - ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log('🎉 Server is running successfully!');
  console.log('📍 Port:', PORT);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 API Base URL: http://localhost:' + PORT);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}); 