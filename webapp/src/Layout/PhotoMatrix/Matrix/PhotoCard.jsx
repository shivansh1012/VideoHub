import { ApiBaseUrl } from "../../../config.js";

export default function PhotoCard(photo) {
    let uploader = "Unknown"
    if (photo['uploader'] && photo.uploader !== null) uploader = photo.uploader.name
    return (
        <article className="photo-card">
            <img src={`${ApiBaseUrl}/stream/photo?id=${photo._id}`} alt={photo._id} />
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
