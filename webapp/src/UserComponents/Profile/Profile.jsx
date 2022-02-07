import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import UserAuthContext from '../UserAuthContext.js'
import { SourceBaseUrl, ApiBaseUrl } from '../../config.js'

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

  const changeProfilePic = async (e) => {
    e.preventDefault()
    let form = document.getElementById('profilepicuploadform');
    let formData = new FormData(form);
    await axios.post(`${ApiBaseUrl}/profile/upload/profilepic`, formData)
      .then(res => {
        getUserDetails();
      })
  }

  return (
    <div className="customcontainer">
      <div>
        <div>
          {
            isLoading ? <div className="simple-spinner"></div> :
              <img src={`${SourceBaseUrl}/static/${userInfo.profilepicURL}`} style={{ maxWidth: "250px", maxHeight: "250px", "borderRadius": "20px" }} alt={userName} />
          }
        </div>
        <div>
          <form className="profilepicuploadform" id="profilepicuploadform" encType="multipart/form-data" onSubmit={changeProfilePic}>
            {
              isLoading && <div className="simple-spinner"></div>
            }
            <input type="file" name="uploadedFile" className="videouploadinput form-control" />
            <button className="py-3" type="submit">Change Profile Pic</button>
          </form>
        </div>
      </div>
      <h2>{userName}</h2>
      <h3>{userEmail}</h3>
    </div>
  );
}
