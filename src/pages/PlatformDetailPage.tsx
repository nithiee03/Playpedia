import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';

const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20;

// PlatformDetailPage component: fetches and displays games for a specific platform
function PlatformDetailPage() {
  // State for platform details, games, loading, error, search, and pagination
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Fetch platform details and games when component mounts or search/page changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch platform details
    fetch(`${API_BASE_URL}/platforms/${id}?key=${API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch platform details');
        return res.json();
      })
      .then(data => {
        setPlatform(data);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch games for this platform
    let url = `${API_BASE_URL}/games?key=${API_KEY}&platforms=${id}&page_size=${PAGE_SIZE}&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch games');
        return res.json();
      })
      .then(data => {
        setGames(data.results || []);
        setHasNextPage(Boolean(data.next));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, searchQuery, page]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Code flow: useEffect fetches platform and games -> state updates -> UI updates

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
            <button
              onClick={() => navigate('/platforms')}
              className="btn-consistent btn-consistent-secondary"
            >
              ← Back to Platforms
            </button>
            <div className="search-bar-consistent">
              <input
                type="text"
                placeholder="Search games on this platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>
            {platform ? `${platform.name} Games` : 'Platform Games'}
          </h2>
        </div>
      </nav>

      {/* Main content */}
      <main className="page-main">
        <div className="page-main-content">
          {loading ? (
            <div className="loading-consistent">
              <div className="loading-spinner-consistent" />
              <p>Loading platform details...</p>
            </div>
          ) : error ? (
            <div className="error-consistent">
              <h2>Error Loading Platform</h2>
              <p>{error}</p>
            </div>
          ) : !platform ? (
            <div className="error-consistent">
              <h2>Platform Not Found</h2>
              <p>The platform you are looking for does not exist.</p>
            </div>
          ) : (
            <>
              {/* Platform details */}
              <div className="consistent-card" style={{ marginBottom: '2rem' }}>
                {platform.image_background && (
                  <img
                    src={platform.image_background}
                    alt={platform.name}
                    className="consistent-card-image"
                    style={{ height: '250px' }}
                  />
                )}
                <div className="consistent-card-content">
                  <h2 className="consistent-card-title" style={{ fontSize: '1.5rem' }}>{platform.name}</h2>
                  <p className="consistent-card-meta">
                    {platform.games_count} games on this platform
                  </p>
                  <div 
                    className="consistent-card-description"
                    dangerouslySetInnerHTML={{ __html: platform.description }}
                  />
                  {platform.year_start && (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      Released: {platform.year_start}
                      {platform.year_end && platform.year_end !== platform.year_start && ` - ${platform.year_end}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Games grid */}
              {games.length === 0 ? (
                <div className="empty-consistent">
                  <h3>No Games Found</h3>
                  <p>Try adjusting your search</p>
                </div>
              ) : (
                <>
                  <div className="card-grid">
                    {games.map((game, index) => (
                      <div key={game.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in">
                        <GameCard
                          title={game.name}
                          platform={game.parent_platforms?.map((p: any) => p.platform.name).join(', ') || ''}
                          image={game.background_image}
                          rating={game.rating}
                          releaseDate={game.released}
                          genres={game.genres?.map((g: any) => g.name)}
                          onClick={() => navigate(`/game/${game.id}`)}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default PlatformDetailPage; 