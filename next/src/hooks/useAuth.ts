"use client";

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { User } from '@/types/User';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};