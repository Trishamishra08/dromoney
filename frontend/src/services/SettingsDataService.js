import api from '../module/shared/services/api';

export const SettingsDataService = {
    getSettings: async () => {
        try {
            const response = await api.get('/admin/settings');
            return response.data;
        } catch (err) {
            console.error('Error fetching settings:', err);
            return null;
        }
    },

    saveSettings: async (newSettings) => {
        try {
            const response = await api.put('/admin/settings', newSettings);
            return response.data;
        } catch (err) {
            console.error('Error saving settings:', err);
            throw err;
        }
    }
};
