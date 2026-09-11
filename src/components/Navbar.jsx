import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProfileMenu from './ProfileMenu';

export default function Navbar({ setView }) {
  const { user } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar">
      <span className="navbar-brand">Resonancia</span>
      <button className="navbar-avatar" onClick={() => setShowMenu(true)}>
        {user.name.charAt(0).toUpperCase()}
      </button>
      {showMenu && <ProfileMenu setView={setView} onClose={() => setShowMenu(false)} />}
    </nav>
  );
}
