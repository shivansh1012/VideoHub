import { useState, useContext } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import './CSSProperties/spinner.css'
import './CSSProperties/container.css'
import './CSSProperties/commons.css'
import './CSSProperties/Animate/animate-bottom.css'
import './CSSProperties/Animate/animate-left.css'
import './CSSProperties/Animate/animate-right.css'

import NavBar from './Layout/NavBar/NavBar.jsx'

import Home from './Views/Home/Home.jsx'
import VideoList from './Views/VideoList/VideoList.jsx'
import VideoInfo from './Views/VideoInfo/VideoInfo.jsx'
import Watch from './Views/Watch/Watch.jsx'
import View from './Views/View/View.jsx'
import Settings from './Views/Settings/Settings.jsx'
import ProfileInfo from './Views/ProfileInfo/ProfileInfo.jsx'
import SearchPage from './Views/SearchPage/SearchPage.jsx'
import AboutApp from './Views/AboutApp/AboutApp.jsx'
import ProfileList from './Views/ProfileList/ProfileList.jsx'
import SignIn from './UserComponents/SignIn/SignIn.jsx'
import SignUp from './UserComponents/SignUp/SignUp.jsx'
import PageDoesNotExist from './Views/PageDoesNotExist/PageDoesNotExist.jsx'

import UserAuthContext from './UserComponents/UserAuthContext.js'
import UserVideoList from './UserComponents/UserVideoList/UserVideoList.jsx'
import PictureUpload from './UserComponents/PictureUpload/PictureUpload.jsx'
import VideoUpload from './UserComponents/VideoUpload/VideoUpload.jsx'
import Profile from './UserComponents/Profile/Profile.jsx'
import ProfileSettings from './UserComponents/ProfileSettings/ProfileSettings'

import axios from 'axios'
import PhotoList from './Views/PhotoList/PhotoList'
axios.defaults.withCredentials = true

function App () {
  const [searchQuery, setSearchQuery] = useState('')

  const { userLoggedIn } = useContext(UserAuthContext)

  return (
    <BrowserRouter>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/video/list' element={<VideoList />} />
        <Route path='/profile/list' element={<ProfileList />} />
        <Route path='/photo/list' element={<PhotoList />} />
        <Route path='/video/:id' element={<Watch />} />
        <Route path='/photo/:id' element={<View />} />
        <Route path='/watch/:id' element={<VideoInfo />} />
        <Route path='/profile/:id' element={<ProfileInfo />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/about' element={<AboutApp />} />
        <Route path='/search' element={<SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path='my'>
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
                <Route path='' element={<Profile />} />
                <Route path='settings' element={<ProfileSettings />} />
                <Route path='videos' element={<UserVideoList />} />
                <Route path='upload/picture' element={<PictureUpload />} />
                <Route path='upload/video' element={<VideoUpload />} />
              </>
            )
          }
        </Route>
        <Route path='*' element={<PageDoesNotExist />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
