"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "@/utils/api";
import { Merchant } from "@/types/Merchant";
import { isAxiosError } from "axios";

const MerchantForm = () => {
    const router = useRouter();
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Merchant>({
        id: "",
        name: "",
        city: "",
        phone: "",
        email: "",
        createdAt: "",
        establishmentsCount: 0,
        status: "active",
        hasEstablishments: false,
    });

    useEffect(() => {
        const fetchMerchant = async () => {
            if (id) {
                try {
                    const response = await axios.get<Merchant>(`/merchants/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data) {
                        setMerchant(response.data);
                        setFormData(response.data);
                    } else {
                        router.push("/merchant-form");
                    }
                } catch (err) {
                    if (isAxiosError(err)) {
                    } else {
                    }
                    setError("Error al cargar el comerciante");
                    router.push("/merchant-form");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchMerchant();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
    
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        try {
            if (id) {
                await axios.put(`/merchants/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Comerciante actualizado exitosamente");
            } else {
                await axios.post(`/merchants`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Comerciante creado exitosamente");
            }
            router.push("/dashboard");
        } catch (err) {
            setError("Error al guardar el comerciante");
        }
    };

    return (
        <div>
            <header className="titleDash">
                <h1>{id ? "Actualizar Comerciante" : "Crear Comerciante"}</h1>
            </header>
            <main className="form-container">
                {loading ? (
                    <p className="loading-text">Cargando...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="section-header">Datos Generales</div>
                        <div className="form-row">
                            <div className="column">
                                <div className="form-group">
                                    <label>Nombre o Razón Social:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ciudad:</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar ciudad</option>
                                        <option value="Cali">Cali</option>
                                        <option value="Bogotá">Bogotá</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Teléfono:</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Correo Electrónico:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="vertical-divider"></div>
                            <div className="column">
                                <div className="form-group">
                                    <label>Fecha de Registro:</label>
                                    <input
                                        type="date"
                                        name="createdAt"
                                        value={formData.createdAt}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estado:</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>¿Posee establecimientos?</label>
                                    <input
                                        type="checkbox"
                                        name="hasEstablishments"
                                        checked={formData.hasEstablishments}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
};

export default MerchantForm;