import { useEffect, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { ApiBaseUrl } from '../../config.js';
import VideoPlayer from "../../Layout/VideoPlayer/VideoPlayer.jsx"
import VideoMatrixColumn from "../../Layout/VideoMatrix/VideoMatrixColumn.jsx";
import "./Watch.css"

export default function Watch() {
    const [videoData, setVideoData] = useState([]);
    const [moreVideos, setMoreVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    const getVideoMetaData = useCallback(async () => {
        await fetch(`${ApiBaseUrl}/meta/video?id=${id}`).then(response =>
            response.json()).then((json) => {
                // console.log(json)
                setVideoData(json.videoData);
                setMoreVideos(json.moreVideos)
            })
        setLoading(false);
    }, [id])

    const getVideoInfo = () => {
        return (
            <>
                <h3 className="py-3">{videoData.title}</h3>
                {
                    (videoData.channel && videoData.channel != null) &&
                    <h5>
                        <Link to={`/channel/${videoData.channel['_id']}`}>{videoData.channel.name}</Link>
                    </h5>
                }
                <div className="d-flex flex-wrap">
                    <p>Models: </p>
                    {
                        videoData.model.map((model, index) => {
                            return (
                                <p key={index} style={{ flex: "wrap", paddingInline: "3px", marginInline: "2px", border: "1px", borderRadius: "10px", backgroundColor: "pink" }}>
                                    <Link to={`/model/${model['_id']}`}>{model.name}</Link>
                                    <br />
                                </p>
                            )
                        })
                    }
                </div>
                <div className="d-flex flex-wrap">
                    <p>Tags: </p>
                    {
                        videoData.tags.map((tag, index) => {
                            return <p key={index} style={{ paddingInline: "3px", marginInline: "2px", border: "1px", borderRadius: "10px", backgroundColor: "orange" }}>{tag}</p>
                        })
                    }
                </div>
            </>
        )
    }

    useEffect(() => {
        getVideoMetaData()
        window.scrollTo(0, 0)
    }, [getVideoMetaData])

    return (
        <div className="container">
            <div className="watch">
                {/* <div className="col-lg-12 col-xl-9"> */}
                <div className="videozone">
                    <div className="col-12 video">
                        {
                            loading ? <div className="simple-spinner"></div> :
                                <VideoPlayer id={videoData["_id"]} />
                        }
                    </div>
                    <div className="videodetails">
                        {
                            loading ? <div className="simple-spinner"></div> :
                                getVideoInfo()
                        }
                    </div>
                </div>
                {/* <div className="col-lg-12 col-xl-3 text-center"> */}
                <div className="morevideo">
                    <h3>More Videos</h3>
                    <div>
                        {
                            loading ? <div className="simple-spinner"></div> :
                                <>
                                    <VideoMatrixColumn videoList={moreVideos} />
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
