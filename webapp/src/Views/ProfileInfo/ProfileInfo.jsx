import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom'
import { ApiBaseUrl } from '../../config.js';
import Tabs from "../../Layout/Tab/Tabs.jsx"
import VideoUploadSection from './VideoUpload/VideoUploadSection.jsx';
import VideoFeaturesSection from './VideoFeatures/VideoFeaturesSection.jsx';
import PhotoUploadSection from './PhotoUpload/PhotoUploadSection.jsx';
import PhotoFeaturesSection from './PhotoFeatures/PhotoFeaturesSection.jsx';

export default function ProfileInfo() {
    const { id } = useParams();

    const [profileData, setProfileData] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);

    const getProfileMetaData = useCallback(async () => {
        await fetch(`${ApiBaseUrl}/meta/profile?id=${id}`).then(response =>
            response.json()).then((json) => {
                setProfileData(json.profileData);
            })
        setProfileLoading(false);
    }, [id])

    useEffect(getProfileMetaData, [getProfileMetaData])
    return (
        <div className="container py-3">
            <div className="d-flex flex-row">
                {
                    profileLoading ? <div className="simple-spinner"></div> :
                        <img src={`${ApiBaseUrl}/static/${profileData.profilepicURL}`} style={{ maxWidth: "250px", maxHeight: "250px", "borderRadius": "20px" }} alt={profileData.name} />
                }
                <div className="mx-4">
                    {
                        profileLoading ? <div className="simple-spinner"></div> :
                            <>
                                <h3>{profileData.name}</h3>
                                <h5>Total Video Uploads: {profileData.video.uploads.length}</h5>
                                <h5>Total Video Features: {profileData.video.features.length}</h5>
                                <h5>Total Photo Uploads: {profileData.photo.uploads.length}</h5>
                                <h5>Total Photo Features: {profileData.photo.features.length}</h5>
                            </>
                    }
                </div>
            </div>

            <Tabs>
                <div label="Video Uploads">
                    <VideoUploadSection id={id} limit={10}/>
                </div>
                <div label="Video Features">
                    <VideoFeaturesSection id={id} limit={10} />
                </div>
                <div label="Photo Uploads">
                    <PhotoUploadSection id={id} limit={10} />
                </div>
                <div label="Photo Features">
                    <PhotoFeaturesSection id={id} limit={10} />
                </div>
            </Tabs>


        </div>
    );
}
