import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';

// GameDetailPage: fetches and shows details for a specific game from the RAWG API
function GameDetailPage() {
  // 1. Get the id from the URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 2. State for loading, error, the fetched game, and screenshots
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<any>(null);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]); // For trailers
  const [stores, setStores] = useState<any[]>([]); // For store links
  const [achievements, setAchievements] = useState<any[]>([]); // For achievements
  const [fadeIn, setFadeIn] = useState(false); // For fade-in animation

  // 3. useEffect to fetch game details from the API
  useEffect(() => {
    setLoading(true);
    setError(null);
    setFadeIn(false);
    setGame(null);
    setScreenshots([]);
    setTrailers([]);
    setStores([]);
    setAchievements([]);
    // Fetch game details
    fetch(`${API_BASE_URL}/games/${id}?key=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch game details');
        return res.json();
      })
      .then(data => {
        setGame(data);
        setStores(data.stores || []); // RAWG includes stores in game details
        setLoading(false);
        setTimeout(() => setFadeIn(true), 50);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
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

  // 4. Code flow: Component mounts or id changes -> loading=true -> fetch runs -> game and screenshots are set -> loading=false -> fadeIn animates -> UI updates

  if (loading) {
    // 5. Show loading spinner
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

  if (error || !game) {
    // 6. Handle invalid ID or fetch error
    return (
      <div className="page-container">
        <main className="page-main">
          <div className="page-main-content">
            <div className="error-consistent">
              <h2>Game not found</h2>
              <p>{error || 'The game you are looking for does not exist.'}</p>
              <button
                onClick={() => navigate('/')}
                className="btn-consistent btn-consistent-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 7. Show game details, screenshots gallery, and back button
  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="page-nav">
        <div className="page-nav-content">
          <button
            onClick={() => navigate('/')}
            className="btn-consistent btn-consistent-secondary"
          >
            ← Back to Games
          </button>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{game.name}</h2>
        </div>
      </nav>

      {/* Main content */}
      <main className="page-main">
        <div className="page-main-content">
          <div
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s, transform 0.6s',
            }}
          >
            {/* Game details */}
            <div className="consistent-card" style={{ marginBottom: '2rem' }}>
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
              <div className="consistent-card-content">
                <h2 className="consistent-card-title" style={{ fontSize: '1.5rem' }}>{game.name}</h2>
                <div className="consistent-card-meta">
                  <p><strong>Platform:</strong> {game.parent_platforms?.map((p: any) => p.platform.name).join(', ')}</p>
                  <p><strong>Genre:</strong> {game.genres?.map((g: any) => g.name).join(', ')}</p>
                  <p><strong>Rating:</strong> {game.rating}</p>
                  <p><strong>Released:</strong> {game.released}</p>
                </div>
                <div 
                  className="consistent-card-description"
                  style={{ marginTop: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: game.description }}
                />
              </div>
            </div>

            {/* Screenshots gallery */}
            {screenshots.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Screenshots</h3>
                <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  {screenshots.map((shot) => (
                    <div key={shot.id} className="consistent-card">
                      <img
                        src={shot.image}
                        alt={game.name + ' screenshot'}
                        className="consistent-card-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailers (videos) */}
            {trailers.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Trailers</h3>
                <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                  {trailers.map((trailer) => (
                    <div key={trailer.id} className="consistent-card">
                      <video
                        controls
                        poster={trailer.preview}
                        style={{ width: '100%', borderRadius: 'var(--border-radius)', background: '#000' }}
                      >
                        <source src={trailer.data.max} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="consistent-card-content">
                        <h4 className="consistent-card-title">{trailer.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Store links */}
            {stores.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Where to Buy</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {stores.map((store: any) => (
                    <a
                      key={store.id}
                      href={`https://${store.store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-consistent btn-consistent-secondary"
                    >
                      {store.store.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Achievements</h3>
                <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                  {achievements.map((ach: any) => (
                    <div key={ach.id} className="consistent-card">
                      <div className="consistent-card-content" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {ach.image && (
                          <img 
                            src={ach.image} 
                            alt={ach.name} 
                            style={{ width: 48, height: 48, borderRadius: '6px', objectFit: 'cover', background: '#eee' }} 
                          />
                        )}
                        <div>
                          <div className="consistent-card-title">{ach.name}</div>
                          <div className="consistent-card-description">{ach.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default GameDetailPage; 