const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
]);

export function getYoutubeVideoId(value) {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    ) return null;

    let videoId = "";
    if (hostname === "youtu.be") {
      const pathParts = url.pathname.split("/").filter(Boolean);
      videoId = pathParts.length === 1 ? pathParts[0] : "";
    } else if (YOUTUBE_HOSTS.has(hostname)) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      } else {
        const [, route, id, ...rest] = url.pathname.split("/");
        if (["embed", "shorts", "live"].includes(route) && !rest.length) {
          videoId = id || "";
        }
      }
    }

    return VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(value) {
  const videoId = getYoutubeVideoId(value);
  return videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`
    : null;
}

export function getYoutubeThumbnail(value) {
  const videoId = getYoutubeVideoId(value);
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
}