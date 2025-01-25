import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-custom">
      <div className="text-white text-center mb-8">
        <h1 className="text-lg font-semibold">Debes iniciar sesión para acceder a la plataforma</h1>
      </div>
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <LoginForm />
      </div>
    </div>
  );
}