# YouTube Lesson Videos

Instructors and admins can add or edit a lesson's videos from **Manage Course → Lessons → Lesson Videos**. Paste a YouTube URL, enter its title and duration in seconds, and save. Videos are optional when creating a lesson; add them later from the lesson video screen.

Accepted URL forms include:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

The API validates the host and 11-character video ID, then stores a canonical watch URL in the existing `lesson_videos.video_url` column. No schema migration is needed. Create, update, and delete operations require an admin or the course's instructor; students must have active or completed enrollment to fetch lesson and video data.

Opening **Watch** from the student dashboard or lesson video list opens `/watch/{lesson_id}` in a new tab. The route requires login, fetches the lesson and its course playlist through the existing API, and embeds one selected video using YouTube's privacy-enhanced `youtube-nocookie.com` player. Lessons are ordered by their configured position; items without videos remain selectable and show an empty state.

Run the backend URL validation tests from `backend/`:

```powershell
.\venv\Scripts\python.exe -m unittest discover -s tests -v
```

Run the frontend checks from `frontend/`:

```powershell
npm run lint
npm run build
```
