import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Player({ song }) {
  const { recordPlay } = useApp();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!song) return;
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
    recordPlay(song);
  }, [song]);

  function togglePlay() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }

  function handleSeek(e) {
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setProgress(value);
  }

  if (!song) {
    return (
      <div className="player player-empty">
        <span>Elige una canción para reproducir</span>
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onTimeUpdate={(e) => setProgress(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      <button className="player" onClick={() => setExpanded(true)}>
        <div className="player-cover-mini">{song.title.charAt(0).toUpperCase()}</div>
        <div className="player-info">
          <strong>{song.title}</strong>
          <span className="player-artist">{song.artist}</span>
        </div>
        <span className="btn-play-mini" role="button" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
          {isPlaying ? '⏸' : '▶'}
        </span>
      </button>

      {expanded && (
        <div className="full-player">
          <button className="full-player-close" onClick={() => setExpanded(false)}>Cerrar ⌄</button>
          <div className="full-player-cover">{song.title.charAt(0).toUpperCase()}</div>
          <h2 className="full-player-title">{song.title}</h2>
          <p className="full-player-artist">{song.artist}</p>
          <div className={isPlaying ? 'equalizer playing' : 'equalizer'}>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <input type="range" className="seek-bar" min={0} max={duration || 0} value={progress} onChange={handleSeek} />
          <div className="time-row">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <button className="btn-play-big" onClick={togglePlay}>
            {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
          </button>
        </div>
      )}
    </>
  );
}
