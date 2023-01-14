import { Link } from "react-router-dom";

export default function VideoRow(video, index) {
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

    return (
        <>
            <td>{index + 1}</td>
            <td><Link to={`/profile/${video.uploader._id}`}>{video.uploader.name}</Link></td>
            <td>{video.title}</td>
            <td>{video.features.map((features, i) => {
                return <p key={i} style={{ margin: "0" }}><Link to={`/profile/${features._id}`}>{features.name}</Link></p>
            })}</td>
            <td>{(new Date(video.uploaddate).toDateString())}</td>
            <td>{(new Date(video.uploaddate).toLocaleTimeString())}</td>
            <td>{fancyTimeFormat(video.video.duration)}</td>
            <td><Link to={`/video/${video._id}`}>View</Link></td>
        </>
    )
}
