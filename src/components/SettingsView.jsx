import { useState } from 'react';

const SECTIONS = [
  { icon: '👤', title: 'Cuenta', desc: 'Nombre de usuario · Cerrar cuenta' },
  { icon: '🎵', title: 'Contenido y visualización', desc: 'Permitir contenido explícito' },
  { icon: '🔒', title: 'Privacidad', desc: 'Sesión privada · Historial visible' },
  { icon: '🔔', title: 'Notificaciones', desc: 'Push · Email' },
];

export default function SettingsView() {
  const [dataSaver, setDataSaver] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  return (
    <div className="settings-page">
      <h2>Configuración</h2>

      <div className="settings-toggle-row">
        <div className="settings-toggle-card">
          <span>Modo ahorro de datos</span>
          <button className={dataSaver ? 'toggle on' : 'toggle'} onClick={() => setDataSaver(!dataSaver)}>
            <span className="toggle-dot" />
          </button>
        </div>
        <div className="settings-toggle-card">
          <span>Reproducción automática</span>
          <button className={autoplay ? 'toggle on' : 'toggle'} onClick={() => setAutoplay(!autoplay)}>
            <span className="toggle-dot" />
          </button>
        </div>
      </div>

      <ul className="settings-list">
        {SECTIONS.map((s) => (
          <li key={s.title} className="settings-item">
            <span className="settings-icon">{s.icon}</span>
            <div>
              <strong>{s.title}</strong>
              <div className="settings-desc">{s.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
