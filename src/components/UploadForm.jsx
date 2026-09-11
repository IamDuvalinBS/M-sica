import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function UploadForm() {
  const { uploadSong } = useApp();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [file, setFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !artist || !file || !confirmed) return;

    await uploadSong({ title, artist, genre, file });

    setTitle('');
    setArtist('');
    setGenre('');
    setFile(null);
    setConfirmed(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="upload-page">
      <h2>Subir una canción</h2>
      <p className="upload-hint">
        Tu canción entra a revisión antes de ser pública. Solo sube música
        propia o con licencia para distribuir.
      </p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Artista
          <input value={artist} onChange={(e) => setArtist(e.target.value)} required />
        </label>
        <label>
          Género
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />
        </label>
        <label>
          Archivo de audio
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          Confirmo que esta música es mía o tengo licencia para subirla
        </label>

        <button type="submit" className="btn-primary">
          Enviar a revisión
        </button>
        {sent && <p className="upload-success">Canción enviada. Queda pendiente de revisión.</p>}
      </form>
    </div>
  );
}
// ====== Código para controlar tu formulario de subida ======

const formularioMusica = document.querySelector('.upload-form');

if (formularioMusica) {
    formularioMusica.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1️⃣ Capturamos lo que escribes en la pantalla de tu celular
        // (Asegúrate de que en tu HTML los <input> tengan id="url-input" e id="artista-input")
        const urlDeYoutube = document.querySelector('#url-input').value;
        const nombreDelArtista = document.querySelector('#artista-input').value;

        // 2️⃣ Mandamos los datos a tu servidor de Render
        try {
            const respuesta = await fetch('https://onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    urlPlaylist: urlDeYoutube,
                    artista: nombreDelArtista,
                    contrasena: "AQUÍ_PON_LA_CONTRASEÑA_QUE_ELEGISTE_EN_RENDER" // 👈 Pon tu clave de Render aquí
                })
            });

            const data = await respuesta.json();
            
            // 3️⃣ Te muestra una alerta en el teléfono avisando que ya empezó en la nube
            alert(data.mensaje); 
            
            // Limpiamos el formulario para que puedas meter otro link si quieres
            formularioMusica.reset();
            
        } catch (error) {
            console.error("Error al conectar con el motor:", error);
            alert("Hubo un error al conectar con tu motor de Render.");
        }
    });
          }
