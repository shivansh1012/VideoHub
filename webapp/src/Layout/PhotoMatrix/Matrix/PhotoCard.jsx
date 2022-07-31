import { ApiBaseUrl } from "../../../config.js";
import { Link } from "react-router-dom";
import "./PhotoCard.css"

export default function PhotoCard(photo) {
    const uploader = () => {
        if (!photo['uploader'] && photo.uploader === null) {
            return <div className="photo-uploader" title="Unknown">
                Unknown
            </div>
        } else {
            return <div className="photo-uploader">
                <Link to={`/profile/${photo.uploader._id}`} title={photo.uploader.name}>
                    {photo.uploader.name}
                </Link>
                {features()}
            </div>
        }
    }

    const features = () => {
        if (photo.features.length !== 0) {
            return <>
                &nbsp;&#40;
                {
                    photo.features.map((feature, index) => {
                        return <Link to={`/profile/${feature._id}`} title={feature.name} key={feature._id}>
                            &nbsp;{feature.name}{index !== photo.features.length - 1 && <>,</>}
                        </Link>
                    })
                }
                &nbsp;&#41;
            </>
        }
    }
    return (
        <article className="photo-card">
            <Link to={`/photo/${photo._id}`}>
                <header>
                    <img src={`${ApiBaseUrl}/stream/photo?id=${photo._id}`} alt={photo._id} />
                </header>
            </Link>
            <footer>
                <div className="photo-title" title={photo.title}>
                    <Link to={`/photo/${photo._id}`}>
                        {photo.title}
                    </Link>
                </div>
                {uploader()}
            </footer>
        </article>
    )
}
