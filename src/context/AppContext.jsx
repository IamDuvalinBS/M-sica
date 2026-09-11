import { createContext, useContext, useEffect, useState } from 'react';
import { saveAudioBlob, getAudioObjectUrl, deleteAudioBlob } from '../utils/audioStore';

const AppContext = createContext(null);
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
        isLocalAudio: false,
      },
    ],
    history: [],
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState(() => loadInitialState().songs);
  const [history, setHistory] = useState(() => loadInitialState().history || []);

  useEffect(() => {
    const toSave = { songs: songs.map(({ audioUrl, ...rest }) => rest), history };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [songs, history]);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const updated = await Promise.all(
        songs.map(async (s) => {
          if (s.isLocalAudio && !s.audioUrl) {
            const url = await getAudioObjectUrl(s.id);
            return { ...s, audioUrl: url };
          }
          return s;
        })
      );
      if (!cancelled) setSongs(updated);
    }
    hydrate();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function recordPlay(song) {
    setHistory((prev) => {
      const withoutDup = prev.filter((h) => h.songId !== song.id);
      return [{ songId: song.id, title: song.title, artist: song.artist, playedAt: Date.now() }, ...withoutDup].slice(0, 30);
    });
  }

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false;

  function loginWithGoogle(mockEmail, mockName) {
    setUser({ email: mockEmail, name: mockName });
  }

  function logout() {
    setUser(null);
  }

  async function uploadSong({ title, artist, genre, file }) {
    const id = crypto.randomUUID();
    await saveAudioBlob(id, file);
    const audioUrl = URL.createObjectURL(file);
    const newSong = {
      id, title, artist, genre,
      status: 'pending',
      uploadedBy: user.email,
      audioUrl,
      isLocalAudio: true,
    };
    setSongs((prev) => [newSong, ...prev]);
  }

  function approveSong(id) {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s)));
  }

  function rejectSong(id) {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s)));
  }

  function deleteSong(id) {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    deleteAudioBlob(id).catch(() => {});
  }

  const value = {
    user, isAdmin, songs, history,
    recordPlay, loginWithGoogle, logout,
    uploadSong, approveSong, rejectSong, deleteSong,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
             }
