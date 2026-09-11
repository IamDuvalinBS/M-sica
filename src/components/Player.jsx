import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { songGradient } from '../utils/colors';

function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const BAR_COUNT = 24;

export default function Player({ song }) {
  const { recordPlay } = useApp();
  const audioRef = useRef(null);
  const barsRef = useRef([]);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [mode, setMode] = useState('original');

  useEffect(() => {
    if (!song) return;
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
    recordPlay(song);
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: 'Resonancia',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => togglePlay());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  function setupAnalyser() {
    if (audioCtxRef.current) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
  }

  function drawFrame() {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    barsRef.current.forEach((el, i) => {
      if (!el) return;
      const value = data[i] || 0;
      el.style.height = `${6 + (value / 255) * 46}px`;
    });
    rafRef.current = requestAnimationFrame(drawFrame);
  }

  function togglePlay() {
    setupAnalyser();
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();

    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(rafRef.current);
    } else {
      audioRef.current.play().catch(() => {});
      drawFrame();
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
        crossOrigin="anonymous"
        onTimeUpdate={(e) => setProgress(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={() => { setIsPlaying(false); cancelAnimationFrame(rafRef.current); }}
      />

      <button className="player" onClick={() => setExpanded(true)}>
        <div className="player-cover-mini" style={{ background: songGradient(song.id) }}>
          {song.title.charAt(0).toUpperCase()}
        </div>
        <div className="player-info">
          <strong>{song.title}</strong>
          <span className="player-artist">{song.artist}</span>
        </div>
        <span className="btn-play-mini" role="button" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
          {isPlaying ? '⏸' : '▶'}
        </span>
      </button>

      {expanded && (
        <div className="full-player" style={{ background: `linear-gradient(180deg, ${songGradient(song.id).match(/#[0-9A-Fa-f]{6}/)[0]}33, var(--bg) 60%)` }}>
          <div className="full-player-topbar">
            <button className="full-player-close" onClick={() => setExpanded(false)}>⌄</button>
            <button className="full-player-mode-btn" onClick={() => setShowModeMenu((v) => !v)}>Modo ▾</button>
          </div>

          {showModeMenu && (
            <div className="mode-menu">
              <button
                className={mode === 'original' ? 'mode-item active' : 'mode-item'}
                onClick={() => { setMode('original'); setShowModeMenu(false); }}
              >
                Original
              </button>
              <button className="mode-item disabled" disabled>
                Instrumental (próximamente — requiere IA de separación)
              </button>
              <button className="mode-item disabled" disabled>
                Solo voz (próximamente — requiere IA de separación)
              </button>
            </div>
          )}

          <div className="full-player-cover" style={{ background: songGradient(song.id) }}>
            {song.title.charAt(0).toUpperCase()}
          </div>

          <h2 className="full-player-title">{song.title}</h2>
          <p className="full-player-artist">{song.artist}</p>

          <div className="equalizer-real">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <span key={i} ref={(el) => (barsRef.current[i] = el)} />
            ))}
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
