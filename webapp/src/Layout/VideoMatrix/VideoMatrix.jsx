import { Link } from "react-router-dom";
import { SourceBaseUrl } from "../../config.js";

export default function VideoMatrix(props) {
    const Cards = (video) => {
        return (
            <div className="card border-0 bg-transparent" style={{ "borderRadius": "20px" }}>
                <Link to={`/video/${video._id}`}>
                    <img src={`${SourceBaseUrl}/thumbnails/${video.filename}.jpg`} className="card-img-top" alt={video.filename} style={{ "borderRadius": "20px" }} />
                </Link>
                <div className="card-body">
                    <h5 className="card-title">{video.channel['name']}</h5>
                    <p className="card-text">{video.filename}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="container">
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {
                    props.videoList.map((video, i) => {
                        if (props.lastVideoElementRef && props.videoList.length === i + 1)
                            return (
                                <div className="col" key={video._id} ref={props.lastVideoElementRef}>
                                    {Cards(video)}
                                </div>
                            )
                        else
                            return (
                                <div className="col" key={video._id}>
                                    {Cards(video)}
                                </div>
                            )
                    })
                }
            </div>
        </div>
    );
}
