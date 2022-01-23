import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom'
import { ApiBaseUrl } from '../../config.js';
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";
import * as ReactBootstrap from "react-bootstrap";

export default function ChannelInfo() {
    const [channelData, setChannelData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    const getVideoMetaData = useCallback(async () => {
        await fetch(`${ApiBaseUrl}/meta/channel?id=${id}`).then(response =>
            response.json()).then((json) => {
                console.log(json.channelData)
                setChannelData(json.channelData);
            })
        setLoading(false);
    }, [id])

    useEffect(getVideoMetaData, [getVideoMetaData])
    return (
        <div className="container py-3">
            <div className="d-flex flex-row">
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" style={{ width: "200px", height: "200px", "borderRadius": "20px" }} alt="..." />
                <div className="mx-4">
                    {
                        loading ? <ReactBootstrap.Spinner animation="border" /> :
                            <>
                                <h3>{channelData.name}</h3>
                                <h5>Total Videos: {channelData.videoList.length}</h5>
                            </>
                    }
                </div>
            </div>
            <div>
                <h3 className="py-3">More Videos</h3>
                {
                    loading ? <ReactBootstrap.Spinner animation="border" /> :
                        <>
                            <VideoMatrix videoList={channelData.videoList} />
                        </>
                }
            </div>
        </div>
    );
}
