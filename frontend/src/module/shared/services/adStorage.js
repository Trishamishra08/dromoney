const ADS_KEY = 'dromoney_watch_earn_ads';

export const adStorage = {
    // Save a new ad
    saveAd: (data) => {
        const ads = adStorage.getAds();
        const newAd = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            ...data
        };
        ads.unshift(newAd);
        localStorage.setItem(ADS_KEY, JSON.stringify(ads));
        return newAd;
    },

    // Get all ads
    getAds: () => {
        const saved = localStorage.getItem(ADS_KEY);
        if (!saved) {
            // Initial default ads
            const defaults = [
                { id: '1', title: 'Summer Sale Promo', coins: 50, duration: 30, thumbnail: 'https://res.cloudinary.com/dncw1hfix/image/upload/v1776323211/dromoney/ad_thumb_1.jpg', videoUrl: 'https://res.cloudinary.com/dncw1hfix/video/upload/v1776323214/dromoney/promo_video.mp4' },
                { id: '2', title: 'New App Launch', coins: 40, duration: 15, thumbnail: 'https://res.cloudinary.com/dncw1hfix/image/upload/v1776323212/dromoney/ad_thumb_2.jpg', videoUrl: 'https://res.cloudinary.com/dncw1hfix/video/upload/v1776323214/dromoney/promo_video.mp4' }
            ];
            localStorage.setItem(ADS_KEY, JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(saved);
    },

    // Delete an ad
    deleteAd: (id) => {
        const ads = adStorage.getAds();
        const updated = ads.filter(a => a.id !== id);
        localStorage.setItem(ADS_KEY, JSON.stringify(updated));
    },

    // Get a single ad
    getAdById: (id) => {
        const ads = adStorage.getAds();
        return ads.find(a => a.id === id);
    },

    // Update an ad
    updateAd: (id, updates) => {
        const ads = adStorage.getAds();
        const updated = ads.map(a => a.id === id ? { ...a, ...updates } : a);
        localStorage.setItem(ADS_KEY, JSON.stringify(updated));
        return updated.find(a => a.id === id);
    }
};
