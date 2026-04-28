import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import api from '../../shared/services/api';

const AdminContext = React.createContext();

export const AdminProvider = ({ children }) => {
    const [adminData, setAdminData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('dromoney_admin_token'));

    useEffect(() => {
        if (isAuthenticated) {
            refreshAdminProfile();
            fetchDashboardStats();
        }
    }, [isAuthenticated]);

    const refreshAdminProfile = async () => {
        try {
            const response = await api.get('/admin/auth/me');
            if (response.success) {
                setAdminData(response.data);
            }
        } catch (err) {
            console.error("Admin Profile Error:", err);
            if (err.status === 401) adminLogout();
        }
    };

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/dashboard/stats');
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error("Stats Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const adminLogin = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/admin/auth/login', { email, password });
            localStorage.setItem('dromoney_admin_token', response.token);
            setAdminData(response.admin);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || err };
        } finally {
            setLoading(false);
        }
    };

    const adminLogout = () => {
        localStorage.removeItem('dromoney_admin_token');
        setAdminData(null);
        setIsAuthenticated(false);
    };

    const addNotification = (title, message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [{ id, title, message, type }, ...prev]);
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const value = useMemo(() => ({
        adminData,
        stats,
        loading,
        notifications,
        isAuthenticated,
        adminLogin,
        adminLogout,
        addNotification,
        removeNotification,
        refreshAdminProfile,
        fetchDashboardStats
    }), [adminData, stats, loading, notifications, isAuthenticated]);

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error('useAdmin must be used within an AdminProvider');
    return context;
};
