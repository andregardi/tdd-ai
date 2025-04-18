import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';


describe('App', () => {
  it('should render', () => {
    render(<App />);
    expect(screen.getByText('GitHub User Search')).toBeInTheDocument();
  });

  it('should display user data after a successful fetch', async () => {
    const mockUserData = { 
      name: 'Test User', 
      login: 'testuser',
      avatar_url: 'https://example.com/avatar.jpg',
      followers: 100,
      public_repos: 20,
      html_url: 'https://github.com/testuser'
    };
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );

    render(<App />);
    
    const userNameInput = screen.getByLabelText('User Name');
    userEvent.type(userNameInput, 'testuser');
    const searchButton = screen.getByLabelText('Search');
    userEvent.click(searchButton);

    
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/testuser');
    expect(screen.getByText('Searching...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Public repos')).toBeInTheDocument();
      expect(screen.getByText('View Profile')).toBeInTheDocument();
      expect(screen.getByAltText(`testuser's avatar`)).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
  });

  it('should show error message when fetch fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404
      })
    );

    render(<App />);
    
    const userNameInput = screen.getByLabelText('User Name');
    userEvent.type(userNameInput, 'nonexistentuser');
    const searchButton = screen.getByLabelText('Search');
    userEvent.click(searchButton);
    
    expect(screen.getByText('Searching...')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/nonexistentuser');

    await waitFor(() => {
      expect(screen.getByText('Error: User not found')).toBeInTheDocument();
    });

    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
  });
});