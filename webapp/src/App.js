import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route
} from "react-router-dom"

import NavBar from "./Layout/NavBar/NavBar.jsx"

import Home from "./Views/Home/Home.jsx"
import VideoList from "./Views/VideoList/VideoList.jsx"
import VideoInfo from "./Views/VideoInfo/VideoInfo.jsx"
import Settings from "./Views/Settings/Settings.jsx"
import ModelInfo from "./Views/ModelInfo/ModelInfo.jsx"
import ChannelInfo from "./Views/ChannelInfo/ChannelInfo.jsx"
import SearchPage from "./Views/SearchPage/SearchPage.jsx"

function App() {
  const [searchQuery, setSearchQuery] = useState("")
  return (
    <Router>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<VideoList />} />
        <Route path="/video/:id" element={<VideoInfo />} />
        <Route path="/model/:id" element={<ModelInfo />} />
        <Route path="/channel/:id" element={<ChannelInfo />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      </Switch>
    </Router>
  )
}

export default App
