import { useState, useEffect } from "react";
import { ApiBaseUrl } from '../../config.js';
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";

export default function Home() {
    let offset=0;
    const [videoList, setVideoList] = useState([]);

    const getVideoList = async () => {
        await fetch(`${ApiBaseUrl}/meta/list?limit=15&offset=${offset}`).then(response =>
            response.json()).then((json) => {
                // const newVideoListSet=[];
                // console.log(json)
                setVideoList((oldVideoList) => [...oldVideoList,...json.videoList]);
                offset+=15;
            })
    }

    const handleScroll = (e) => {
        if (
            window.innerHeight + e.target.documentElement.scrollTop + 1 >=
            e.target.documentElement.scrollHeight
        ) {
            getVideoList()
        }
    }

    useEffect(() => {
        getVideoList();
        window.addEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="p-5">
            <VideoMatrix videoList={videoList}/>
        </div>
    )
}
