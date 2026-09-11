import { useApp } from '../context/AppContext';

const LABELS = { pending: 'Pendiente', approved: 'Publicada', rejected: 'Rechazada' };

export default function AdminReviewQueue() {
  const { songs, approveSong, rejectSong, deleteSong } = useApp();
  const pending = songs.filter((s) => s.status === 'pending');
  const rest = songs.filter((s) => s.status !== 'pending');

  function confirmDelete(song) {
    if (window.confirm(`¿Eliminar "${song.title}" definitivamente? Esta acción no se puede deshacer.`)) {
      deleteSong(song.id);
    }
  }

  return (
    <div className="admin-page">
      <h2>Cola de revisión</h2>
      {pending.length === 0 && <p className="empty-state">No hay canciones pendientes.</p>}
      <ul className="review-list">
        {pending.map((song) => (
          <li key={song.id} className="review-item">
            <div>
              <strong>{song.title}</strong> — {song.artist}
              <div className="review-meta">{song.genre || 'Sin género'} · subida por {song.uploadedBy}</div>
            </div>
            <div className="review-actions">
              <button className="btn-approve" onClick={() => approveSong(song.id)}>Aprobar</button>
              <button className="btn-reject" onClick={() => rejectSong(song.id)}>Rechazar</button>
              <button className="btn-delete" onClick={() => confirmDelete(song)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 32 }}>Toda la biblioteca</h2>
      {rest.length === 0 && <p className="empty-state">No hay más canciones todavía.</p>}
      <ul className="review-list">
        {rest.map((song) => (
          <li key={song.id} className="review-item">
            <div>
              <strong>{song.title}</strong> — {song.artist}
              <div className="review-meta">{LABELS[song.status]} · {song.uploadedBy}</div>
            </div>
            <div className="review-actions">
              <button className="btn-delete" onClick={() => confirmDelete(song)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
