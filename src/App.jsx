import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import UploadForm from './components/UploadForm';
import AdminReviewQueue from './components/AdminReviewQueue';
import PublicFeed from './components/PublicFeed';
import HistoryView from './components/HistoryView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import Player from './components/Player';
import './styles/index.css';

function Shell() {
  const { user } = useApp();
  const [view, setView] = useState('feed');
  const [nowPlaying, setNowPlaying] = useState(null);

  if (!user) return <LoginScreen />;

  return (
    <div className="app-shell">
      <Navbar setView={setView} />
      <main className="app-content">
        {view === 'feed' && <PublicFeed onPlay={setNowPlaying} />}
        {view === 'history' && <HistoryView />}
        {view === 'upload' && <UploadForm />}
        {view === 'admin' && <AdminReviewQueue />}
        {view === 'stats' && <StatsView />}
        {view === 'settings' && <SettingsView />}
      </main>
      <Player song={nowPlaying} />
      <BottomNav view={view} setView={setView} />
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
