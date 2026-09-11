const PALETTE = [
  ['#7F77DD', '#3C3489'], // púrpura
  ['#1DB954', '#0F6E38'], // verde spotify-like
  ['#D85A30', '#712B13'], // coral
  ['#D4537E', '#72243E'], // rosa
  ['#378ADD', '#0C447C'], // azul
  ['#EF9F27', '#854F0B'], // ámbar
  ['#5DCAA5', '#085041'], // teal
  ['#E24B4A', '#791F1F'], // rojo
];

export function songGradient(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const [from, to] = PALETTE[hash % PALETTE.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}
