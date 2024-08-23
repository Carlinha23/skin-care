import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import NavBar from './Navigation';
import { UserContext } from './UserContext';

describe('NavBar component', () => {
  const renderNavBar = (userContextValue) => {
    return render(
      <MemoryRouter>
        <UserContext.Provider value={userContextValue}>
          <NavBar />
        </UserContext.Provider>
      </MemoryRouter>
    );
  };

  test('renders logo and navigation links when not logged in', () => {
    renderNavBar({ currentUser: null, logout: jest.fn() });

    // Check logo
    const logoElement = screen.getByAltText(/skincare review logo/i);
    expect(logoElement).toBeInTheDocument();

    // Check links
    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('renders user-specific links when logged in', () => {
    const userContextValue = {
      currentUser: { user: { username: 'carlinha' } },
      logout: jest.fn(),
    };
    renderNavBar(userContextValue);

    // Check links for logged in state
    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/hi, carlinha/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('calls logout function when logout link is clicked', () => {
    const mockLogout = jest.fn();
    const userContextValue = {
      currentUser: { user: { username: 'carlinha' } },
      logout: mockLogout,
    };
    renderNavBar(userContextValue);

    const logoutLink = screen.getByText(/logout/i);
    logoutLink.click();

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
