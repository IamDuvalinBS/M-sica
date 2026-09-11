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
  const bassRef = useRef(null);
  const midRef = useRef(null);
  const trebleRef = useRef(null);
  const rafRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showEq, setShowEq] = useState(false);
  const [mode, setMode] = useState('original');
  const [eq, setEq] = useState({ bass: 0, mid: 0, treble: 0 });

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

  function setupAudioGraph() {
    if (audioCtxRef.current) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);

    const bass = ctx.createBiquadFilter();
    bass.type = 'lowshelf';
    bass.frequency.value = 200;

    const mid = ctx.createBiquadFilter();
    mid.type = 'peaking';
    mid.frequency.value = 1000;
    mid.Q.value = 0.8;

    const treble = ctx.createBiquadFilter();
    treble.type = 'highshelf';
    treble.frequency.value = 4000;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;

    source.connect(bass);
    bass.connect(mid);
    mid.connect(treble);
    treble.connect(analyser);
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    bassRef.current = bass;
    midRef.current = mid;
    trebleRef.current = treble;
  }

  function handleEqChange(band, value) {
    const val = Number(value);
    setEq((prev) => ({ ...prev, [band]: val }));
    const node = band === 'bass' ? bassRef.current : band === 'mid' ? midRef.current : trebleRef.current;
    if (node) node.gain.value = val;
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
    setupAudioGraph();
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
        <div className="full-player">
          <div className="full-player-topbar">
            <button className="full-player-close" onClick={() => setExpanded(false)}>⌄</button>
            <div className="full-player-topbar-actions">
              <button className="full-player-mode-btn" onClick={() => { setShowEq((v) => !v); setShowModeMenu(false); }}>EQ</button>
              <button className="full-player-mode-btn" onClick={() => { setShowModeMenu((v) => !v); setShowEq(false); }}>Modo ▾</button>
            </div>
          </div>

          {showModeMenu && (
            <div className="mode-menu">
              <button className={mode === 'original' ? 'mode-item active' : 'mode-item'} onClick={() => { setMode('original'); setShowModeMenu(false); }}>
                Original
              </button>
              <button className="mode-item disabled" disabled>Instrumental (próximamente — requiere IA de separación)</button>
              <button className="mode-item disabled" disabled>Solo voz (próximamente — requiere IA de separación)</button>
            </div>
          )}

          {showEq && (
            <div className="eq-panel">
              {[['bass', 'Graves'], ['mid', 'Medios'], ['treble', 'Agudos']].map(([key, label]) => (
                <div key={key} className="eq-row">
                  <span className="eq-label">{label}</span>
                  <input
                    type="range" min={-15} max={15} step={1}
                    value={eq[key]}
                    onChange={(e) => handleEqChange(key, e.target.value)}
                  />
                  <span className="eq-value">{eq[key] > 0 ? `+${eq[key]}` : eq[key]} dB</span>
                </div>
              ))}
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
