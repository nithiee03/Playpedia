import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20;

// HomePage component: fetches and displays games from RAWG API with pagination
function HomePage() {
  // State for games, loading, error, search, and pagination
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1); // Current page
  const [hasNextPage, setHasNextPage] = useState(false); // If there are more results

  const navigate = useNavigate();

  // Fetch games from RAWG API when component mounts or search/page changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Build API URL with search and page filters
    let url = `${API_BASE_URL}/games?key=${API_KEY}&page_size=${PAGE_SIZE}&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch games');
        return res.json();
      })
      .then(data => {
        setGames(data.results || []);
        setHasNextPage(Boolean(data.next)); // RAWG API provides 'next' if there are more results
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [searchQuery, page]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Code flow: useEffect fetches games -> state updates -> UI updates

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">PlayPedia</h1>
          <div className="page-subtitle">
            Discover, Explore, and Track Games Across All Platforms
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="page-nav">
        <div className="page-nav-content">
          <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {/* Empty div to maintain layout structure */}
            <div className="flex items-center gap-2">
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {/* Filter removed but layout preserved */}
              </div>
            </div>
          </div>
          {/* Navigation links to other pages */}
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              className="btn-consistent btn-consistent-primary"
              style={{ fontSize: '0.9rem' }}
            >
              Games
            </button>
            <button
              onClick={() => navigate('/developers')}
              className="btn-consistent btn-consistent-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Developers
            </button>
            <button
              onClick={() => navigate('/genres')}
              className="btn-consistent btn-consistent-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Genres
            </button>
            <button
              onClick={() => navigate('/platforms')}
              className="btn-consistent btn-consistent-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Platforms
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="page-main">
        <div className="page-main-content">
          {loading ? (
            <div className="loading-consistent">
              <div className="loading-spinner-consistent" />
              <p>Loading games...</p>
            </div>
          ) : error ? (
            <div className="error-consistent">
              <h2>Error Loading Games</h2>
              <p>{error}</p>
              <button 
                className="btn-consistent btn-consistent-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : games.length === 0 ? (
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
                        console.log('Navigating to game:', game.id, game.name);
                        navigate(`/game/${game.id}`);
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
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