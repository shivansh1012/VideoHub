import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import UserAuthContext from '../UserAuthContext.js'
import { SourceBaseUrl, ApiBaseUrl } from '../../config.js'
import VideoMatrixGrid from '../../Layout/VideoMatrix/VideoMatrixGrid.jsx'
import PlaylistMatrixGrid from '../../Layout/VideoMatrix/PlaylistMatrixGrid.jsx'
import { Link } from 'react-router-dom'
import "./Profile.css"

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
              <VideoMatrixGrid videoList={userInfo.videoList} />
          }
        </div>
        <div className="videouploadsection py-3">
          <h3>Liked Videos</h3>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <>
                {
                  userInfo.likedvideos.length ? <VideoMatrixGrid videoList={userInfo.likedvideos} /> :
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
                  userInfo.dislikedvideos.length ? <VideoMatrixGrid videoList={userInfo.dislikedvideos} /> :
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
                  userInfo.watchlater.length ? <VideoMatrixGrid videoList={userInfo.watchlater} /> :
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
          {/* <div className="col-12 col-sm-6 col-md-6 col-lg-3" key={1234}>
            <div className="card videocard">
              <div className="videocardthumbnail">
                <div className="videocardthumbnailimgoverlay">
                  <img src={`${SourceBaseUrl}/static/defaults/playlistdefaultpic.png`}
                    className="videocardthumbnailimg" alt="create new playlist" />
                  <div className="textcentered">Create a new Playlist</div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
