import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';

// RAWG API key and base URL for all requests
const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20; // Number of results per page

// GenreDetailPage component: fetches and displays games for a specific genre
function GenreDetailPage() {
  // Get the id from the URL params (e.g., /genre/123)
  const { id } = useParams<{ id: string }>();
  // useNavigate hook for navigation
  const navigate = useNavigate();

  // State variables for genre details, games, loading, error, search, pagination, and next page availability
  const [genre, setGenre] = useState<any>(null); // Genre details
  const [games, setGames] = useState<any[]>([]); // List of games in this genre
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error message
  const [searchQuery, setSearchQuery] = useState(''); // Search input value
  const [page, setPage] = useState(1); // Current page number
  const [hasNextPage, setHasNextPage] = useState(false); // If there is a next page

  // Fetch genre details and games from RAWG API when id, search, or page changes
  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    setGenre(null); // Reset genre
    setGames([]); // Reset games
    // Fetch genre details
    fetch(`${API_BASE_URL}/genres/${id}?key=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch genre details'); // Handle HTTP errors
        return res.json(); // Parse JSON response
      })
      .then(data => {
        setGenre(data); // Set genre data
      })
      .catch(err => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      });
    // Fetch games for this genre
    let url = `${API_BASE_URL}/games?key=${API_KEY}&genres=${id}&page_size=${PAGE_SIZE}&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch games'); // Handle HTTP errors
        return res.json(); // Parse JSON response
      })
      .then(data => {
        setGames(data.results || []); // Set games data
        setHasNextPage(Boolean(data.next)); // Check if there is a next page
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      });
  }, [id, searchQuery, page]); // Re-run effect when id, searchQuery, or page changes

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
          <h1 className="page-title">PlayPedia</h1>
          <div className="page-subtitle">
            Discover, Explore, and Track Games Across All Platforms
          </div>
        </div>
      </header>

      {/* Navigation bar with back button, section title, and search bar */}
      <nav className="page-nav">
        <div className="page-nav-content">
          {/* Back to genres button */}
          <button onClick={() => navigate('/genres')} className="btn-consistent btn-consistent-secondary">
            ← Back to Genres
          </button>
          {/* Section title */}
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>{genre ? `${genre.name} Games` : 'Genre Games'}</h2>
          {/* Search bar for filtering games */}
          <div className="search-bar-consistent">
            <input
              type="text"
              placeholder="Search games in this genre..."
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
              <p>Loading games...</p>
            </div>
          ) : error ? (
            // Show error message if fetch fails
            <div className="error-consistent">
              <h2>Error Loading Games</h2>
              <p>{error}</p>
            </div>
          ) : games.length === 0 ? (
            // Show message if no games found
            <div className="empty-consistent">
              <h3>No Games Found</h3>
              <p>Try adjusting your search</p>
            </div>
          ) : (
            <>
              {/* Grid of game cards */}
              <div className="card-grid">
                {games.map((game) => (
                  // Each card is clickable and navigates to the game detail page
                  <div
                    key={game.id}
                    className="consistent-card fade-in"
                    onClick={() => navigate(`/game/${game.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* GameCard component displays game info */}
                    <GameCard
                      title={game.name}
                      platform={game.parent_platforms?.map((p: any) => ({
                        id: p.platform.id,
                        name: p.platform.name,
                        image: p.platform.image_background
                      })) || []}
                      image={game.background_image}
                      rating={game.rating}
                      releaseDate={game.released}
                      genres={game.genres?.map((g: any) => g.name)}
                      onClick={() => navigate(`/game/${game.id}`)}
                    />
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

export default GenreDetailPage; 