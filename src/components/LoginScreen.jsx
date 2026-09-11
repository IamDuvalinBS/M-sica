import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { loginWithGoogle } = useApp();

  function handleGoogleLogin() {
    loginWithGoogle('yo@gmail.com', 'Usuario Demo');
  }

  function handleAdminLogin() {
    loginWithGoogle('admin@tuapp.com', 'Dueño de la App');
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1 className="login-title">Resonancia</h1>
        <p className="login-subtitle">
          Música subida por artistas independientes, sin anuncios.
        </p>
        <button className="btn-google" onClick={handleGoogleLogin}>
          Continuar con Google
        </button>
        <button className="btn-admin" onClick={handleAdminLogin}>
          Entrar como dueño (demo)
        </button>
      </div>
    </div>
  );
}
