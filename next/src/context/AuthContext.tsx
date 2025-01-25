"use client";

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/api';
import { User } from '@/types/User';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const initializeUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:3000/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const user = response.data.user;
                    setUser({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    });
                } catch (error) {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
        };
        initializeUser();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post('http://localhost:3000/auth/login', { email, password });
        const user = response.data.user;
        setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
        localStorage.setItem('token', response.data.access_token);
        setToken(response.data.access_token);
        router.push('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}