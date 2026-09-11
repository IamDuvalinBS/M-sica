export default function SongCard({ song, onPlay }) {
  return (
    <button className="song-card" onClick={onPlay}>
      <div className="song-cover" aria-hidden="true">
        {song.title.charAt(0).toUpperCase()}
      </div>
      <div className="song-info">
        <span className="song-title">{song.title}</span>
        <span className="song-artist">{song.artist}</span>
      </div>
    </button>
  );
}
