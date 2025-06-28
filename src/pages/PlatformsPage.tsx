import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 20;

// PlatformsPage component: fetches and displays game platforms from RAWG API
function PlatformsPage() {
  // State for platforms, loading, error, search, and pagination
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const navigate = useNavigate();

  // Fetch platforms from RAWG API when component mounts or search/page changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `${API_BASE_URL}/platforms?key=${API_KEY}&page_size=${PAGE_SIZE}&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch platforms');
        return res.json();
      })
      .then(data => {
        setPlatforms(data.results || []);
        setHasNextPage(Boolean(data.next));
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

  // Code flow: useEffect fetches platforms -> state updates -> UI updates

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
              onClick={() => navigate('/')}
              className="btn-consistent btn-consistent-secondary"
            >
              ← Back to Games
            </button>
            <div className="search-bar-consistent">
              <input
                type="text"
                placeholder="Search platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {/* Navigation links to other pages */}
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              className="btn-consistent btn-consistent-secondary"
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
              className="btn-consistent btn-consistent-primary"
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
              <p>Loading platforms...</p>
            </div>
          ) : error ? (
            <div className="error-consistent">
              <h2>Error Loading Platforms</h2>
              <p>{error}</p>
            </div>
          ) : platforms.length === 0 ? (
            <div className="empty-consistent">
              <h3>No Platforms Found</h3>
              <p>Try adjusting your search</p>
            </div>
          ) : (
            <>
              {/* Platforms grid */}
              <div className="card-grid">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => navigate(`/platform/${platform.id}`)}
                    className="consistent-card fade-in"
                  >
                    {platform.image_background && (
                      <img
                        src={platform.image_background}
                        alt={platform.name}
                        className="consistent-card-image"
                      />
                    )}
                    <div className="consistent-card-content">
                      <h3 className="consistent-card-title">{platform.name}</h3>
                      <p className="consistent-card-meta">
                        {platform.games_count} games
                      </p>
                      <div 
                        className="consistent-card-description"
                        dangerouslySetInnerHTML={{ __html: platform.description }}
                      />
                      {platform.year_start && (
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                          Released: {platform.year_start}
                          {platform.year_end && platform.year_end !== platform.year_start && ` - ${platform.year_end}`}
                        </p>
                      )}
                    </div>
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

export default PlatformsPage; 