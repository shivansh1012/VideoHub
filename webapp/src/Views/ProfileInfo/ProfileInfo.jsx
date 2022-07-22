import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom'
import { ApiBaseUrl } from '../../config.js';
import VideoMatrixGrid from "../../Layout/VideoMatrix/VideoMatrixGrid.jsx";

export default function ProfileInfo() {
    const [profileData, setProfileData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    const getVideoMetaData = useCallback(async () => {
        await fetch(`${ApiBaseUrl}/meta/profile?id=${id}`).then(response =>
            response.json()).then((json) => {
                setProfileData(json.profileData);
            })
        setLoading(false);
    }, [id])

    useEffect(getVideoMetaData, [getVideoMetaData])
    return (
        <div className="container py-3">
            <div className="d-flex flex-row">
                {
                    loading ? <div className="simple-spinner"></div> :
                        <img src={`${ApiBaseUrl}/static/${profileData.profilepicURL}`} style={{ maxWidth: "250px", maxHeight: "250px", "borderRadius": "20px" }} alt={profileData.name} />
                }
                <div className="mx-4">
                    {
                        loading ? <div className="simple-spinner"></div> :
                            <>
                                <h3>{profileData.name}</h3>
                                <h5>Total Videos: {profileData.video.uploads.length}</h5>
                            </>
                    }
                </div>
            </div>
            <div>
                <h3 className="py-3">More Videos:</h3>
                {
                    loading ? <div className="simple-spinner"></div> :
                        <>
                            <VideoMatrixGrid videoList={profileData.video.uploads} />
                        </>
                }
            </div>
            <div>
                <h3 className="py-3">Featuring:</h3>
                {
                    loading ? <div className="simple-spinner"></div> :
                        <>
                            <VideoMatrixGrid videoList={profileData.video.features} />
                        </>
                }
            </div>
        </div>
    );
}
