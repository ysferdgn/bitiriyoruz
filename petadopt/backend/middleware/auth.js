const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kullanıcı doğrulama middleware'i
// JWT token'ı kontrol eder, kullanıcıyı bulur ve req.user'a ekler
const auth = async (req, res, next) => {
  try {
    // Header'dan token'ı al
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token yok, yetkilendirme reddedildi' });
    }
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Kullanıcıyı bul
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token geçersiz' });
    }
    // Kullanıcıyı request objesine ekle
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token geçersiz' });
  }
};

// Admin yetkisi kontrolü middleware'i
// Sadece admin rolüne sahip kullanıcılar devam edebilir
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin yetkisi gerekli' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Lütfen giriş yapın' });
  }
};

module.exports = { auth, adminAuth }; 