const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

// Use Memory Storage for compatibility with platforms like Render
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|heic|heif|svg|bmp|tiff|jfif|pjpeg|pjp|avif)$/i;
  const isImageExt = imageExtensions.test(path.extname(file.originalname).toLowerCase());

  if (isImageMime || isImageExt) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Error: Please upload a valid image file (JPEG, JPG, PNG, GIF, WEBP, HEIC, HEIF, AVIF, SVG, BMP, JFIF, etc.)', 400));
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
