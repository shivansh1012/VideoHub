import { Link } from "react-router-dom";

export default function VideoRow(video,index) {
    let uploader = "Unknown"
    if (video['uploader'] && video.uploader !== null) uploader = video.uploader.name
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
            <td>{video.video.ext}</td>
            <td><Link to={`/video/${video._id}`}>View</Link></td>
        </>
    )
}
