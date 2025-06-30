const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Cloudinary URL'sinden Public ID'yi çıkartan yardımcı fonksiyon
// url: Cloudinary'den dönen resim URL'si
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    try {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        // Public ID, versiyondan sonraki yolun uzantısız hali
        // Örn: v123456/folder/image.jpg -> folder/image
        const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        return publicId;
    } catch (error) {
        console.error('Failed to extract public ID from URL:', url, error);
        return null;
    }
};

// --- ROUTING ORDER FIX ---
// Daha spesifik rotalar, dinamik rotalardan önce gelmeli

// Son eklenen 8 hayvanı getirir
router.get('/recent', async (req, res) => {
  try {
    const pets = await Pet.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Son eklenen hayvanlar getirilirken hata oluştu', error: error.message });
  }
});

// Rastgele 6 öne çıkan hayvanı getirir
router.get('/featured', async (req, res) => {
  try {
    const pets = await Pet.aggregate([
      { $sample: { size: 6 } }
    ]);
    // Sahip bilgisini doldur
    const populatedPets = await Pet.populate(pets, {
      path: 'owner',
      select: 'name email phone'
    });
    res.json(populatedPets);
  } catch (error) {
    res.status(500).json({ message: 'Öne çıkan hayvanlar getirilirken hata oluştu', error: error.message });
  }
});

// Aynı türden (kendisi hariç) ilgili hayvanları getirir
router.get('/related/:id', async (req, res) => {
  try {
    const currentPet = await Pet.findById(req.params.id);
    if (!currentPet) {
      return res.status(404).json({ message: 'İlgili hayvan bulunamadı' });
    }
    const relatedPets = await Pet.find({
      type: currentPet.type, // Aynı türdeki hayvanlar
      _id: { $ne: req.params.id } // Kendisi hariç
    })
    .limit(10)
    .populate('owner', 'name email phone'); 
    res.json(relatedPets);
  } catch (error) {
    res.status(500).json({ message: 'İlgili hayvanlar getirilirken hata oluştu', error: error.message });
  }
});

// Kullanıcının kendi ilanlarını getirir (my-listings endpoint)
router.get('/my-listings', auth, async (req, res) => {
  try {
    console.log('Kendi ilanlarım çekiliyor, kullanıcı:', req.user._id);
    const pets = await Pet.find({ owner: req.user._id })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    console.log('Bulunan ilan sayısı:', pets.length);
    res.json(pets);
  } catch (error) {
    console.error('my-listings hatası:', error);
    res.status(500).json({ message: 'Kullanıcı ilanları getirilirken hata oluştu', error: error.message });
  }
});

// Tüm hayvanları opsiyonel filtrelerle getirir (arama)
router.get('/search', async (req, res) => {
  try {
    // Sorgu parametrelerinden filtreleri al
    const { type, age, size, search, location, gender } = req.query;
    const filter = {};

    // Tür filtresi uygula
    if (type) {
      const types = type.split(',');
      if (types.length > 0) {
        filter.type = { $in: types };
      }
    }
    // Cinsiyet filtresi uygula
    if (gender) {
      const genders = gender.split(',');
      if (genders.length > 0) {
        // Büyük/küçük harf duyarsız arama
        const genderRegex = genders.map(g => new RegExp(`^${g}$`, 'i'));
        filter.gender = { $in: genderRegex };
      }
    }
    // Boyut filtresi
    if (size) filter.size = size;
    // Konum filtresi
    if (location) {
        filter.location = { $regex: `^${location}$`, $options: 'i' };
    }
    // Yaş filtresi
    if (age) {
      if (age === 'puppy') filter.age = { $lte: 1 };
      if (age === 'young') filter.age = { $gte: 1, $lte: 3 };
      if (age === 'adult') filter.age = { $gte: 3, $lte: 7 };
      if (age === 'senior') filter.age = { $gte: 7 };
    }
    // Arama kelimesi ile isim, ırk veya açıklama araması
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    // Filtreye göre hayvanları getir
    const pets = await Pet.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Hayvanlar getirilirken hata oluştu', error: error.message });
  }
});

// Yeni hayvan oluşturur, resim yükler
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Yeni hayvan oluşturuluyor:', req.body);
    console.log('Yüklenen dosyalar:', req.files);
    // Yüklenen resimlerin yollarını al
    const imageUrls = req.files ? req.files.map(file => file.path || file.url) : [];
    console.log('Resim URLleri:', imageUrls);
    // Yeni hayvan nesnesi oluştur
    const pet = new Pet({
      ...req.body,
      images: imageUrls,
      owner: req.user._id
    });
    console.log('Kaydedilecek hayvan:', pet);
    await pet.save();
    console.log('Hayvan başarıyla kaydedildi');
    res.status(201).json(pet);
  } catch (error) {
    console.error('Hayvan oluşturma hatası:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Hayvan oluşturulurken hata oluştu', error: error.message });
  }
});

// ID ile tek bir hayvanı getirir (diğer GET rotalarından sonra olmalı)
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner', 'name email phone');
    if (!pet) {
      return res.status(404).json({ message: 'Hayvan bulunamadı' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Hayvan getirilirken hata oluştu', error: error.message });
  }
});

// Hayvanı günceller, yeni resim yükler
router.put('/:id', auth, upload.array('newImages', 5), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Hayvan bulunamadı' });
    }
    // Sadece sahibi güncelleyebilir
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu hayvanı güncelleme yetkiniz yok' });
    }
    // Yeni resimler eklenmişse işle
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = req.files.map(file => file.path || file.url);
      pet.images = [...pet.images, ...newImageUrls];
    }
    // Diğer alanları güncelle
    Object.assign(pet, req.body);
    await pet.save();
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Hayvan güncellenirken hata oluştu', error: error.message });
  }
});

// Hayvanı siler (ve Cloudinary'den resimleri kaldırır)
router.delete('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Hayvan bulunamadı' });
    }
    // Sadece sahibi silebilir
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu hayvanı silme yetkiniz yok' });
    }
    // Cloudinary'den resimleri sil
    for (const imageUrl of pet.images) {
      const publicId = getPublicIdFromUrl(imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn('Cloudinary silme hatası:', err.message);
        }
      }
    }
    await pet.deleteOne();
    res.json({ message: 'Hayvan ve resimleri başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Hayvan silinirken hata oluştu', error: error.message });
  }
});

module.exports = router; 