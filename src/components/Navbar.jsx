import { useApp } from '../context/AppContext';

export default function Navbar({ view, setView }) {
  const { user, isAdmin, logout } = useApp();

  return (
    <nav className="navbar">
      <span className="navbar-brand">Resonancia</span>
      <div className="navbar-tabs">
        <button
          className={view === 'feed' ? 'tab active' : 'tab'}
          onClick={() => setView('feed')}
        >
          Explorar
        </button>
        <button
          className={view === 'upload' ? 'tab active' : 'tab'}
          onClick={() => setView('upload')}
        >
          Subir canción
        </button>
        {isAdmin && (
          <button
            className={view === 'admin' ? 'tab active' : 'tab'}
            onClick={() => setView('admin')}
          >
            Revisión
          </button>
        )}
      </div>
      <div className="navbar-user">
        <span>{user.name}</span>
        <button className="btn-logout" onClick={logout}>
          Salir
        </button>
      </div>
    </nav>
  );
}
