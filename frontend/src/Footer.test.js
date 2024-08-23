import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from './Footer';

describe('Footer component', () => {
  test('renders the footer logo', () => {
    render(<Footer />);
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('contains Instagram, LinkedIn, and YouTube links', () => {
    render(<Footer />);
    
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
    const youtubeLink = screen.getByRole('link', { name: /youtube/i });

    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/');
    expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/in/carla-rodriguesm/');
    expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/');
  });

  test('displays © 2024 Skincare Review text', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/© 2024 skincare review/i);
    expect(copyrightText).toBeInTheDocument();
  });
});
