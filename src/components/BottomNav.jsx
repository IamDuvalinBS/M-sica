import { useApp } from '../context/AppContext';

export default function BottomNav({ view, setView }) {
  const { isAdmin } = useApp();

  const items = [
    { id: 'feed', label: 'Inicio', icon: '🏠' },
    { id: 'history', label: 'Historial', icon: '🕒' },
    { id: 'upload', label: 'Subir', icon: '⬆' },
  ];
  if (isAdmin) items.push({ id: 'admin', label: 'Revisión', icon: '✔' });

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={view === item.id ? 'bottom-nav-item active' : 'bottom-nav-item'}
          onClick={() => setView(item.id)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
