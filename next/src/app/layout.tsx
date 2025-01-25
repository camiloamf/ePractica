"use client";

import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMerchantDynamic = pathname.includes("merchant-form");
    const isEditing = pathname.match(/merchant-form\/\w+/);

    const handleSave = async () => {
        const form = document.querySelector("form");
        if (form) {
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
    };

    return (
        <html lang="es">
            <body>
                <AuthProvider>
                    <Header />
                    <main>{children}</main>
                    {isMerchantDynamic && <Footer onClickButton={handleSave} />}
                </AuthProvider>
            </body>
        </html>
    );
}