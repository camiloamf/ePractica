"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Merchant } from '@/types/Merchant';

const Dashboard = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [filters, setFilters] = useState({ name: '', status: '' });

    useEffect(() => {
        const fetchMerchants = async () => {
            setLoading(true);
            try {
                const { name, status } = filters;
                const response = await axios.get<{
                    data: Merchant[];
                    total: number;
                    page: string;
                }>(`http://localhost:3000/merchants?page=${currentPage}&limit=${itemsPerPage}&name=${name}&status=${status}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (Array.isArray(response.data.data)) {
                    setMerchants(response.data.data);
                } else {
                    throw new Error('Los datos de comerciantes no son válidos');
                }
            } catch (err) {
                setError('Error al cargar los comerciantes');
            } finally {
                setLoading(false);
            }
        };

        fetchMerchants();
    }, [currentPage, itemsPerPage, filters]);

    const handleEditMerchant = (id: string) => {
        router.push(`/merchant-form/${id}`);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterReset = () => {
        setFilters({ name: '', status: '' });
        setCurrentPage(1);
    };

    const toggleMerchantStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        try {
            const response = await axios.patch(`http://localhost:3000/merchants/${id}/status`, {
                status: newStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setMerchants(prevMerchants =>
                prevMerchants.map(merchant =>
                    merchant.id === id ? { ...merchant, status: newStatus } : merchant
                )
            );

        } catch (err) {
            setError('Error al actualizar el estado del comerciante');
        }
    };

    const deleteMerchant = async (id: string) => {
        if (user?.role !== 'admin') {
            alert('No tienes permiso para eliminar comerciantes.');
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/merchants/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMerchants(prevMerchants => prevMerchants.filter(merchant => merchant.id !== id));

        } catch (err) {
            setError('Error al eliminar el comerciante');
        }
    };

    const downloadReport = async () => {
        if (user?.role !== 'admin') {
            alert('No tienes permiso para descargar reportes.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/merchants/report', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte_comerciantes.csv');
            link.click();
            link.remove();
        } catch (err) {
            setError('Error al descargar el reporte CSV');
        }
    };

    const handleCreateMerchant = () => {
        router.push('/merchant-form');
    };

    return (
        <div>
            <header className="titleDash">
                <h1>Lista Formularios Creados</h1>
            </header>
            <main className="dashboard-main">
                <div className="dashboard-actions">
                    <button onClick={handleCreateMerchant} className="form-button">
                        Crear Comerciante
                    </button>
                    {user?.role === 'admin' && (
                        <button onClick={downloadReport} className="form-button">
                            Descargar Reporte CSV
                        </button>
                    )}
                </div>

                <div className="filters-container">
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Buscar por nombre"
                        className="filter-input"
                    />
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="">Todos los estados</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                    <button onClick={handleFilterReset} className="filter-reset">
                        Resetear Filtros
                    </button>
                </div>

                {loading ? (
                    <p className="loading-text">Cargando...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Nombre o Razón Social</th>
                                <th>Teléfono</th>
                                <th>Correo Electrónico</th>
                                <th>Fecha Registro</th>
                                <th>Cantidad de Establecimientos</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {merchants.map((merchant, index) => (
                                <tr key={merchant.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                    <td>{merchant.name}</td>
                                    <td>{merchant.phone}</td>
                                    <td>{merchant.email}</td>
                                    <td>{new Date(merchant.createdAt).toLocaleDateString()}</td>
                                    <td>{merchant.establishmentsCount}</td>
                                    <td>{merchant.status == 'active' ? 'Activo' : 'Inactivo'}</td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => handleEditMerchant(merchant.id)}
                                            className="action-button edit"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => toggleMerchantStatus(merchant.id, merchant.status)}
                                            className={`action-button ${merchant.status === 'active' ? 'deactivate' : 'activate'}`}
                                        >
                                            {merchant.status === 'active' ? 'Desactivar' : 'Activar'}
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button onClick={() => deleteMerchant(merchant.id)} className="action-button delete">
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="pagination-container">
                    <label className="items-per-page">
                        Items por página:
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="pagination-select"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </label>
                    <div className="pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="pagination-button"
                        >
                            Anterior
                        </button>
                        <span className="current-page">Página {currentPage}</span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="pagination-button"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;