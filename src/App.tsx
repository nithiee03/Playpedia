import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import GenresPage from './pages/GenresPage';
import PlatformsPage from './pages/PlatformsPage';
import DevelopersPage from './pages/DevelopersPage';
import GenreDetailPage from './pages/GenreDetailPage';
import PlatformDetailPage from './pages/PlatformDetailPage';
import DeveloperDetailPage from './pages/DeveloperDetailPage';
import CreatorsPage from './pages/CreatorsPage';
import CreatorDetailPage from './pages/CreatorDetailPage';
import StoresPage from './pages/StoresPage';
import TagsPage from './pages/TagsPage';
import PublishersPage from './pages/PublishersPage';
import StoreDetailPage from './pages/StoreDetailPage';
import TagDetailPage from './pages/TagDetailPage';
import PublisherDetailPage from './pages/PublisherDetailPage';
import './App.css';

// App component: sets up routing for the app
function App() {
  return (
    <Router>
      <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
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
            {/* Creators route: shows a list of game creators */}
            <Route path="/creators" element={<CreatorsPage />} />
            {/* Creator detail route: shows details and games for a specific creator */}
            <Route path="/creator/:id" element={<CreatorDetailPage />} />
            {/* Stores route: shows a list of game stores */}
            <Route path="/stores" element={<StoresPage />} />
            {/* Store detail route: shows details and games for a specific store */}
            <Route path="/store/:id" element={<StoreDetailPage />} />
            {/* Tags route: shows a list of game tags */}
            <Route path="/tags" element={<TagsPage />} />
            {/* Tag detail route: shows details and games for a specific tag */}
            <Route path="/tag/:id" element={<TagDetailPage />} />
            {/* Publishers route: shows a list of game publishers */}
            <Route path="/publishers" element={<PublishersPage />} />
            {/* Publisher detail route: shows details and games for a specific publisher */}
            <Route path="/publisher/:id" element={<PublisherDetailPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
