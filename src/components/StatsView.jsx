import { useApp } from '../context/AppContext';

export default function StatsView() {
  const { history } = useApp();

  const counts = {};
  history.forEach((h) => { counts[h.artist] = (counts[h.artist] || 0) + 1; });
  const topArtist = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const songCounts = {};
  history.forEach((h) => { songCounts[h.title] = (songCounts[h.title] || 0) + 1; });
  const topSong = Object.entries(songCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div className="stats-page">
      <h2>Estadísticas de reproducción</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Reproducciones totales</span>
          <span className="stat-value">{history.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Artista principal</span>
          <span className="stat-value stat-value-sm">{topArtist}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Canción principal</span>
          <span className="stat-value stat-value-sm">{topSong}</span>
        </div>
      </div>
      <p className="stats-note">
        Las estadísticas se calculan con tu historial de reproducción reciente.
      </p>
    </div>
  );
}
