import { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SourceBaseUrl, ApiBaseUrl } from '../../config.js'
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx"

export default function ChannelInfo() {
    const [channelData, setChannelData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    const getVideoMetaData = useCallback(async () => {
        await fetch(`${ApiBaseUrl}/meta/channel?id=${id}`).then(response =>
            response.json()).then((json) => {
                setChannelData(json.channelData);
            })
        setLoading(false);
    }, [id])

    useEffect(getVideoMetaData, [getVideoMetaData])
    return (
        <div className="customcontainer py-3">
            <div className="d-flex flex-row">
                {
                    loading ? <div className="simple-spinner"></div> :
                        <img src={`${SourceBaseUrl}/static/${channelData.profilepicURL}`} style={{ maxWidth: "250px", maxHeight: "250px", "borderRadius": "20px" }} alt={channelData.name} />
                }
                <div className="mx-4">
                    {
                        loading ? <div className="simple-spinner"></div> :
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
                    loading ? <div className="simple-spinner"></div> :
                        <>
                            <VideoMatrix videoList={channelData.videoList} />
                        </>
                }
            </div>
        </div>
    );
}
