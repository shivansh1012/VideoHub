import { useState, useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route
} from 'react-router-dom'

import './CSSProperties/Spinner.css'
import './CSSProperties/Container.css'

import NavBar from './Layout/NavBar/NavBar.jsx'

import Home from './Views/Home/Home.jsx'
import VideoList from './Views/VideoList/VideoList.jsx'
import VideoInfo from './Views/VideoInfo/VideoInfo.jsx'
import Settings from './Views/Settings/Settings.jsx'
import ModelInfo from './Views/ModelInfo/ModelInfo.jsx'
import ChannelList from './Views/ChannelList/ChannelList.jsx'
import ChannelInfo from './Views/ChannelInfo/ChannelInfo.jsx'
import SearchPage from './Views/SearchPage/SearchPage.jsx'
import AboutApp from './Views/AboutApp/AboutApp.jsx'
import ModelList from './Views/ModelList/ModelList.jsx'
import SignIn from './UserComponents/SignIn/SignIn.jsx'
import SignUp from './UserComponents/SignUp/SignUp.jsx'

import UserAuthContext from './UserComponents/UserAuthContext.js'

import axios from 'axios'
axios.defaults.withCredentials = true

function App () {
  const [searchQuery, setSearchQuery] = useState('')

  const { userLoggedIn } = useContext(UserAuthContext)

  return (
    <Router>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Switch>
        <Route path='/' element={<Home />} />
        <Route path='/video/list' element={<VideoList />} />
        <Route path='/model/list' element={<ModelList />} />
        <Route path='/channel/list' element={<ChannelList />} />
        <Route path='/video/:id' element={<VideoInfo />} />
        <Route path='/model/:id' element={<ModelInfo />} />
        <Route path='/channel/:id' element={<ChannelInfo />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/about' element={<AboutApp />} />
        <Route path='/search' element={<SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        {(userLoggedIn === false || userLoggedIn === undefined) && (
          <>
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
          </>
        )}
        {/* {(userLoggedIn === true) && (
            <>
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
            </>
          )} */}
      </Switch>
    </Router>
  )
}

export default App
