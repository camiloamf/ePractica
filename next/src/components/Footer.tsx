"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

type FooterProps = {
    onClickButton?: () => void;
};

const Footer: React.FC<FooterProps> = ({ onClickButton }) => {
    const pathname = usePathname();
    const [totalRevenue, setTotalRevenue] = useState<string | null>(null);
    const [employeeCount, setEmployeeCount] = useState<string | null>(null);

    const isMerchantFormPage = pathname.includes("merchant-form");
    const isEditing = pathname.match(/merchant-form\/(\d+)/);

    useEffect(() => {
        if (isEditing) {
            const merchantId = pathname.split("/").pop();
            const token = localStorage.getItem("token");

            axios
                .get(`http://localhost:3000/merchants/${merchantId}/report`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    const data = response.data.data;
                    setTotalRevenue(data.totalIncome.toString());
                    setEmployeeCount(data.establishmentsCount.toString());
                })
                .catch(error => {
                    setTotalRevenue("Error");
                    setEmployeeCount("Error");
                });
        }
    }, [isEditing, pathname]);

    const merchantFooterStyle = isMerchantFormPage ? "mx-auto rounded-t-2xl" : "w-full";

    return (
        <footer className={`footer ${merchantFooterStyle}`}>
            {isMerchantFormPage ? (
                <div className="footer-dynamic flex justify-between items-start">
                    {isEditing ? (
                        <>
                            <div className="footer-item">
                                <p className="footer-title">Total Ingresos:</p>
                                <p className="footer-value">{totalRevenue || "Cargando..."}</p>
                            </div>
                            <div className="footer-item">
                                <p className="footer-title">Cantidad de empleados:</p>
                                <p className="footer-value">{employeeCount || "Cargando..."}</p>
                            </div>
                        </>
                    ) : (
                        <p className="footer-message">
                            Configura tu comercio y completa los datos iniciales para comenzar.
                        </p>
                    )}
                    <button
                        className="footer-button btn btn-primary ml-auto"
                        onClick={onClickButton}
                    >
                        {isEditing ? "Actualizar" : "Crear"}
                    </button>
                </div>
            ) : (
                <p className="footer-static-message">
                    Prueba Técnica De Uso Exclusivo de OLSoftware S.A.
                </p>
            )}
        </footer>
    );
};

export default Footer;