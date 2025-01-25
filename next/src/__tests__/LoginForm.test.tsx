import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/components/LoginForm';

describe('LoginForm', () => {
  it('should show validation errors', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText(/Iniciar sesión/i));
    expect(await screen.findByText(/El correo es obligatorio/i));
    expect(await screen.findByText(/La contraseña es obligatoria/i));
  });
});