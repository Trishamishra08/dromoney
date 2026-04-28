const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to local file
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' or 'video'
 */
exports.uploadToCloudinary = async (filePath, folder, resourceType = 'auto') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `dromoney/${folder}`,
            resource_type: resourceType
        });
        
        // Remove file from local storage after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        // Clean up even if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
exports.removeFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
