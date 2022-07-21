import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import UserAuthContext from '../UserAuthContext.js'
import { SourceBaseUrl, ApiBaseUrl } from '../../config.js'
import VideoMatrixGrid from '../../Layout/VideoMatrix/VideoMatrixGrid.jsx'
import PlaylistMatrixGrid from '../../Layout/VideoMatrix/PlaylistMatrixGrid.jsx'
import { Link } from 'react-router-dom'
import "./Profile.css"
import VideoMatrix from '../../Layout/VideoMatrix/Matrix/VideoMatrix.jsx'
import PhotoMatrix from '../../Layout/PhotoMatrix/Matrix/PhotoMatrix.jsx'

export default function Profile() {
  const { userName, userEmail } = useContext(UserAuthContext)
  const [userInfo, setUserInfo] = useState([])
  const [isLoading, setLoading] = useState(true)

  const getUserDetails = async () => {
    setLoading(true)
    await axios.get(`${ApiBaseUrl}/profile/userinfo`).then((res) => {
      setUserInfo(res.data.userInfo)
    })
    setLoading(false)
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <div className="customcontainer">
      <div className="profile">
        <div className="imageSection">
          <div>
            {
              isLoading ? <div className="simple-spinner"></div> :
                <img src={`${SourceBaseUrl}/static/${userInfo.profilepicURL}`} style={{ maxWidth: "250px", maxHeight: "250px", "borderRadius": "20px" }} alt={userName} />
            }
          </div>
          <div>
            <h2>{userName}</h2>
            <h3>{userEmail}</h3>
          </div>
          <div>
            <Link to="/profile/settings" className="btn">Settings</Link>
          </div>
        </div>
        <div className="videouploadsection py-3">
          <h3>Video Uploads</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.video.uploads.length ? <VideoMatrix videoList={userInfo.video.uploads} /> :
                    <p>No Video Uploads</p>
                }
              </>
          }
        </div>
        <div className="videouploadsection py-3">
          <h3>Video Features</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.video.features.length ? <VideoMatrixGrid videoList={userInfo.video.features} /> :
                    <p>No featuring Videos</p>
                }
              </>
          }
        </div>
        <div className="videouploadsection py-3">
          <h3>Photo Uploads</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.photo.uploads.length ? <PhotoMatrix photoList={userInfo.photo.uploads} /> :
                    <p>No Photo Uploads</p>
                }
              </>
          }
        </div>
        <div className="videouploadsection py-3">
          <h3>Photo Features</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.photo.features.length ? <PhotoMatrix photoList={userInfo.photo.features} /> :
                    <p>No Photo Features</p>
                }
              </>
          }
        </div>
        <div className="videouploadsection py-3">
          <h3>Liked Videos</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.video.likes.length ? <VideoMatrixGrid videoList={userInfo.video.likes} /> :
                    <p>No Liked Videos</p>
                }
              </>
          }
        </div>
        <div className="videouploadsection py-3">
          <h3>Disliked Videos</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.video.dislikes.length ? <VideoMatrixGrid videoList={userInfo.video.dislikes} /> :
                    <p>No Disliked Videos</p>
                }
              </>
          }
        </div>
        <div className="videouploadsection py-3">
          <h3>Watch Later</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.video.watchlater.length ? <VideoMatrixGrid videoList={userInfo.video.watchlater} /> :
                    <p>No Watch Laters</p>
                }
              </>
          }
        </div>
        <div className="playlistsection py-3">
          <h3>Playlist Sections</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.playlist.length ? <PlaylistMatrixGrid playlist={userInfo.playlist} /> :
                    <p>No Playlists</p>
                }
              </>

          }
        </div>
      </div>
    </div>
  );
}
