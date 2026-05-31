import { render, fireEvent } from '@testing-library/react';
import CreateTandaPage from '../page';

import { useLocale } from '@/lib/LocaleContext';

// Mock LocaleContext
jest.mock('@/lib/LocaleContext', () => ({
  useLocale: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  PlusCircle: () => <div data-testid="icon-plus" />,
  Users: () => <div data-testid="icon-users" />,
  DollarSign: () => <div data-testid="icon-dollar" />,
  Clock: () => <div data-testid="icon-clock" />,
}));

describe('CreateTandaPage', () => {
  it('renders form inputs and handles click in EN locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'en', t: {} });
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    
    expect(getByText('Create New Tanda')).toBeInTheDocument();
    expect(getByPlaceholderText('e.g. Holiday Tanda 2026')).toBeInTheDocument();

    const button = getByText('Create Tanda with Escrow');
    fireEvent.click(button);

    expect(alertMock).toHaveBeenCalledWith('Coming soon: BOT Chain escrow contract creation will be available shortly.');
    
    alertMock.mockRestore();
  });

  it('renders form inputs and handles click in ES locale', () => {
    (useLocale as jest.Mock).mockReturnValue({ locale: 'es', t: {} });
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<CreateTandaPage />);
    
    expect(getByText('Crear Nueva Tanda')).toBeInTheDocument();
    expect(getByPlaceholderText('ej. Tanda Navideña 2026')).toBeInTheDocument();

    const button = getByText('Crear Tanda con Escrow');
    fireEvent.click(button);

    expect(alertMock).toHaveBeenCalledWith('En desarrollo: La creación de contratos escrow en BOT Chain estará disponible próximamente.');
    
    alertMock.mockRestore();
  });
});
