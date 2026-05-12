const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dncw1hfix',
  api_key: process.env.CLOUDINARY_API_KEY || '815112221921759',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'io9bbDuRyDZ0Sd1C2fy2sCP4YmI',
});

module.exports = cloudinary;
