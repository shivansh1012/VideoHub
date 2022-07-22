import { Link } from "react-router-dom";

export default function VideoRow(video,index) {
    let uploader = "Unknown"
    if (video['uploader'] && video.uploader !== null) uploader = video.uploader.name

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
            <td>{uploader}</td>
            <td>{video.title}</td>
            <td>{video.features.map((features, i) => {
                return <p key={i} style={{ margin: "0" }}>{features.name}</p>
            })}</td>
            <td>{(new Date(video.uploaddate).toDateString())}</td>
            <td>{(new Date(video.uploaddate).toLocaleTimeString())}</td>
            <td>{fancyTimeFormat(video.video.duration)}</td>
            <td><Link to={`/video/${video._id}`}>View</Link></td>
        </>
    )
}
