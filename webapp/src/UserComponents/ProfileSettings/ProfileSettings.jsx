import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import UserAuthContext from '../UserAuthContext.js'
import { SourceBaseUrl, ApiBaseUrl } from '../../config.js'
import "./ProfileSettings.css"

export default function ProfileSettings() {
    const { userName, userEmail } = useContext(UserAuthContext)
    const [newprofileimg, setNewProfileImg] = useState("")
    const [userInfo, setUserInfo] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

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
        if(newprofileimg === '') {
            return alert("Upload a pic")
        }
        let form = document.getElementById('profilepicuploadform');
        let formData = new FormData(form);
        await axios.post(`${ApiBaseUrl}/profile/upload/profilepic`, formData)
            .then(res => {
                getUserDetails();
            })
    }

    const changePassword = async (e) => {
        e.preventDefault()
        if (!currentPassword || !newPassword) {
            return alert("Enter current and new password")
          }
        const payload = {
            currentPassword,
            newPassword
        }
        await axios.post(`${ApiBaseUrl}/profile/updatepassword`, payload)
        .then(res => {
            alert(res.data.message);
            setCurrentPassword("")
            setNewPassword("")
        }).catch(res => {
            alert(res.data.message);
        })
    }

    return (
        <div className="customcontainer">
            <div className="settingsform">
                <div>
                    {
                        isLoading ? <div className="simple-spinner"></div> :
                            <img src={`${SourceBaseUrl}/static/${userInfo.profilepicURL}`} style={{ maxWidth: "250px", maxHeight: "250px", "borderRadius": "20px" }} alt={userName} />
                    }
                </div>
                <div>
                    <form>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                            <input type="text" className="form-control" disabled defaultValue={userName}/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Email</span>
                            <input type="text" className="form-control" disabled defaultValue={userEmail}/>
                        </div>
                    </form>
                </div>
                
                <div>
                    <form onSubmit={changePassword}>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Current Password</span>
                            <input type="text" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">New Password</span>
                            <input type="text" className="form-control" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
                        </div>
                        <button className="btn settingsbutton" type="submit">Change Password</button>
                    </form>
                </div>
                <div>
                    <form className="profilepicuploadform" id="profilepicuploadform" encType="multipart/form-data" onSubmit={changeProfilePic}>
                        {
                            isLoading && <div className="simple-spinner"></div>
                        }
                        <input type="file" name="uploadedFile" className="videouploadinput form-control" value={newprofileimg} onChange={(e) => setNewProfileImg(e.target.value)}/>
                        <button className="btn settingsbutton" type="submit">Change Profile Pic</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
