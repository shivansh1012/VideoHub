import { Link } from "react-router-dom";
import { SourceBaseUrl } from "../../config.js";
import "./VideoMatrixColumn.css"

export default function VideoMatrixColumn(props) {
    function fancyTimeFormat(duration) {
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    const Cards = (video) => {
        let channelOrModel = ""
        if (video.channel && video.channel != null) {
            channelOrModel = video.channel.name
        } else if (video.model.length !== 0) {
            channelOrModel = video.model['0'].name
        } else {
            channelOrModel = ""
        }
        return (
            <div className="card videocardcolumn">
                <div className="videocardthumbnailcolumn">
                    <Link to={`/video/${video._id}`}>
                        <div className="videocardthumbnailimgoverlay">
                            <img src={`${SourceBaseUrl}/static/uploads/thumbnails/${video.thumbnail.filename}`}
                                className="videocardthumbnailimg" alt={video.title} />
                        </div>
                        <p className="videocardthumbnaildurationoverlay">{fancyTimeFormat(video.video.duration)}</p>
                    </Link>
                </div>

                <div className="card-body videocardtitlecolumn">
                    <p className="card-text videocardtitle" title={video.title}>
                        <Link to={`/video/${video._id}`}>{video.title}</Link>
                    </p>
                    <p className="card-title videocardchannel" title={channelOrModel}>{channelOrModel}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="container">
            <div className="row">
                {
                    props.videoList.map((video, i) => {
                        if (props.lastVideoElementRef && props.videoList.length === i + 1)
                            return (
                                <div className="col-12" key={video._id} ref={props.lastVideoElementRef}>
                                    {Cards(video)}
                                </div>
                            )
                        else
                            return (
                                <div className="col-12" key={video._id}>
                                    {Cards(video)}
                                </div>
                            )
                    })
                }
            </div>
        </div>
    );
}
