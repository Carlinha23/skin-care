import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from './UserContext';
import Login from './Login';
import '@testing-library/jest-dom/extend-expect';

describe('Login component', () => {
  const mockLogin = jest.fn();
  const mockHistoryPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = (contextValue) => {
    return render(
      <MemoryRouter>
        <UserContext.Provider value={contextValue}>
          <Login history={{ push: mockHistoryPush }} />
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  test('renders the login form with username and password fields', () => {
    renderLogin({ login: mockLogin });

    // Check that the username and password inputs are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check that the login button is rendered
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls the login function with the correct credentials when the form is submitted', async () => {
    renderLogin({ login: mockLogin });

    // Simulate entering username and password
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'testpassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the login function to be called with the correct credentials
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'testpassword' });
    });
  });

  test('displays success message and redirects after a successful login', async () => {
    // Simulate a successful login
    mockLogin.mockResolvedValueOnce();

    renderLogin({ login: mockLogin });

    // Simulate entering username and password
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'testpassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for success message to appear and for redirection
    await waitFor(() => {
      expect(screen.getByText(/welcome, testuser! you have successfully logged in\./i)).toBeInTheDocument();
    });

    // Wait for redirection (allowing enough time for the 2-second delay)
  await waitFor(() => {
    expect(mockHistoryPush).toHaveBeenCalledWith('/reviews');
  }, { timeout: 3000 }); // Set the timeout to be longer than the 2-second delay
});

  test('handles login failure gracefully', async () => {
    // Simulate a login failure
    mockLogin.mockRejectedValueOnce(new Error('Login failed'));

    renderLogin({ login: mockLogin });

    // Simulate entering username and password
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'testpassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait to ensure that no redirection happens and the login function is called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'testpassword' });
      expect(mockHistoryPush).not.toHaveBeenCalled();
    });
  });

  test('does not submit the form if username or password is missing', async () => {
    renderLogin({ login: mockLogin });

    // Leave username and password empty and submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Ensure that the login function is not called
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});

