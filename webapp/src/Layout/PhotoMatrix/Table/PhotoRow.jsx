import { Link } from 'react-router-dom';

export default function PhotoRow(photo, index) {
    return (
        <>
            <td>{index + 1}</td>
            <td><Link to={`/profile/${photo.uploader._id}`}>{photo.uploader.name}</Link></td>
            <td>{photo.title}</td>
            <td>{photo.features.map((features, i) => {
                return <p key={i} style={{ margin: '0' }}><Link to={`/profile/${features._id}`}>{features.name}</Link></p>
            })}</td>
            <td>{(new Date(photo.uploaddate).toDateString())}</td>
            <td>{(new Date(photo.uploaddate).toLocaleTimeString())}</td>
            <td><Link to={`/photo/${photo._id}`}>View</Link></td>
        </>
    )
}
