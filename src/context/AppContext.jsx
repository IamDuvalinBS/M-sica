import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext(null);
const ADMIN_EMAILS = ['admin@tuapp.com'];

// Traduce una fila de la tabla "canciones" (nombres en español)
// al formato que usa el resto de tu app (nombres en inglés)
function rowToSong(row) {
  return {
    id: row.id,
    title: row.titulo,
    artist: row.artista,
    genre: row.genero,
    status:
      row.estado === 'pendiente' ? 'pending' :
      row.estado === 'aprobada' ? 'approved' : 'rejected',
    uploadedBy: row.uploaded_by,
    audioUrl: row.url_archivo,
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    const { data, error } = await supabase
      .from('canciones')
      .select('*')
      .order('fecha_subida', { ascending: false });

    if (error) {
      console.error('Error cargando canciones:', error);
      return;
    }
    setSongs(data.map(rowToSong));
  }

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
    // 1. Nombre único para evitar choques entre archivos
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // 2. Sube el audio al bucket
    const { error: uploadError } = await supabase.storage
      .from('audios')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error subiendo archivo:', uploadError);
      throw uploadError;
    }

    // 3. Obtiene la URL pública del archivo
    const { data: urlData } = supabase.storage.from('audios').getPublicUrl(fileName);

    // 4. Guarda el registro en la tabla, pendiente de revisión
    const { data, error: insertError } = await supabase
      .from('canciones')
      .insert([{
        titulo: title,
        artista: artist,
        genero: genre,
        url_archivo: urlData.publicUrl,
        estado: 'pendiente',
        uploaded_by: user ? user.email : 'anonimo',
      }])
      .select();

    if (insertError) {
      console.error('Error guardando canción:', insertError);
      throw insertError;
    }

    setSongs((prev) => [rowToSong(data[0]), ...prev]);
  }

  async function approveSong(id) {
    const { error } = await supabase.from('canciones').update({ estado: 'aprobada' }).eq('id', id);
    if (error) { console.error(error); return; }
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s)));
  }

  async function rejectSong(id) {
    const { error } = await supabase.from('canciones').update({ estado: 'rechazada' }).eq('id', id);
    if (error) { console.error(error); return; }
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s)));
  }

  async function deleteSong(id) {
    const { error } = await supabase.from('canciones').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setSongs((prev) => prev.filter((s) => s.id !== id));
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
