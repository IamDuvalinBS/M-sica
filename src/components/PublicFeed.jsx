import { useApp } from '../context/AppContext';
import SongCard from './SongCard';

export default function PublicFeed({ onPlay }) {
  const { songs } = useApp();
  const approved = songs.filter((s) => s.status === 'approved');
  const genres = [...new Set(approved.map((s) => s.genre || 'Otros'))];

  return (
    <div className="feed-page">
      {approved.length === 0 && <p className="empty-state">Aún no hay canciones públicas.</p>}

      {approved.length > 0 && (
        <section className="feed-section">
          <h2>Recomendado para ti</h2>
          <div className="song-grid">
            {approved.slice(0, 8).map((song) => (
              <SongCard key={song.id} song={song} onPlay={() => onPlay(song)} />
            ))}
          </div>
        </section>
      )}

      {genres.map((genre) => (
        <section key={genre} className="feed-section">
          <h2>{genre}</h2>
          <div className="song-grid">
            {approved.filter((s) => (s.genre || 'Otros') === genre).map((song) => (
              <SongCard key={song.id} song={song} onPlay={() => onPlay(song)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
