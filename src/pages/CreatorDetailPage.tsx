import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// RAWG API key and base URL for all requests
const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20; // Number of results per page

// CreatorDetailPage: fetches and shows details for a specific creator from the RAWG API
function CreatorDetailPage() {
  // Get the id from the URL params (e.g., /creator/123)
  const { id } = useParams<{ id: string }>();
  // useNavigate hook for navigation
  const navigate = useNavigate();

  // State variables for loading, error, creator data, games, pagination, and next page availability
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error message
  const [creator, setCreator] = useState<any>(null); // Creator details
  const [games, setGames] = useState<any[]>([]); // List of games by this creator
  const [page, setPage] = useState(1); // Current page number
  const [hasNextPage, setHasNextPage] = useState(false); // If there is a next page

  // Fetch creator details and their games from the API when id or page changes
  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    setCreator(null); // Reset creator
    setGames([]); // Reset games
    // Fetch creator details
    fetch(`${API_BASE_URL}/creators/${id}?key=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch creator details'); // Handle HTTP errors
        return res.json(); // Parse JSON response
      })
      .then(data => {
        setCreator(data); // Set creator data
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      });
    // Fetch games for this creator
    fetch(`${API_BASE_URL}/games?key=${API_KEY}&creators=${id}&page_size=${PAGE_SIZE}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setGames(data.results || []); // Set games data
        setHasNextPage(Boolean(data.next)); // Check if there is a next page
      })
      .catch(() => setGames([])); // If error, set games to empty
  }, [id, page]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="page-container">
        <main className="page-main">
          <div className="page-main-content">
            <div className="loading-consistent">
              <div className="loading-spinner-consistent" />
              <p>Loading creator details...</p>
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
              <h2>Error Loading Creator</h2>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render the creator detail page
  return (
    <div className="page-container">
      {/* Header section with app title and subtitle */}
      <header className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Playpedia</h1>
          <div className="page-subtitle">Creator Details</div>
        </div>
      </header>
      {/* Navigation bar with back button and creator name */}
      <nav className="page-nav">
        <div className="page-nav-content">
          {/* Back to creators button */}
          <button onClick={() => navigate('/creators')} className="btn-consistent btn-consistent-secondary">
            ← Back to Creators
          </button>
          {/* Creator name centered */}
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', textAlign: 'center', width: '100%'}}>
            {creator?.name}
          </h2>
        </div>
      </nav>
      {/* Main content area */}
      <main className="page-main">
        <div className="page-main-content">
          {/* Creator info card */}
          <div className="consistent-card" style={{ marginBottom: '2rem' }}>
            {/* Creator image */}
            {creator?.image && (
              <img
                src={creator.image}
                alt={creator.name}
                className="consistent-card-image"
                style={{ height: '300px', width: '100%', objectFit: 'cover', backgroundColor: '#f8f9fa' }}
              />
            )}
            {/* Creator details */}
            <div className="consistent-card-content">
              <h2 className="consistent-card-title" style={{ fontSize: '1.5rem' }}>{creator?.name}</h2>
              <div className="consistent-card-meta">
                <p><strong>Positions:</strong> {creator?.positions?.map((p: any) => p.name).join(', ')}</p>
                <p><strong>Games Count:</strong> {creator?.games_count}</p>
              </div>
              <div className="consistent-card-description" style={{ marginTop: '1rem' }}>
                {creator?.description}
              </div>
            </div>
          </div>
          {/* Games by this creator */}
          <h3 style={{ marginBottom: '1rem' }}>Games by {creator?.name}</h3>
          {/* Show message if no games found */}
          {games.length === 0 ? (
            <div className="empty-consistent">
              <h4>No Games Found</h4>
            </div>
          ) : (
            // Grid of game cards
            <div className="card-grid">
              {games.map((game) => (
                // Each card is clickable and navigates to the game detail page
                <div
                  key={game.id}
                  className="consistent-card fade-in"
                  onClick={() => navigate(`/game/${game.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Game image */}
                  {game.background_image && (
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="consistent-card-image"
                      style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                    />
                  )}
                  {/* Game info */}
                  <div className="consistent-card-content">
                    <h4 className="consistent-card-title">{game.name}</h4>
                    <p className="consistent-card-meta">Rating: {game.rating}</p>
                    <p className="consistent-card-meta">Released: {game.released}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination controls for games */}
          <div className="pagination-consistent">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-consistent btn-consistent-secondary"
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage}
              className="btn-consistent btn-consistent-secondary"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatorDetailPage; 