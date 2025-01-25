"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const Header = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isDashboard = pathname === '/dashboard';
    const isCreate = pathname.startsWith('/merchant-form');

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <header className="header flex justify-between items-center px-6 py-4 bg-white shadow-md">
            <div className="logo">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </div>

            {user ? (
                <>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div
                                className={`${styles.circle} ${isDashboard ? styles.active : styles.inactive
                                    }`}
                            >
                                1
                            </div>
                            <span
                                className={`${isDashboard
                                    ? styles.textActive
                                    : styles.textInactive
                                    }`}
                            >
                                Lista formulario
                            </span>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.step}>
                            <div
                                className={`${styles.circle} ${isCreate ? styles.active : styles.inactive
                                    }`}
                            >
                                2
                            </div>
                            <span
                                className={`${isCreate
                                    ? styles.textActive
                                    : styles.textInactive
                                    }`}
                            >
                                Crear formulario
                            </span>
                        </div>
                    </div>

                    <div className="user-menu relative flex items-center space-x-4">
                        <div
                            className="user-info flex items-center cursor-pointer"
                            onClick={toggleMenu}
                        >
                            <img
                                src="/usuario.png"
                                alt="Usuario"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-2 text-sm">
                                <p className="font-bold">¡Bienvenido!</p>
                                <p>{user.name}</p>
                                <p className="text-gray-500">{user.role}</p>
                            </div>
                        </div>

                        {menuOpen && (
                            <div className="menu absolute top-12 right-0 bg-white shadow-lg rounded p-4">
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="benefits text-gray-600 font-medium">
                    Beneficios por renovar
                </div>
            )}
        </header>
    );
};

export default Header;