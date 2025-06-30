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

// Express uygulamasını oluştur
const app = express();

console.log('🚀 Backend server is starting...');

// uploads klasörü yoksa oluştur (resim yüklemeleri için)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('📁 Created uploads directory');
}

// Temel middleware'ler
app.use(cors()); // CORS desteği
app.use(express.json()); // JSON gövde desteği
app.use(express.urlencoded({ extended: true })); // URL-encoded gövde desteği

// İstek loglama middleware'i
app.use((req, res, next) => {
  // Her isteği zaman, metod ve URL ile logla
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// uploads klasörünü statik olarak sun
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB bağlantı adresini al
const MONGODB_URI = process.env.MONGO_URI;

// Bağlantı adresi yoksa uygulamayı durdur
if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env file');
  process.exit(1);
}

console.log('🔌 Connecting to MongoDB Atlas...');

// MongoDB Atlas'a bağlan
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

// Mongoose sorgularını logla (debug amaçlı)
mongoose.set('debug', true);

// API route'larını tanımla
app.use('/api/auth', authRoutes); // Kimlik doğrulama
app.use('/api/users', userRoutes); // Kullanıcı işlemleri
app.use('/api/pets', petRoutes); // Hayvan işlemleri
app.use('/api/ai', aiChatRoutes); // AI sohbet
app.use('/api/conversations', conversationRoutes); // Mesajlaşma

console.log('📡 API Routes loaded successfully');

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
  // Sunucu hatalarını logla ve standart bir hata mesajı döndür
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Bir hata oluştu!',
    details: err.message 
  });
});

// 404 - Bulunamayan route'lar için middleware
app.use((req, res) => {
  console.log('⚠️  404 - Route not found:', req.url);
  res.status(404).json({ message: 'Route not found' });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;

// Socket.IO için http sunucusu oluştur
const server = http.createServer(app); 

// Socket.IO sunucusunu başlat ve CORS ayarlarını yap
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5001", // React app'in adresi
    methods: ["GET", "POST"]
  }
});

// WebSocket bağlantılarını dinle
io.on("connection", (socket) => {
  console.log(`🔌 WebSocket: User connected - ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 WebSocket: User disconnected - ${socket.id}`);
  });
});

// Sunucuyu dinlemeye başla
server.listen(PORT, () => {
  console.log('🎉 Server is running successfully!');
  console.log('📍 Port:', PORT);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 API Base URL: http://localhost:' + PORT);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}); 