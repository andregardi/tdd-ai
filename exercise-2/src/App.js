import { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
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

  return (
    <div className="App">
      <h1>Github search</h1>
      
      <div>
        <label htmlFor="username">User Name</label>
        <input 
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button 
          aria-label="Search"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {error && <p>Error: {error}</p>}
      
      {userData && !loading && !error && (
        <div>
          <h2>{userData.name}</h2>
          <img src={userData.avatar_url} alt="User avatar" width="100" />
          <p>Followers: {userData.followers}</p>
          <p>Public repos: {userData.public_repos}</p>
          <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
