import { useApp } from '../context/AppContext';

export default function ProfileMenu({ setView, onClose }) {
  const { user, logout } = useApp();

  function go(view) {
    setView(view);
    onClose();
  }

  return (
    <div className="profile-menu-overlay" onClick={onClose}>
      <div className="profile-menu" onClick={(e) => e.stopPropagation()}>
        <div className="profile-menu-header">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{user.name}</strong>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>
        <button className="profile-menu-item" onClick={() => go('stats')}>
          📊 Estadísticas de reproducción
        </button>
        <button className="profile-menu-item" onClick={() => go('settings')}>
          ⚙️ Configuración y privacidad
        </button>
        <button className="profile-menu-item danger" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
