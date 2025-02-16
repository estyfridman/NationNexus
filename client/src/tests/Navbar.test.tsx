import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Navbar from '../components/navbar/Navbar';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { selectedCountryState } from '../services/recoilService/selectedCountry';
import { userState } from '../services/recoilService/userState';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mocking Recoil selectors
const mockSetRecoilState = vi.fn();
vi.mock('recoil', async () => {
  const actual = await vi.importActual('recoil');
  return {
    ...actual,
    useRecoilValue: (state: any) => {
      if (state === selectedCountryState) {
        return { name: 'Israel' };
      }
      if (state === userState) {
        return {
          user: {
            firstName: 'George',
            lastName: 'Washington',
            username: 'gwashington',
            email: 'george.washington@example.com',
            phone: '0572998445',
            password: '$2a$10$MHwxMIavQ1rzQkfggJW04uJiTnHHo8AWzWY05gkwRP0Dfkyi5DHPe',
            profileImage: '/uploads/250211Washingtonknod.jpg',
            role: 'admin',
          },
        };
        return null;
      }
    },
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Displays username and picture when a user is logged in.', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );

    expect(screen.getByText('gwashington')).toBeInTheDocument();
    expect(screen.getByAltText('George')).toHaveAttribute(
      'src',
      'http://localhost:8000/uploads/250211Washingtonknod.jpg'
    );
  });

  test('Correct routing when pressing the navigation buttons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Countries'));
    expect(mockNavigate).toHaveBeenCalledWith('/grid');

    fireEvent.click(screen.getByText('Admin Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/adminDashboard');
  });

  test('Displaying the selected country', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );

    expect(screen.getByText('Selected Country: Israel')).toBeInTheDocument();
  });

  test('Menu opens and closes properly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Log Out')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Log Out'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
