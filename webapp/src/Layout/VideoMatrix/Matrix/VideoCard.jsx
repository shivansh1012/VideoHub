import { Link } from "react-router-dom";
import { ApiBaseUrl } from "../../../config.js";
import "./VideoCard.css"

export default function VideoCard(video) {
    return (
        <article className="video-card">
            <Link to={`/video/${video._id}`}>
                <header>
                    <img src={`${ApiBaseUrl}/static/uploads/thumbnails/${video.thumbnail.filename}`} alt={video.title} />
                </header>
            </Link>
            <footer>
                <Link to={`/video/${video._id}`}>
                    <div className="video-title" title={video.title}>
                        {video.title}
                    </div>
                </Link>
                {
                    !video['uploader'] && video.uploader === null &&
                    <div className="video-uploader" title="Unknown">
                        Unknown
                    </div>
                }
                {
                    video['uploader'] && video.uploader !== null &&
                    <Link to={`/profile/${video.uploader._id}`}>
                        <div className="video-uploader" title={video.uploader.name}>
                            {video.uploader.name}
                        </div>
                    </Link>
                }

            </footer>
        </article>
    )
}
