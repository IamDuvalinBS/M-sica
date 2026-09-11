import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useApp();

  return (
    <nav className="navbar">
      <span className="navbar-brand">Resonancia</span>
      <div className="navbar-user">
        <span>{user.name}</span>
        <button className="btn-logout" onClick={logout}>Salir</button>
      </div>
    </nav>
  );
}
