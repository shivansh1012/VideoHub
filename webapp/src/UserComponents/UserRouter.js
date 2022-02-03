import { useContext } from 'react'
import { Route } from 'react-router-dom'

import UserAuthContext from './UserAuthContext.js'
import UserVideoList from './UserVideoList/UserVideoList.jsx'
import UserVideoGrid from './UserVideoGrid/UserVideoGrid.jsx'
import PictureUpload from './PictureUpload/PictureUpload.jsx'
import VideoUpload from './VideoUpload/VideoUpload.jsx'
import SignIn from './SignIn/SignIn.jsx'
import SignUp from './SignUp/SignUp.jsx'
import Profile from './Profile/Profile.jsx'

export default function UserRouter () {
  const { userLoggedIn } = useContext(UserAuthContext)

  return (
    <>
      {
        (userLoggedIn === false || userLoggedIn === undefined) && (
          <>
            <Route path='signin' element={<SignIn />} />
            <Route path='signup' element={<SignUp />} />
          </>
        )
      }
      {
        (userLoggedIn === true) && (
          <>
            <Route path='/' element={<Profile />} />
            <Route path='myvideos' element={<UserVideoGrid />} />
            <Route path='videolist' element={<UserVideoList />} />
            <Route path='upload/picture' element={<PictureUpload />} />
            <Route path='upload/video' element={<VideoUpload />} />
          </>
        )
      }
    </>
  );
}
