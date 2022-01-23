import React, { useState, useEffect } from "react";
// import axios from 'axios';
import { apiBaseURL } from '../../config.js';
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";

export default function Home() {
    const [videoList, setVideoList] = useState([]);

    const getVideoList = async () => {
        // const response = await axios.get(`${apiBaseURL}/meta/list`);
        await fetch(`${apiBaseURL}/meta/list`).then(response =>
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
