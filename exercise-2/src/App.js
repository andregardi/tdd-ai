import { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="App">
      <h1>GitHub User Search</h1>
      
      <div className="search-container">
        <div className="search-form">
          <label htmlFor="username">User Name</label>
          <input 
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search GitHub username..."
          />
          <button 
            aria-label="Search"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Searching...</span>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      {userData && !loading && !error && (
        <div className="user-profile">
          <h2>{userData.name || userData.login}</h2>
          <img 
            className="user-avatar"
            src={userData.avatar_url} 
            alt={`${userData.login}'s avatar`}
          />
          
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.public_repos}</span>
              <span className="stat-label">Public repos</span>
            </div>
          </div>
          
          <a 
            className="profile-link"
            href={userData.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Profile
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
