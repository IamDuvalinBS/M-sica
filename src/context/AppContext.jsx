import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

// Cuenta que actúa como dueño/admin de la app.
// En producción esto vendría del backend (ej. un campo "role" en tu base de datos),
// no de una lista fija en el código.
const ADMIN_EMAILS = ['admin@tuapp.com'];

const STORAGE_KEY = 'proyecto-musica-state-v1';

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('No se pudo leer el estado guardado', e);
  }
  return {
    songs: [
      {
        id: 'demo-1',
        title: 'Amanecer en la Ciudad',
        artist: 'Luna Reyes',
        genre: 'Indie',
        status: 'approved',
        uploadedBy: 'demo@tuapp.com',
        audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8a5b0f0b0.mp3',
        cover: null,
      },
    ],
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState(() => loadInitialState().songs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ songs }));
  }, [songs]);

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false;

  function loginWithGoogle(mockEmail, mockName) {
    setUser({ email: mockEmail, name: mockName });
  }

  function logout() {
    setUser(null);
  }

  function uploadSong({ title, artist, genre, audioUrl }) {
    const newSong = {
      id: crypto.randomUUID(),
      title,
      artist,
      genre,
      status: 'pending',
      uploadedBy: user.email,
      audioUrl,
      cover: null,
    };
    setSongs((prev) => [newSong, ...prev]);
  }

  function approveSong(id) {
    setSongs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
    );
  }

  function rejectSong(id) {
    setSongs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
  }

  const value = {
    user,
    isAdmin,
    songs,
    loginWithGoogle,
    logout,
    uploadSong,
    approveSong,
    rejectSong,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
