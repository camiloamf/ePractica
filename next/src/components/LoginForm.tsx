'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';

const schema = yup.object({
    email: yup.string().email('Formato de correo inválido').required('El correo es obligatorio'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    terms: yup.bool().oneOf([true], 'Debe aceptar los términos y condiciones'),
});

export default function LoginForm() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        try {
            await login(data.email, data.password);
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h4 className="text-center text-gray-700 mb-4">Digita tu documento de identidad del propietario o representante legal y la contraseña</h4>
            <hr className="divider mb-8" />
            <div className="mb-4">
                <input
                    {...register('email')}
                    type="email"
                    placeholder="Correo Electrónico"
                    className="input-field"
                />
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>
            <div className="mb-4">
                <input
                    {...register('password')}
                    type="password"
                    placeholder="Contraseña"
                    className="input-field"
                />
                <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>
            <div className="mb-4 flex items-center">
                <input {...register('terms')} type="checkbox" className="mr-2" />
                <label className="flex items-center">Acepto términos y condiciones</label>
            </div>
            <p className="text-red-500 text-sm">{errors.terms?.message}</p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="submit-button">Iniciar sesión</button>
        </form>
    );
}