import { useState, useContext } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import './CSSProperties/Spinner.css'
import './CSSProperties/Container.css'

import NavBar from './Layout/NavBar/NavBar.jsx'

import Home from './Views/Home/Home.jsx'
import VideoList from './Views/VideoList/VideoList.jsx'
import VideoInfo from './Views/VideoInfo/VideoInfo.jsx'
import Watch from './Views/Watch/Watch.jsx'
import View from './Views/View/View.jsx'
import Settings from './Views/Settings/Settings.jsx'
import ModelInfo from './Views/ModelInfo/ModelInfo.jsx'
import ChannelInfo from './Views/ChannelInfo/ChannelInfo.jsx'
import SearchPage from './Views/SearchPage/SearchPage.jsx'
import AboutApp from './Views/AboutApp/AboutApp.jsx'
import ProfileList from './Views/ProfileList/ProfileList.jsx'
import SignIn from './UserComponents/SignIn/SignIn.jsx'
import SignUp from './UserComponents/SignUp/SignUp.jsx'
import PageDoesNotExist from './Views/PageDoesNotExist/PageDoesNotExist.jsx'

import UserAuthContext from './UserComponents/UserAuthContext.js'
import UserVideoList from './UserComponents/UserVideoList/UserVideoList.jsx'
import UserVideoGrid from './UserComponents/UserVideoGrid/UserVideoGrid.jsx'
import PictureUpload from './UserComponents/PictureUpload/PictureUpload.jsx'
import VideoUpload from './UserComponents/VideoUpload/VideoUpload.jsx'
import Profile from './UserComponents/Profile/Profile.jsx'
import ProfileSettings from './UserComponents/ProfileSettings/ProfileSettings'
import PhotoList from './Views/PhotoList/PhotoList.jsx'

import axios from 'axios'
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
        <Route path='/photo/list' element={<PhotoList />} />
        <Route path='/model/list' element={<ProfileList />} />
        <Route path='/video/:id' element={<Watch />} />
        <Route path='/photo/:id' element={<View />} />
        <Route path='/watch/:id' element={<VideoInfo />} />
        <Route path='/model/:id' element={<ModelInfo />} />
        <Route path='/channel/:id' element={<ChannelInfo />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/about' element={<AboutApp />} />
        <Route path='/search' element={<SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path='profile'>
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
                <Route path='myvideos' element={<UserVideoGrid />} />
                <Route path='videolist' element={<UserVideoList />} />
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
