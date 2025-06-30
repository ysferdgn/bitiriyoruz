const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary yapılandırması (çevre değişkenlerinden)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary üzerinde resim depolama ayarları
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'petadopt', // Klasör adı
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // İzin verilen formatlar
    transformation: [{ width: 800, height: 800, crop: 'fill' }], // Boyutlandırma
  },
});

// Sadece resim dosyalarına izin veren filtre
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Sadece resim dosyalarına izin verilir!';
    return cb(new Error('Sadece resim dosyalarına izin verilir!'), false);
  }
  cb(null, true);
};

// Multer ile upload middleware'i
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Maksimum dosya boyutu: 5MB
  }
});

module.exports = upload; 