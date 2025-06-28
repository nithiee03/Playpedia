import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import GenresPage from './pages/GenresPage';
import PlatformsPage from './pages/PlatformsPage';
import DevelopersPage from './pages/DevelopersPage';
import GenreDetailPage from './pages/GenreDetailPage';
import PlatformDetailPage from './pages/PlatformDetailPage';
import DeveloperDetailPage from './pages/DeveloperDetailPage';
import './App.css';

// App component: sets up routing for the app
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route: shows the game list */}
          <Route path="/" element={<HomePage />} />
          {/* Game detail route: shows details for a specific game by ID */}
          <Route path="/game/:id" element={<GameDetailPage />} />
          {/* Developers route: shows a list of game developers */}
          <Route path="/developers" element={<DevelopersPage />} />
          {/* Developer detail route: shows details and games for a specific developer */}
          <Route path="/developer/:id" element={<DeveloperDetailPage />} />
          {/* Genres route: shows a list of game genres */}
          <Route path="/genres" element={<GenresPage />} />
          {/* Genre detail route: shows details and games for a specific genre */}
          <Route path="/genre/:id" element={<GenreDetailPage />} />
          {/* Platforms route: shows a list of game platforms */}
          <Route path="/platforms" element={<PlatformsPage />} />
          {/* Platform detail route: shows details and games for a specific platform */}
          <Route path="/platform/:id" element={<PlatformDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
