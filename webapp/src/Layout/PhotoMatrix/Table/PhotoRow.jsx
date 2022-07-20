import { Link } from "react-router-dom";

export default function PhotoRow(photo, index) {
    let uploader = "Unknown"
    if (photo['uploader'] && photo.uploader !== null) uploader = photo.uploader.name
    return (
        <>
            <td>{index + 1}</td>
            <td>{uploader}</td>
            <td>{photo.title}</td>
            <td>{photo.features.map((features, i) => {
                return <p key={i} style={{ margin: "0" }}>{features.name}</p>
            })}</td>
            <td>{(new Date(photo.uploaddate).toDateString())}</td>
            <td>{(new Date(photo.uploaddate).toLocaleTimeString())}</td>
            <td><Link to={`/photo/${photo._id}`}>View</Link></td>
        </>
    )
}
