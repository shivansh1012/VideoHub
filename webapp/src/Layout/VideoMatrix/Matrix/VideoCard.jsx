import { ApiBaseUrl } from "../../../config.js";

export default function VideoCard(video) {
    let uploader = "Unknown"
    if (video['uploader'] && video.uploader !== null) uploader = video.uploader.name
    return (
        <article className="video-card">
            <header>
                <img src={`${ApiBaseUrl}/static/uploads/thumbnails/${video.thumbnail.filename}`} alt={video.title} />
            </header>
            <footer>
                <div>
                    {video.title}
                </div>
                <div>
                    {uploader}
                </div>
            </footer>
        </article>
    )
}
