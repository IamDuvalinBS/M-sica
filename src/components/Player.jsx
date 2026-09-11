import { useEffect, useRef, useState } from 'react';

export default function Player({ song }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!song) return;
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }, [song]);

  function togglePlay() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }

  if (!song) {
    return (
      <div className="player player-empty">
        <span>Elige una canción para reproducir</span>
      </div>
    );
  }

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="player-info">
        <strong>{song.title}</strong>
        <span> — {song.artist}</span>
      </div>
      <button className="btn-play" onClick={togglePlay}>
        {isPlaying ? 'Pausar' : 'Reproducir'}
      </button>
    </div>
  );
}
