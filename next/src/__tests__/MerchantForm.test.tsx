import { render, screen, fireEvent } from '@testing-library/react';
import MerchantForm from '@/app/merchant-form/[id]/page';

describe('MerchantForm', () => {
    test('renders form elements', () => {
        render(<MerchantForm onClose={() => { }} />);

        expect(screen.getByLabelText(/nombre o razón social/i));
        expect(screen.getByLabelText(/municipio o ciudad/i));
        expect(screen.getByLabelText(/teléfono/i));
        expect(screen.getByLabelText(/correo electrónico/i));
        expect(screen.getByLabelText(/fecha de registro/i));
        expect(screen.getByLabelText(/estado/i));
    });

    test('handles input changes', () => {
        render(<MerchantForm onClose={() => { }} />);

        fireEvent.change(screen.getByLabelText(/nombre o razón social/i), {
            target: { value: 'Comerciante Test' },
        });

        expect(screen.getByLabelText(/nombre o razón social/i).value).toBe('Comerciante Test');
    });

});