const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const { auth, adminAuth } = require('../middleware/auth');

// Kullanıcı profilini getirir
// Giriş yapan kullanıcının profil bilgilerini ve kaydedilen ilanlarını döner
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedPets');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profil bilgileri getirilirken hata oluştu', error: error.message });
  }
});

// Kullanıcı profilini günceller
// İsim, e-posta, telefon ve şifre değişikliği yapılabilir
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    // Temel bilgileri güncelle
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    // Şifre değişikliği isteniyorsa kontrol et
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Şifre değiştirmek için mevcut şifre gerekli' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mevcut şifre yanlış' });
      }
      user.password = newPassword;
    }
    const updatedUser = await user.save();
    // Kaydedilen ilanları da doldur
    await updatedUser.populate('savedPets');
    // Şifreyi response'dan çıkar
    updatedUser.password = undefined;
    res.json(updatedUser);
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    if (error.code === 11000) { // E-posta çakışma hatası
        return res.status(400).json({ message: 'Bu e-posta zaten kullanımda.' });
    }
    res.status(500).json({ message: 'Profil güncellenirken hata oluştu', error: error.message });
  }
});

// Kullanıcının kendi ilanlarını getirir
router.get('/pets', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı ilanları getirilirken hata oluştu', error: error.message });
  }
});

// Kullanıcının kaydedilen ilanlarını ekler/çıkarır (toggle)
router.post('/saved-pets/:petId', auth, async (req, res) => {
  try {
    const petId = req.params.petId;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    // Eğer zaten kaydedildiyse çıkar, değilse ekle
    const petIndex = user.savedPets.indexOf(petId);
    if (petIndex > -1) {
      // Kayıtlıysa çıkar
      user.savedPets.splice(petIndex, 1);
    } else {
      // Kayıtlı değilse ekle
      user.savedPets.push(petId);
    }
    await user.save();
    // Kaydedilen ilanları doldur
    await user.populate('savedPets');
    res.json(user.savedPets);
  } catch (error) {
    console.error('Kaydedilen ilan güncelleme hatası:', error);
    res.status(500).json({ message: 'Kaydedilen ilanlar güncellenirken hata oluştu', error: error.message });
  }
});

// Admin: Tüm kullanıcıları getirir
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar getirilirken hata oluştu', error: error.message });
  }
});

// Admin: Kullanıcıyı siler (ve tüm ilanlarını da siler)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    // Kullanıcıya ait tüm ilanları sil
    await Pet.deleteMany({ owner: user._id });
    // Kullanıcıyı sil
    await user.deleteOne();
    res.json({ message: 'Kullanıcı ve ilanları başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı silinirken hata oluştu', error: error.message });
  }
});

module.exports = router; 