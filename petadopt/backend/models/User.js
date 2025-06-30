const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Kullanıcı şeması: kullanıcı bilgileri, şifre, rol, kaydedilen ilanlar vb.
const userSchema = new mongoose.Schema({
  // Kullanıcının adı
  name: {
    type: String,
    required: [true, 'Lütfen isim girin'],
    trim: true,
  },
  // E-posta adresi (benzersiz ve zorunlu)
  email: {
    type: String,
    required: [true, 'Lütfen e-posta girin'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Geçerli bir e-posta adresi girin',
    ],
  },
  // Şifre (hashlenmiş olarak tutulur)
  password: {
    type: String,
    required: [true, 'Lütfen şifre girin'],
    minlength: 6,
    select: false, // Varsayılan olarak şifre response'larda gönderilmez
  },
  // Telefon numarası
  phone: {
    type: String,
    trim: true,
  },
  // Kullanıcı rolü (user/admin)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // Kaydedilen ilanlar (Pet referansları)
  savedPets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  }],
  // Oluşturulma tarihi
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Şifreyi kaydetmeden önce hashle
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Girilen şifreyi hashlenmiş şifreyle karşılaştıran yardımcı fonksiyon
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 