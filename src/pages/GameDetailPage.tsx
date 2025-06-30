import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// RAWG API key and base URL for all requests
const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';

// GameDetailPage: fetches and shows details for a specific game from the RAWG API
function GameDetailPage() {
  // Get the id from the URL params (e.g., /game/123)
  const { id } = useParams<{ id: string }>();
  // useNavigate hook for navigation
  const navigate = useNavigate();

  // State variables for loading, error, game data, screenshots, trailers, stores, achievements, and fade-in animation
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error message
  const [game, setGame] = useState<any>(null); // Game details
  const [screenshots, setScreenshots] = useState<any[]>([]); // Screenshots
  const [trailers, setTrailers] = useState<any[]>([]); // Trailers
  const [stores, setStores] = useState<any[]>([]); // Store links
  const [achievements, setAchievements] = useState<any[]>([]); // Achievements
  const [fadeIn, setFadeIn] = useState(false); // Animation state

  // Fetch game details and related data from the API when id changes
  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    setFadeIn(false); // Reset animation
    setGame(null); // Reset game
    setScreenshots([]); // Reset screenshots
    setTrailers([]); // Reset trailers
    setStores([]); // Reset stores
    setAchievements([]); // Reset achievements
    // Fetch game details
    fetch(`${API_BASE_URL}/games/${id}?key=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch game details'); // Handle HTTP errors
        return res.json(); // Parse JSON response
      })
      .then(data => {
        setGame(data); // Set game data
        setStores(data.stores || []); // RAWG includes stores in game details
        setLoading(false); // Stop loading
        setTimeout(() => setFadeIn(true), 50); // Trigger fade-in animation
      })
      .catch(err => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      });
    // Fetch screenshots
    fetch(`${API_BASE_URL}/games/${id}/screenshots?key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setScreenshots(data.results || []))
      .catch(() => setScreenshots([]));
    // Fetch trailers
    fetch(`${API_BASE_URL}/games/${id}/movies?key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setTrailers(data.results || []))
      .catch(() => setTrailers([]));
    // Fetch achievements
    fetch(`${API_BASE_URL}/games/${id}/achievements?key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setAchievements(data.results || []))
      .catch(() => setAchievements([]));
  }, [id]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="page-container">
        <main className="page-main">
          <div className="page-main-content">
            <div className="loading-consistent">
              <div className="loading-spinner-consistent" />
              <p>Loading game details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  // Show error message if fetch fails
  if (error) {
    return (
      <div className="page-container">
        <main className="page-main">
          <div className="page-main-content">
            <div className="error-consistent">
              <h2>Error Loading Game</h2>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render the game detail page
  return (
    <div className="page-container">
      {/* Header section with app title and subtitle */}
      <header className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">PlayPedia</h1>
          <div className="page-subtitle">
            Discover, Explore, and Track Games Across All Platforms
          </div>
        </div>
      </header>
      {/* Navigation bar with back button */}
      <nav className="page-nav">
        <div className="page-nav-content">
          <button onClick={() => navigate('/')} className="btn-consistent btn-consistent-secondary">
            ← Back to Games
          </button>
        </div>
      </nav>
      {/* Main content area */}
      <main className="page-main">
        <div className="page-main-content">
          <div
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s, transform 0.6s',
            }}
          >
            {/* Game details card */}
            <div className="consistent-card" style={{ marginBottom: '2rem' }}>
              {/* Game cover image */}
              <img 
                src={game.background_image} 
                alt={game.name + ' cover'} 
                className="consistent-card-image"
                style={{ 
                  height: '500px', 
                  width: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa'
                }}
              />
              {/* Game info */}
              <div className="consistent-card-content">
                <h2 className="consistent-card-title" style={{ fontSize: '1.5rem' }}>{game.name}</h2>
                <div className="consistent-card-meta">
                  <p><strong>Platform:</strong> {game.parent_platforms?.map((p: any) => p.platform.name).join(', ')}</p>
                  <p><strong>Genre:</strong> {game.genres?.map((g: any) => g.name).join(', ')}</p>
                  <p><strong>Rating:</strong> {game.rating}</p>
                  <p><strong>Released:</strong> {game.released}</p>
                </div>
                {/* Game description (HTML from API) */}
                <div 
                  className="consistent-card-description"
                  style={{ marginTop: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: game.description }}
                />
              </div>
            </div>

            {/* Screenshots gallery */}
            {screenshots.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3>Screenshots</h3>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                  {screenshots.map((shot) => (
                    <img
                      key={shot.id}
                      src={shot.image}
                      alt="Screenshot"
                      style={{ width: '300px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Trailers gallery */}
            {trailers.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3>Trailers</h3>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                  {trailers.map((trailer) => (
                    <video
                      key={trailer.id}
                      src={trailer.data.max}
                      controls
                      style={{ width: '400px', borderRadius: '8px' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Stores section */}
            {stores.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3>Available At</h3>
                <ul style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: 0, listStyle: 'none' }}>
                  {stores.map((store: any) => (
                    <li key={store.id}>
                      <a href={`https://${store.store.domain}`} target="_blank" rel="noopener noreferrer" className="btn-consistent btn-consistent-secondary">
                        {store.store.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements section */}
            {achievements.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3>Achievements</h3>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {achievements.map((ach) => (
                    <li key={ach.id} style={{ marginBottom: '0.5rem' }}>
                      <strong>{ach.name}</strong>: {ach.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default GameDetailPage; 