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

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !artist || !file || !confirmed) return;

    const audioUrl = URL.createObjectURL(file);
    uploadSong({ title, artist, genre, audioUrl });

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
