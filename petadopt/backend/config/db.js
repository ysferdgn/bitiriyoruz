const mongoose = require('mongoose');

// MongoDB bağlantısı kuran yardımcı fonksiyon
const connectDB = async () => {
  try {
    // Bağlantı adresini ortam değişkeninden veya localden al
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petadopt', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Bağlantı başarılıysa logla
    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    // Hata olursa logla ve uygulamayı durdur
    console.error(`MongoDB Bağlantı Hatası: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 