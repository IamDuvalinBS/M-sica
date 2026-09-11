import { get, set, del } from 'idb-keyval';

export function saveAudioBlob(songId, file) {
  return set(`audio-${songId}`, file);
}

export async function getAudioObjectUrl(songId) {
  const blob = await get(`audio-${songId}`);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export function deleteAudioBlob(songId) {
  return del(`audio-${songId}`);
}
