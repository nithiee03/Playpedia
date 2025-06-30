import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// RAWG API key and base URL for all requests
const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20; // Number of results per page

// StoresPage component: fetches and displays game stores from RAWG API
function StoresPage() {
  // State variables for stores data, loading state, error messages, search query, pagination, and next page availability
  const [stores, setStores] = useState<any[]>([]); // List of stores
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error message
  const [searchQuery, setSearchQuery] = useState(''); // Search input value
  const [page, setPage] = useState(1); // Current page number
  const [hasNextPage, setHasNextPage] = useState(false); // If there is a next page

  // useNavigate hook from react-router-dom for navigation
  const navigate = useNavigate();

  // Fetch stores from RAWG API when component mounts or when search/page changes
  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    // Build the API URL with search and page filters
    let url = `${API_BASE_URL}/stores?key=${API_KEY}&page_size=${PAGE_SIZE}&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    // Fetch data from the API
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stores'); // Handle HTTP errors
        return res.json(); // Parse JSON response
      })
      .then(data => {
        setStores(data.results || []); // Set stores data
        setHasNextPage(Boolean(data.next)); // Check if there is a next page
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      });
  }, [searchQuery, page]); // Re-run effect when searchQuery or page changes

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Render the page UI
  return (
    <div className="page-container">
      {/* Header section with app title and subtitle */}
      <header className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Playpedia</h1>
          <div className="page-subtitle">Browse game stores from RAWG</div>
        </div>
      </header>

      {/* Navigation bar with back button, section title, and search bar */}
      <nav className="page-nav">
        <div className="page-nav-content">
          {/* Back to games button */}
          <button onClick={() => navigate('/')} className="btn-consistent btn-consistent-secondary">
            ← Back to Games
          </button>
          {/* Section title */}
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>Stores</h2>
          {/* Search bar for filtering stores */}
          <div className="search-bar-consistent">
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {/* Search icon */}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="page-main">
        <div className="page-main-content">
          {/* Show loading spinner while fetching data */}
          {loading ? (
            <div className="loading-consistent">
              <div className="loading-spinner-consistent" />
              <p>Loading stores...</p>
            </div>
          ) : error ? (
            // Show error message if fetch fails
            <div className="error-consistent">
              <h2>Error Loading Stores</h2>
              <p>{error}</p>
            </div>
          ) : stores.length === 0 ? (
            // Show message if no stores found
            <div className="empty-consistent">
              <h3>No Stores Found</h3>
              <p>Try adjusting your search</p>
            </div>
          ) : (
            <>
              {/* Grid of store cards */}
              <div className="card-grid">
                {stores.map((store) => (
                  // Each card is clickable and navigates to the store's detail page
                  <div
                    key={store.id}
                    className="consistent-card fade-in"
                    onClick={() => navigate(`/store/${store.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Store image */}
                    {store.image_background && (
                      <img
                        src={store.image_background}
                        alt={store.name}
                        className="consistent-card-image"
                        style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                      />
                    )}
                    {/* Store info */}
                    <div className="consistent-card-content">
                      <h3 className="consistent-card-title">{store.name}</h3>
                      <p className="consistent-card-meta">
                        {/* Store domain */}
                        {store.domain}
                      </p>
                      <p className="consistent-card-meta">
                        {/* Number of games in this store */}
                        {store.games_count} games
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination controls */}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default StoresPage; 