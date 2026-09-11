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
      // 🚀 Envía la orden directa a tu motor de Render en la nube
      const respuesta = await fetch('https://onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urlPlaylist: youtubeUrl,
          artista: artist,
          contrasena: "ByDuva" // Tu clave del motor
        })
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert(data.mensaje); // "Sincronización iniciada..."
        setSent(true);
        // Limpiamos los inputs en tu celular
        setYoutubeUrl('');
        setArtist('');
        setGenre('');
      } else {
        alert("Aviso del servidor: " + data.error);
      }

    } catch (error) {
      console.error("Error al conectar con el motor:", error);
      alert("Hubo un error al conectar con tu motor de Render.");
    } finally {
      setCargando(false);
      setTimeout(() => setSent(false), 4000);
    }
  }

  return (
    <div className="upload-page">
      <h2>Descargar Música</h2>
      <p className="upload-hint">
        Pega el enlace de un video o una playlist completa de YouTube. El motor la procesará 
        en segundo plano y la guardará en tu cuenta de Supabase.
      </p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Enlace de YouTube / Playlist
          <input 
            type="text"
            placeholder="https://youtube.com..."
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
          Género (Opcional)
          <input 
            type="text"
            placeholder="Ej: Reggaeton"
            value={genre} 
            onChange={(e) => setGenre(e.target.value)} 
          />
        </label>

        <button type="submit" className="btn-primary" disabled={cargando}>
          {cargando ? "Conectando al motor..." : "Iniciar Descarga Automática"}
        </button>

        {sent && <p className="upload-success">¡Orden enviada! Puedes cerrar la pestaña, la descarga sigue en segundo plano.</p>}
      </form>
    </div>
  );
}
