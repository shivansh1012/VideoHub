import { Link } from "react-router-dom";
import { ApiBaseUrl } from "../../../config.js";
import "./VideoCard.css"

export default function VideoCard(video) {
    const uploader = () => {
        if (!video['uploader'] && video.uploader === null) {
            return <div className="video-uploader" title="Unknown">
                Unknown
            </div>
        } else {
            return <div>
                <Link to={`/profile/${video.uploader._id}`} title={video.uploader.name} className="video-uploader">
                    {video.uploader.name}
                </Link>
                {features()}
            </div>
        }
    }

    const features = () => {
        if (video.features.length !== 0) {
            return <>
                &nbsp;&#40;
                {
                    video.features.map((feature, index) => {
                        return <Link to={`/profile/${feature._id}`} title={feature.name} key={feature._id} className="video-feature">
                            &nbsp;{feature.name}{index !== video.features.length - 1 && <>,</>}
                        </Link>
                    })
                }
                &nbsp;&#41;
            </>
        }
    }

    return (
        <article className="video-card">
            <Link to={`/video/${video._id}`}>
                <header>
                    <img src={`${ApiBaseUrl}/static/uploads/thumbnails/${video.thumbnail.filename}`} alt={video.title} />
                </header>
            </Link>
            <footer>
                <div className="video-title" title={video.title}>
                    <Link to={`/video/${video._id}`}>
                        {video.title}
                    </Link>
                </div>
                {uploader()}

            </footer>
        </article>
    )
}
