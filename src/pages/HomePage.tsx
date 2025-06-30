import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

// RAWG API key and base URL for all requests
const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20; // Number of results per page

// HomePage component: fetches and displays games from RAWG API with pagination
function HomePage() {
  // State variables for games data, loading state, error messages, search query, pagination, and next page availability
  const [games, setGames] = useState<any[]>([]); // List of games
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState<string | null>(null); // Error message
  const [searchQuery, setSearchQuery] = useState(''); // Search input value
  const [page, setPage] = useState(1); // Current page number
  const [hasNextPage, setHasNextPage] = useState(false); // If there are more results

  // useNavigate hook from react-router-dom for navigation
  const navigate = useNavigate();

  // Fetch games from RAWG API when component mounts or when search/page changes
  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error
    // Build API URL with search and page filters
    let url = `${API_BASE_URL}/games?key=${API_KEY}&page_size=${PAGE_SIZE}&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    // Fetch data from the API
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch games'); // Handle HTTP errors
        return res.json(); // Parse JSON response
      })
      .then(data => {
        setGames(data.results || []); // Set games data
        setHasNextPage(Boolean(data.next)); // RAWG API provides 'next' if there are more results
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      });
  }, [searchQuery, page]); // Re-run effect when searchQuery or page changes

  // Reset to page 1 when search changes
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

      {/* Navigation bar with search bar */}
      <nav className="page-nav">
        <div className="page-nav-content">
          {/* Search bar for filtering games */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search games..." />
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
              {/* Game cards grid */}
              <div className="card-grid">
                {games.map((game, index) => (
                  <div key={game.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in">
                    {/* GameCard component displays game info and handles click navigation */}
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
                      onClick={() => {
                        // Navigate to game detail page
                        navigate(`/game/${game.id}`);
                      }}
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

export default HomePage; 