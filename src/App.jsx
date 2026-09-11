import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import UploadForm from './components/UploadForm';
import AdminReviewQueue from './components/AdminReviewQueue';
import PublicFeed from './components/PublicFeed';
import Player from './components/Player';
import './styles/index.css';

function Shell() {
  const { user } = useApp();
  const [view, setView] = useState('feed');
  const [nowPlaying, setNowPlaying] = useState(null);

  if (!user) return <LoginScreen />;

  return (
    <div className="app-shell">
      <Navbar view={view} setView={setView} />
      <main className="app-content">
        {view === 'feed' && <PublicFeed onPlay={setNowPlaying} />}
        {view === 'upload' && <UploadForm />}
        {view === 'admin' && <AdminReviewQueue />}
      </main>
      <Player song={nowPlaying} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
