import { useState } from 'react';

export default function UploadForm() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [sent, setSent] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!youtubeUrl || !artist) return;

    setCargando(true);

    try {
      // Conexión directa a tu motor de Render en la nube
      const respuesta = await fetch('https://onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urlPlaylist: youtubeUrl,
          artista: artist,
          contrasena: "ByDuva" // Tu clave secreta
        })
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert(data.mensaje); // Te saldrá el aviso en el celular
        setSent(true);
        setYoutubeUrl('');
        setArtist('');
        setGenre('');
      } else {
        alert("Error: " + data.error);
      }

    } catch (error) {
      console.error("Error conectando al motor:", error);
      alert("No se pudo conectar con el motor de Render.");
    } finally {
      setCargando(false);
      setTimeout(() => setSent(false), 4000);
    }
  }

  return (
    <div className="upload-page">
      <h2>Subir una canción</h2>
      <p className="upload-hint">
        Pega el enlace de un video o una playlist de YouTube. El motor la procesará 
        en segundo plano y la guardará automáticamente en tu Supabase.
      </p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Enlace de YouTube / Playlist
          <input 
            type="text" 
            placeholder="https://www.youtube.com/..."
            value={youtubeUrl} 
            onChange={(e) => setYoutubeUrl(e.target.value)} 
            required 
          />
        </label>
        
        <label>
          Artista
          <input 
            type="text" 
            placeholder="Ej: Bad Bunny"
            value={artist} 
            onChange={(e) => setArtist(e.target.value)} 
            required 
          />
        </label>
        
        <label>
          Género
          <input 
            type="text" 
            placeholder="Ej: Reggaeton"
            value={genre} 
            onChange={(e) => setGenre(e.target.value)} 
          />
        </label>

        {/* Mantiene el diseño exacto de tu index.css */}
        <button type="submit" className="btn-primary" disabled={cargando}>
          {cargando ? "Conectando al motor..." : "Iniciar Descarga"}
        </button>

        {sent && <p className="upload-success">Canción enviada. La descarga sigue en segundo plano.</p>}
      </form>
    </div>
  );
}
