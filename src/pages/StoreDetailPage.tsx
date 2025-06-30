import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// RAWG API key and base URL for all requests
const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20; // Number of results per page

// StoreDetailPage: fetches and shows details for a specific store from the RAWG API
function StoreDetailPage() {
  // Get the id from the URL params (e.g., /store/123)
  const { id } = useParams<{ id: string }>();
  // useNavigate hook for navigation
  const navigate = useNavigate();

  // State variables for loading, error, store data, games, pagination, and next page availability
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error message
  const [store, setStore] = useState<any>(null); // Store details
  const [games, setGames] = useState<any[]>([]); // List of games in this store
  const [page, setPage] = useState(1); // Current page number
  const [hasNextPage, setHasNextPage] = useState(false); // If there is a next page

  // Fetch store details and their games from the API when id or page changes
  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    setStore(null); // Reset store
    setGames([]); // Reset games
    // Fetch store details
    fetch(`${API_BASE_URL}/stores/${id}?key=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch store details'); // Handle HTTP errors
        return res.json(); // Parse JSON response
      })
      .then(data => {
        setStore(data); // Set store data
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      });
    // Fetch games for this store
    fetch(`${API_BASE_URL}/games?key=${API_KEY}&stores=${id}&page_size=${PAGE_SIZE}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setGames(data.results || []); // Set games data
        setHasNextPage(Boolean(data.next)); // Check if there is a next page
      })
      .catch(() => setGames([])); // If error, set games to empty
  }, [id, page]);

  // Render loading spinner while fetching data
  if (loading) {
    return (
      <div className="page-container">
        <main className="page-main">
          <div className="page-main-content">
            <div className="loading-consistent">
              <div className="loading-spinner-consistent" />
              <p>Loading store details...</p>
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
              <h2>Error Loading Store</h2>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render the store detail page
  return (
    <div className="page-container">
      {/* Header section with app title and subtitle */}
      <header className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Playpedia</h1>
          <div className="page-subtitle">Store Details</div>
        </div>
      </header>
      {/* Navigation bar with back button and store name */}
      <nav className="page-nav">
        <div className="page-nav-content">
          {/* Back to stores button */}
          <button onClick={() => navigate('/stores')} className="btn-consistent btn-consistent-secondary">
            ← Back to Stores
          </button>
          {/* Store name centered */}
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', textAlign: 'center', width: '100%' }}>{store?.name}</h2>
        </div>
      </nav>
      {/* Main content area */}
      <main className="page-main">
        <div className="page-main-content">
          {/* Store info card */}
          <div className="consistent-card" style={{ marginBottom: '2rem' }}>
            {/* Store image */}
            {store?.image_background && (
              <img
                src={store.image_background}
                alt={store.name}
                className="consistent-card-image"
                style={{ height: '300px', width: '100%', objectFit: 'cover', backgroundColor: '#f8f9fa' }}
              />
            )}
            {/* Store details */}
            <div className="consistent-card-content">
              <h2 className="consistent-card-title" style={{ fontSize: '1.5rem' }}>{store?.name}</h2>
              <div className="consistent-card-meta">
                <p><strong>Domain:</strong> {store?.domain}</p>
                <p><strong>Games Count:</strong> {store?.games_count}</p>
              </div>
              <div className="consistent-card-description" style={{ marginTop: '1rem' }}>
                {store?.description}
              </div>
            </div>
          </div>
          {/* Games by this store */}
          <h3 style={{ marginBottom: '1rem' }}>Games on {store?.name}</h3>
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

export default StoreDetailPage; 