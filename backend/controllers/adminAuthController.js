const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// @desc    Admin Login
// @route   POST /api/admin/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    try {
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            console.log(`Login Failed: Admin with email ${email} not found`);
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            console.log(`Login Failed: Password mismatch for ${email}`);
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Create token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in admin
// @route   GET /api/admin/auth/me
// @access  Private (Admin)
exports.getMe = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (err) {
        next(err);
    }
};
