import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom'
import { ApiBaseUrl } from '../../config.js';
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";
import * as ReactBootstrap from "react-bootstrap";
import { SourceBaseUrl } from '../../config.js';

export default function ModelInfo() {
    const [modelData, setModelData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    const getVideoMetaData = useCallback(async () => {
        await fetch(`${ApiBaseUrl}/meta/model?id=${id}`).then(response =>
            response.json()).then((json) => {
                setModelData(json.modelData);
            })
        setLoading(false);
    }, [id])

    useEffect(getVideoMetaData, [getVideoMetaData])
    return (
        <div className="container py-3">
            <div className="d-flex flex-row">
                {
                    loading ? <ReactBootstrap.Spinner animation="border" /> :
                        <img src={`${SourceBaseUrl}/static/profilepics/${modelData.name}.jpg`} style={{ maxWidth: "250px", maxHeight: "250px", "borderRadius": "20px" }} alt={modelData.name} />
                }
                <div className="mx-4">
                    {
                        loading ? <ReactBootstrap.Spinner animation="border" /> :
                            <>
                                <h3>{modelData.name}</h3>
                                <h5>Total Videos: {modelData.videoList.length}</h5>
                            </>
                    }
                </div>
            </div>
            <div>
                <h3 className="py-3">More Videos</h3>
                {
                    loading ? <ReactBootstrap.Spinner animation="border" /> :
                        <>
                            <VideoMatrix videoList={modelData.videoList} />
                        </>
                }
            </div>
        </div>
    );
}
