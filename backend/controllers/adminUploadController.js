const { uploadToCloudinary } = require('../utils/cloudinaryHelper');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Local storage for temporary processing
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/temp';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for videos
});

exports.uploadToCloud = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const folder = resourceType === 'video' ? 'videos' : 'images';

    const result = await uploadToCloudinary(req.file.path, folder, resourceType);

    if (!result.success) {
        return next(new ErrorResponse(result.error, 500));
    }

    res.status(200).json({
        success: true,
        url: result.url,
        publicId: result.publicId
    });
});

exports.uploadMiddleware = upload.single('file');
