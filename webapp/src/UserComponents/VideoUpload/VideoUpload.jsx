import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Select from 'react-select'
import { ApiBaseUrl } from '../../config.js'
import "./VideoUpload.css"

export default function VideoUpload() {
  let navigate = useNavigate()
  const [videoData, setVideoData] = useState({
    title: "",
    thumbnail: {
      name: "",
      dir: "",
      path: ""
    },
    video: {
      name: "",
      dir: "",
      path: "",
      fps: 0.0,
      nframs: 0.0,
      duration: 0.0,
      dimension: ""
    },
    channel: "",
    model: []
  })

  const [modelList, setModelList] = useState([])
  const [isLoading, setIsLoading] = useState("")

  const uploadFile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    let form = document.getElementById('videouploadform');
    let formData = new FormData(form);
    await axios.post(`${ApiBaseUrl}/upload/video/file`, formData)
      .then(res => {
        if (res.data.success) {
          setVideoData({
            ...videoData,
            thumbnail: {
              name: res.data.thumbnailfilename,
              dir: res.data.thumbnaildir,
              path: res.data.thumbnailpath
            },
            video: {
              name: res.data.videofilename,
              dir: "",
              path: "",
              fps: res.data.fps,
              nframs: res.data.nframes,
              duration: res.data.videoDuration,
              dimension: res.data.dimension
            }
          })
          setIsLoading(false)
        } else {
          alert('failed to save the video in server : ' + res.data.message + " : " + res.data.err)
        }
      })
  }

  const saveVideo = async (e) => {
    e.preventDefault()
    await axios.post(`${ApiBaseUrl}/upload/video/save`, videoData)
      .then((res) => {
        alert("Success")
        navigate('/')
      })
  }

  useEffect(() => {
    async function fetchData() {
      await axios.get(`${ApiBaseUrl}/meta/list/profiles?account=.`).then((res) => {
        let options = []
        for (let i = 0; i < res.data.profileList.length; i++) {
          options.push({ value: res.data.profileList[i]._id, label: res.data.profileList[i].name })
        }
        setModelList(options)
      })
    }
    fetchData();
  }, []);

  return (
    <div className="customcontainer">
      <form className="videouploadform" id="videouploadform" encType="multipart/form-data" onSubmit={saveVideo}>
        <div className="uploadcontainer p-5">
          <div className="thumbnail py-3">
            <img src={`${ApiBaseUrl}/static/${videoData.thumbnail.path}`} alt="haha" />
          </div>
          <div className="video py-3">
            {isLoading && <div className="simple-spinner"></div>}
            <input type="file" name="uploadedFile" className="videouploadinput form-control" />
          </div>
          <button className="py-3" onClick={uploadFile}>Upload Video</button>
        </div>
        {/* <div className="videouploadformcontainer"> */}
        <div className="formcontainer p-5">
          <div className="py-3">
            <label>Title</label>
            <input type="text" className="form-control" placeholder="Title" value={videoData.title}
              onChange={(e) => setVideoData({ ...videoData, title: e.target.value })} />
          </div>
          <div className="py-3">
            <label>ImageURL</label>
            <input type="text" disabled className="form-control" placeholder="ImageURL"
              value={videoData.thumbnail.path} />
          </div>
          <div className="py-3">
            <label>VideoURL</label>
            <input type="text" disabled className="form-control" placeholder="VideoURL"
              value={videoData.video.path} />
          </div>
          <div className="py-3">
            <label>Models</label>
            <Select
              isMulti
              name="models"
              options={modelList}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(newValue, actionMeta) => {
                console.log(newValue)
                setVideoData({ ...videoData, model: newValue })
              }}
            />
          </div>

          <div className="py-3">
            <button type="submit" className="btn btn-dark">Save</button>
          </div>
        </div>
      </form>
    </div>
  )
}
