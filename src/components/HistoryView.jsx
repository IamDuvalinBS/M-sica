import { useApp } from '../context/AppContext';

export default function HistoryView() {
  const { history } = useApp();

  return (
    <div className="history-page">
      <h2>Historial de reproducción</h2>
      {history.length === 0 && <p className="empty-state">Aún no has escuchado nada.</p>}
      <ul className="history-list">
        {history.map((h, i) => (
          <li key={i} className="history-item">
            <div className="history-cover">{h.title.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{h.title}</strong>
              <div className="history-meta">{h.artist} · {new Date(h.playedAt).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
