import { useApp } from '../context/AppContext';

export default function AdminReviewQueue() {
  const { songs, approveSong, rejectSong } = useApp();
  const pending = songs.filter((s) => s.status === 'pending');

  return (
    <div className="admin-page">
      <h2>Cola de revisión</h2>
      {pending.length === 0 && <p className="empty-state">No hay canciones pendientes.</p>}

      <ul className="review-list">
        {pending.map((song) => (
          <li key={song.id} className="review-item">
            <div>
              <strong>{song.title}</strong> — {song.artist}
              <div className="review-meta">
                {song.genre || 'Sin género'} · subida por {song.uploadedBy}
              </div>
            </div>
            <div className="review-actions">
              <button className="btn-approve" onClick={() => approveSong(song.id)}>
                Aprobar
              </button>
              <button className="btn-reject" onClick={() => rejectSong(song.id)}>
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
