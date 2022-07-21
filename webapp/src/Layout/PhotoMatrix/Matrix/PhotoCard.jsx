import { ApiBaseUrl } from "../../../config.js";
import { Link } from "react-router-dom";
import "./PhotoCard.css"

export default function PhotoCard(photo) {
    let uploader = "Unknown"
    if (photo['uploader'] && photo.uploader !== null) uploader = photo.uploader.name
    return (
        <article className="photo-card">
            <Link to={`/photo/${photo._id}`}>
                <header>
                    <img src={`${ApiBaseUrl}/stream/photo?id=${photo._id}`} alt={photo._id} />
                </header>
            </Link>
            <footer>
                <div>
                    {photo.title}
                </div>
                <div>
                    {uploader}
                </div>
            </footer>
        </article>
    )
}
