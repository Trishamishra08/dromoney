const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new ErrorResponse('Error: Images Only! (jpeg, jpg, png, gif, webp)', 400));
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

exports.uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return next(new ErrorResponse(err.message, 400));
        }

        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        // Return URL (assuming backend runs on localhost:5000 or similar)
        // In production, this should be the full domain or relative path
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            url: fileUrl
        });
    });
};
