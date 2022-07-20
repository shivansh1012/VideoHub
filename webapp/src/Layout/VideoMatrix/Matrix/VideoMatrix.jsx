import VideoCard from "./VideoCard";
import "./VideoMatrix.css"

export default function VideoMatrix(props) {
    return (
        <div className="container">
            <div className="animate-bottom video-matrix">
                {
                    props.videoList.map((video, index) => {
                        if (props.videoList.length === index + 1) {
                            return (
                                <div key={video._id} ref={props.lastVideoElementRef}>
                                    {VideoCard(video)}
                                </div>
                            );
                        } else {
                            return (
                                <div key={video._id}>
                                    {VideoCard(video)}
                                </div>
                            );
                        }
                    })
                }
            </div>
        </div>
    )
}
