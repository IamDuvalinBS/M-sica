import { useApp } from '../context/AppContext';
import SongCard from './SongCard';

export default function PublicFeed({ onPlay }) {
  const { songs } = useApp();
  const approved = songs.filter((s) => s.status === 'approved');

  return (
    <div className="feed-page">
      <h2>Explorar</h2>
      {approved.length === 0 && (
        <p className="empty-state">Aún no hay canciones públicas.</p>
      )}
      <div className="song-grid">
        {approved.map((song) => (
          <SongCard key={song.id} song={song} onPlay={() => onPlay(song)} />
        ))}
      </div>
    </div>
  );
}
