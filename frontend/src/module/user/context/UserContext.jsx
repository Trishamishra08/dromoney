import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import api from '../../shared/services/api';
import io from 'socket.io-client';

const UserContext = React.createContext();
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://dromoney.onrender.com';

// Initial empty state to prevent destructuring crashes
const INITIAL_USER_STATE = {
    name: '',
    email: '',
    id: '',
    isPaid: false,
    earnings: { today: 0, total: 0, referral: 0 },
    coins: { total: 0, history: [] },
    referrals: { count: 0, code: '', link: '' },
    wallet: { balance: 0, transactions: [] },
    kycStatus: 'Not Started',
    profileImage: '',
    futureFund: { progress: 0, criteria: [] },
    isBoosterActive: false
};

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(INITIAL_USER_STATE);
    const [notifications, setNotifications] = useState([]);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [loading, setLoading] = useState(!!localStorage.getItem('dromoney_token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('dromoney_token'));
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            refreshUserProfile();
            fetchNotifications();

            // Setup Socket Connection
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            newSocket.on('new_broadcast', (notif) => {
                addNotification(notif.title, notif.message, 'broadcast');
            });

            return () => newSocket.close();
        } else {
            setUserData(INITIAL_USER_STATE);
            setNotifications([]);
        }
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/public/notifications');
            if (res.success && res.data) {
                const readIds = JSON.parse(localStorage.getItem('dromoney_read_notifs') || '[]');
                const mapped = res.data.map(n => ({
                    id: n._id,
                    title: n.title,
                    message: n.message,
                    time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: n.type || 'broadcast',
                    isRead: readIds.includes(n._id)
                }));
                setNotifications(mapped);
            }
        } catch (err) {
            console.error("Notifications Fetch Error:", err);
        }
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        const readIds = JSON.parse(localStorage.getItem('dromoney_read_notifs') || '[]');
        if (!readIds.includes(id)) {
            readIds.push(id);
            localStorage.setItem('dromoney_read_notifs', JSON.stringify(readIds));
        }
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const refreshUserProfile = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const response = await api.get('/user/auth/me');
            if (response.success && response.data) {
                mapAndSetUserData(response.data);
            }
        } catch (err) {
            console.error("Profile Sync Error:", err);
            if (err.status === 401) logout();
        } finally {
            setLoading(false);
        }
    };

    const mapAndSetUserData = (dbUser) => {
        setUserData({
            name: dbUser.name,
            id: `AFF-${dbUser.referralCode}`,
            email: dbUser.email,
            phone: dbUser.phone,
            isPaid: dbUser.isPaid,
            isBoosterActive: dbUser.isBoosterActive,
            earnings: {
                today: dbUser.wallet?.todayEarnings || 0,
                total: dbUser.wallet?.lifetimeEarnings || 0,
                referral: dbUser.wallet?.referralEarnings || 0
            },
            coins: {
                total: dbUser.coins?.balance || 0,
                history: []
            },
            referrals: {
                count: dbUser.referralCount || 0,
                code: dbUser.referralCode,
                link: `${window.location.origin}/user/auth/register?ref=${dbUser.referralCode}`
            },
            wallet: {
                balance: dbUser.wallet?.balance || 0,
                transactions: []
            },
            kycStatus: dbUser.kyc?.status || 'Not Started',
            kycRejectionReason: dbUser.kyc?.rejectionReason || '',
            profileImage: dbUser.profileImage || '',
            futureFund: {
                progress: dbUser.futureFund?.progress || 0,
                criteria: dbUser.futureFund?.criteria || []
            }
        });
    };

    const sendLoginOtp = async (phone) => {
        setLoading(true);
        try {
            // Simplified OTP logic for Dev: always expect 1234
            return { success: true, dev_otp: '1234' };
        } catch (err) {
            return { success: false, error: err.message || 'OTP Send failed' };
        } finally {
            setLoading(false);
        }
    };

    const verifyLoginOtp = async (phone, otp, expectedOtp) => {
        setLoading(true);
        try {
            // If OTP is 1234, we simulate success or pass it to backend as bypass
            const response = await api.post('/user/auth/verify-otp', { phone, otp: otp === '1234' ? '1234' : otp, expectedOtp: '1234' });
            localStorage.setItem('dromoney_token', response.token);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || 'Verification failed' };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/user/auth/login', { email, password });
            localStorage.setItem('dromoney_token', response.token);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setLoading(true);
        try {
            const response = await api.post('/user/auth/register', formData);
            localStorage.setItem('dromoney_token', response.token);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('dromoney_token');
        setIsAuthenticated(false);
        setUserData(INITIAL_USER_STATE);
        localStorage.removeItem('dromoney_read_notifs');
    };

    const unlockPlatform = async () => {
        try {
            await api.post('/user/data/unlock');
            await refreshUserProfile();
            return true;
        } catch (err) { return false; }
    };

    const addCoins = async (amount, source) => {
        try {
            await api.post('/user/wallet/add-coins', { amount, source });
            await refreshUserProfile();
        } catch (err) { console.error(err); }
    };

    const requestWithdrawal = async (amount) => {
        try {
            await api.post('/user/wallet/withdraw', { amount });
            await refreshUserProfile();
            return true;
        } catch (err) { return false; }
    };

    const updateProfileImage = async (newUrl) => {
        setUserData(prev => ({ ...prev, profileImage: newUrl }));
    };

    const addNotification = (title, message, type) => {
        setNotifications(prev => [{ id: Date.now(), title, message, time: "Just now", type, isRead: false }, ...prev]);
    };

    const value = useMemo(() => ({
        userData,
        notifications,
        loading,
        isAuthenticated,
        login,
        sendLoginOtp,
        verifyLoginOtp,
        register,
        logout,
        unlockPlatform,
        addCoins,
        requestWithdrawal,
        addNotification,
        refreshUserProfile,
        updateProfileImage,
        markAsRead,
        clearNotifications
    }), [userData, notifications, loading, isAuthenticated]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
