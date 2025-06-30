const mongoose = require('mongoose');

// Hayvan (Pet) şeması: ilan bilgileri, sahip, resimler vb.
const petSchema = new mongoose.Schema({
  // Hayvanın adı
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Tür (köpek, kedi, kuş, diğer)
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'other']
  },
  // Irk bilgisi
  breed: {
    type: String,
    trim: true
  },
  // Yaş (yıl olarak)
  age: {
    type: Number,
    required: true,
    min: 0
  },
  // Cinsiyet
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  // Boyut
  size: {
    type: String,
    enum: ['small', 'medium', 'large']
  },
  // Açıklama
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Konum (şehir vb.)
  location: {
    type: String,
    required: true,
    trim: true
  },
  // Resim URL'leri
  images: [{
    type: String,
    required: false
  }],
  // İlan durumu
  status: {
    type: String,
    enum: ['available', 'adopted', 'pending'],
    default: 'available'
  },
  // İlan sahibi (User referansı)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Oluşturulma tarihi
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Son güncellenme tarihi
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Kaydetmeden önce updatedAt alanını güncelle
petSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet; 