import re
from urllib.parse import parse_qs, urlsplit


YOUTUBE_VIDEO_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{11}$")
YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com"}


def extract_youtube_video_id(video_url: str) -> str:
    try:
        parsed_url = urlsplit(video_url.strip())
        hostname = (parsed_url.hostname or "").lower().rstrip(".")
    except ValueError as error:
        raise ValueError("Enter a valid YouTube video URL.") from error

    if (
        parsed_url.scheme not in {"http", "https"}
        or parsed_url.username
        or parsed_url.password
        or parsed_url.port is not None
    ):
        raise ValueError("Enter a valid YouTube video URL.")

    if hostname == "youtu.be":
        path_parts = parsed_url.path.strip("/").split("/")
        video_id = path_parts[0] if len(path_parts) == 1 else ""
    elif hostname in YOUTUBE_HOSTS:
        if parsed_url.path == "/watch":
            video_id = parse_qs(parsed_url.query).get("v", [""])[0]
        else:
            path_parts = parsed_url.path.strip("/").split("/")
            video_id = (
                path_parts[1]
                if len(path_parts) == 2
                and path_parts[0] in {"embed", "shorts", "live"}
                else ""
            )
    else:
        raise ValueError("Use a youtube.com or youtu.be video URL.")

    if not YOUTUBE_VIDEO_ID_PATTERN.fullmatch(video_id):
        raise ValueError("The YouTube URL does not contain a valid video ID.")

    return video_id


def normalize_youtube_video_url(video_url: str) -> str:
    video_id = extract_youtube_video_id(video_url)
    return f"https://www.youtube.com/watch?v={video_id}"