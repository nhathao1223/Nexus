const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại (chỉ cho local development)
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads/products' : 'uploads/products';

if (process.env.NODE_ENV !== 'production' && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local storage (development)
const localStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Chọn storage dựa trên environment và có Cloudinary config không
let storage = localStorage;

// Chỉ import Cloudinary nếu có đầy đủ config
if (process.env.NODE_ENV === 'production' && 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  try {
    const { storage: cloudinaryStorage } = require('../config/cloudinary');
    storage = cloudinaryStorage;
    console.log('Using Cloudinary storage for production');
  } catch (error) {
    console.warn('Cloudinary not configured, using local storage:', error.message);
  }
} else {
  console.log('Using local storage');
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;
