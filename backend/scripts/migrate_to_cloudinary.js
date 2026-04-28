const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const assets = [
    { name: 'ad_thumb_1', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', resource_type: 'image' },
    { name: 'ad_thumb_2', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80', resource_type: 'image' },
    { name: 'promo_video', url: 'https://vjs.zencdn.net/v/oceans.mp4', resource_type: 'video' },
    { name: 'default_avatar', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dromoney', resource_type: 'image' }
];

async function migrate() {
    console.log('--- Starting Migration to Cloudinary ---');
    const results = {};

    for (const asset of assets) {
        try {
            console.log(`Uploading ${asset.name}...`);
            const result = await cloudinary.uploader.upload(asset.url, {
                public_id: `dromoney/${asset.name}`,
                resource_type: asset.resource_type,
                overwrite: true
            });
            console.log(`Successfully uploaded ${asset.name} -> ${result.secure_url}`);
            results[asset.name] = result.secure_url;
        } catch (error) {
            console.error(`Failed to upload ${asset.name}:`, error.message);
        }
    }

    console.log('\n--- Migration Results ---');
    console.log(JSON.stringify(results, null, 2));
    console.log('\nCopy these URLs and update your code!');
}

migrate();
