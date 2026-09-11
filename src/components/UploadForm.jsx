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
      <h2>Subir una canciÃ³n</h2>
      <p className="upload-hint">
        Tu canciÃ³n entra a revisiÃ³n antes de ser pÃºblica. Solo sube mÃºsica
        propia o con licencia para distribuir.
      </p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          TÃ­tulo
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Artista
          <input value={artist} onChange={(e) => setArtist(e.target.value)} required />
        </label>
        <label>
          GÃ©nero
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
          Confirmo que esta mÃºsica es mÃ­a o tengo licencia para subirla
        </label>

        <button type="submit" className="btn-primary">
          Enviar a revisiÃ³n
        </button>
        {sent && <p className="upload-success">CanciÃ³n enviada. Queda pendiente de revisiÃ³n.</p>}
      </form>
    </div>
  );
}
// ====== CÃ³digo para controlar tu formulario de subida ======

const formularioMusica = document.querySelector('.upload-form');

if (formularioMusica) {
    formularioMusica.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1ï¸âƒ£ Capturamos lo que escribes en la pantalla de tu celular
        // (AsegÃºrate de que en tu HTML los <input> tengan id="url-input" e id="artista-input")
        const urlDeYoutube = document.querySelector('#url-input').value;
        const nombreDelArtista = document.querySelector('#artista-input').value;

        // 2ï¸âƒ£ Mandamos los datos a tu servidor de Render
        try {
            const respuesta = await fetch('https://onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    urlPlaylist: urlDeYoutube,
                    artista: nombreDelArtista,
                    contrasena: "ByDuva" // ðŸ‘ˆ Pon tu clave de Render aquÃ­
                })
            });

            const data = await respuesta.json();
            
            // 3ï¸âƒ£ Te muestra una alerta en el telÃ©fono avisando que ya empezÃ³ en la nube
            alert(data.mensaje); 
            
            // Limpiamos el formulario para que puedas meter otro link si quieres
            formularioMusica.reset();
            
        } catch (error) {
            console.error("Error al conectar con el motor:", error);
            alert("Hubo un error al conectar con tu motor de Render.");
        }
    });
}
