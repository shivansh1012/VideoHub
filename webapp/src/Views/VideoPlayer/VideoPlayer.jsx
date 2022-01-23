import React from 'react'
import { useParams } from 'react-router-dom'
// import { apiBaseURL } from '../../config.js';
import "./videoplayer.style.css";

export default function VideoPlayer(props) {
    // const [videoData, setVideoData] = useState([]);
    const { id } = useParams();
    // console.log(id)

    // const getVideoMetaData = useCallback(() => {
    //     fetch(`${apiBaseURL}/meta?id=${id}`).then(response =>
    //         response.json()).then((json) => {
    //             // console.log(json.videoData)
    //             setVideoData(json.videoData);
    //         })
    // }, [id])

    // useEffect(getVideoMetaData, [getVideoMetaData])

    return (
        <div>
            <div id="player-overlay">
                <video controls muted="muted" autoPlay>
                    <source src={`http://192.168.1.6:5000/video?id=${id}`} type="video/mp4" />
                </video>
            </div>
        </div>
    )
}