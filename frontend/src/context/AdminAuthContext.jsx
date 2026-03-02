import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const data = await fetchApi('/admin/me');
            if (data.status === 'success') {
                setUser(data.data.user);
            }
        } catch (error) {
            console.error('Admin Auth Check Failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (data.status === 'success') {
            setUser(data.data.user);
            return data;
        }
        throw new Error(data.message || 'Login failed');
    };

    const logout = async () => {
        try {
            await fetchApi('/admin/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            window.location.href = '/admin/login';
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AdminAuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
