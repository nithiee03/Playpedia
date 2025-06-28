import React from 'react';

// Enhanced GameCard component with modern styling and animations
interface Platform {
  id: number;
  name: string;
  image_background?: string;
  image?: string;
}

interface GameCardProps {
  title: string;
  platform: string | Platform[];
  image: string;
  onClick: () => void;
  rating?: number;
  releaseDate?: string;
  genres?: string[];
}

function GameCard({ title, platform, image, onClick, rating, releaseDate, genres }: GameCardProps) {
  // Format release date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Render rating stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star">☆</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return (
      <div className="rating">
        {stars}
        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Render platform logos or names
  const renderPlatforms = () => {
    if (!platform) return null;

    // If platform is a string (legacy format), show as text
    if (typeof platform === 'string') {
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <span 
            className="badge badge-accent"
            style={{ fontSize: '0.7rem' }}
          >
            {platform}
          </span>
        </div>
      );
    }

    // If platform is an array of platform objects, show logos
    if (Array.isArray(platform)) {
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {platform.slice(0, 4).map((plat, index) => (
              <div 
                key={plat.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  background: 'var(--background-light)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.7rem',
                }}
                title={plat.name}
              >
                {plat.image && (
                  <img 
                    src={plat.image} 
                    alt={plat.name}
                    style={{
                      width: '16px',
                      height: '16px',
                      objectFit: 'contain',
                      borderRadius: '2px',
                    }}
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                  {plat.name}
                </span>
              </div>
            ))}
            {platform.length > 4 && (
              <span style={{ 
                color: 'var(--text-light)', 
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem',
                background: 'var(--background-light)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid var(--border-color)',
              }}>
                +{platform.length - 4}
              </span>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className="card hover-lift scale-in"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        position: 'relative',
        background: 'white',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image container with overlay */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'var(--transition)',
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        
        {/* Hover overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(79, 70, 229, 0.8))',
            opacity: 0,
            transition: 'var(--transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hover-overlay"
        >
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
            View Details
          </span>
        </div>

        {/* Rating badge */}
        {rating && (
          <div 
            className="badge badge-primary"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              zIndex: 2,
            }}
          >
            {rating.toFixed(1)}
          </div>
        )}

        {/* Release date badge */}
        {releaseDate && (
          <div 
            className="badge badge-secondary"
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              zIndex: 2,
              fontSize: '0.7rem',
            }}
          >
            {formatDate(releaseDate)}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Title */}
        <h3 
          style={{ 
            margin: '0 0 0.75rem 0', 
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </h3>

        {/* Platforms */}
        {renderPlatforms()}

        {/* Rating */}
        {rating && (
          <div style={{ marginBottom: '0.75rem' }}>
            {renderRating(rating)}
          </div>
        )}

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.25rem',
              fontSize: '0.75rem',
              justifyContent: 'center',
            }}>
              {genres.slice(0, 3).map((genre, index) => (
                <span 
                  key={index}
                  style={{
                    padding: '0.125rem 0.5rem',
                    background: 'var(--background-light)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {genre}
                </span>
              ))}
              {genres.length > 3 && (
                <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                  +{genres.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover effect styles */}
      <style>{`
        .hover-overlay {
          opacity: 0;
        }
        
        .card:hover .hover-overlay {
          opacity: 1;
        }
        
        .card:hover img {
          transform: scale(1.05);
        }
        
        .card:focus {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

export default GameCard; 