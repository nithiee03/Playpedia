import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // We'll create this file for styling

const API_KEY = 'b5af379bbd574c59ab5a04d9f10d1384';
const API_BASE_URL = 'https://api.rawg.io/api';

// Sidebar component displays navigation sections and subsections
const Sidebar: React.FC = () => {
  // State for platforms and genres
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);

  // Fetch platforms from RAWG API
  useEffect(() => {
    fetch(`${API_BASE_URL}/platforms?key=${API_KEY}&page_size=20`)
      .then(res => res.json())
      .then(data => {
        setPlatforms(data.results || []);
        setLoadingPlatforms(false);
      })
      .catch(() => setLoadingPlatforms(false));
  }, []);

  // Fetch genres from RAWG API
  useEffect(() => {
    fetch(`${API_BASE_URL}/genres?key=${API_KEY}&page_size=20`)
      .then(res => res.json())
      .then(data => {
        setGenres(data.results || []);
        setLoadingGenres(false);
      })
      .catch(() => setLoadingGenres(false));
  }, []);

  return (
    <aside className="sidebar">
      {/* Browse Section */}
      <div className="sidebar-section">
        <h3>Browse</h3>
        <ul>
          {/* Each item navigates to its respective page */}
          <li><Link to="/creators">Creators</Link></li>
          <li><Link to="/developers">Developers</Link></li>
          <li><Link to="/stores">Stores</Link></li>
          <li><Link to="/tags">Tags</Link></li>
          <li><Link to="/publishers">Publishers</Link></li>
        </ul>
      </div>

      {/* Platforms Section (dynamic) */}
      <div className="sidebar-section">
        <h3>Platforms</h3>
        <ul>
          {loadingPlatforms ? (
            <li>Loading platforms...</li>
          ) : (
            platforms.map(platform => (
              <li key={platform.id}>
                <Link to={`/platform/${platform.id}`}>{platform.name}</Link>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Genres Section (dynamic) */}
      <div className="sidebar-section">
        <h3>Genres</h3>
        <ul>
          {loadingGenres ? (
            <li>Loading genres...</li>
          ) : (
            genres.map(genre => (
              <li key={genre.id}>
                <Link to={`/genre/${genre.id}`}>{genre.name}</Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar; 