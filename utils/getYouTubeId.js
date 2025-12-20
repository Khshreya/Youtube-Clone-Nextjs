export function getYouTubeId(url) {
  const regExp =
    /(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}
