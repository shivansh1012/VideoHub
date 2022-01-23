import { useState, useEffect } from "react";
import { ApiBaseUrl } from '../../config.js';
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";

export default function Home() {
    const [videoList, setVideoList] = useState([]);

    const getVideoList = async () => {
        // const response = await axios.get(`${apiBaseURL}/meta/list`);
        await fetch(`${ApiBaseUrl}/meta/list`).then(response =>
            response.json()).then((json) => {
                // console.log(json)
                setVideoList(json.videoList);
            })
    }

    useEffect(() => {
        getVideoList();
    }, [])

    return (
        <div className="p-5">
            <VideoMatrix videoList={videoList}/>
        </div>
    )
}
