const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Kullanıcı kayıt (register) endpointi
// Yeni kullanıcı oluşturur, giriş için JWT token döner
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Girdi doğrulama
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Lütfen tüm alanları doldurun: isim, e-posta, şifre ve telefon'
      });
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Geçerli bir e-posta adresi girin'
      });
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Şifre en az 6 karakter olmalı'
      });
    }

    // Aynı e-posta ile kayıtlı kullanıcı var mı kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Bu e-posta zaten kayıtlı. Lütfen farklı bir e-posta kullanın veya giriş yapın'
      });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    // MongoDB doğrulama hatası
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz giriş verisi. Lütfen bilgilerinizi kontrol edin.'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Kayıt başarısız. Lütfen daha sonra tekrar deneyin.'
    });
  }
});

// Kullanıcı giriş (login) endpointi
// E-posta ve şifre ile giriş yapar, JWT token döner
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Girdi doğrulama
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Lütfen e-posta ve şifre girin'
      });
    }

    // Kullanıcıyı e-posta ile bul
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Bu e-posta ile kayıtlı hesap bulunamadı. Lütfen e-posta adresinizi kontrol edin veya kayıt olun.'
      });
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Şifre yanlış. Lütfen tekrar deneyin.'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Giriş başarısız. Lütfen daha sonra tekrar deneyin.'
    });
  }
});

// Giriş yapan kullanıcının bilgilerini getirir
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı bilgileri getirilirken hata oluştu', error: error.message });
  }
});

module.exports = router; 