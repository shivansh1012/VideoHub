import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Select from 'react-select'
import { SourceBaseUrl, ApiBaseUrl } from '../../config.js'
import "./VideoUpload.css"

export default function VideoUpload() {
  let navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [videofileName, setVideoFileName] = useState("")
  const [thumbnailfileName, setThumbnailFileName] = useState("")
  const [videodir, setVideoDir] = useState("")
  const [videopath, setVideoPath] = useState("")
  const [thumbnaildir, setThumbnailDir] = useState("")
  const [thumbnailpath, setThumbnailPath] = useState("")
  const [channel, setChannel] = useState("")
  const [model, setModel] = useState([])
  const [fps, setFps] = useState("")
  const [nframes, setNframes] = useState("")
  const [duration, setDuration] = useState("")
  const [dimension, setDimension] = useState([])

  const [modelList, setModelList] = useState([])
  const [isLoading, setIsLoading] = useState("")

  const uploadFile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    let form = document.getElementById('videouploadform');
    let formData = new FormData(form);
    await axios.post(`${ApiBaseUrl}/profile/upload/video`, formData)
      .then(res => {
        if (res.data.success) {
          setVideoDir('')
          setChannel('')
          setModel('')
          setVideoFileName(res.data.fileName)
          const payload = {
            filePath: res.data.filePath,
            fileName: res.data.fileName
          }
          axios.post(`${ApiBaseUrl}/profile/thumbnail`, payload)
            .then(res => {
              if (res.data.success) {
                console.log(res)
                setDuration(res.data.videoDuration)
                setThumbnailDir(res.data.thumbnaildir)
                setThumbnailPath(res.data.thumbnailpath)
                setThumbnailFileName(res.data.thumbnailfilename)
                setNframes(res.data.nframes)
                setDimension(res.data.dimension)
                setFps(res.data.fps)
                setVideoPath(res.data.videopath)
              } else {
                alert('Failed to make the thumbnails');
              }
              setIsLoading(false)
            })
        } else {
          alert('failed to save the video in server')
        }
      })
  }

  const saveVideo = async (e) => {
    e.preventDefault()
    const payload = {
      title,
      videofileName,
      thumbnailfileName,
      videodir,
      videopath,
      thumbnaildir,
      thumbnailpath,
      channel,
      model,
      fps,
      nframes,
      duration,
      dimension
    }

    await axios.post(`${ApiBaseUrl}/profile/newvideo`, payload)
      .then((res) => {
        alert("Success")
        navigate('/')
      })
  }

  useEffect(() => {
    async function fetchData() {
      await axios.get(`${ApiBaseUrl}/meta/list/model`).then((res) => {
        let options = []
        for (let i = 0; i < res.data.modelList.length; i++) {
          options.push({ value: res.data.modelList[i]._id, label: res.data.modelList[i].name })
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
            <img src={`${SourceBaseUrl}/static/${thumbnailpath}`} alt="haha" />
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
            <input type="text" className="form-control" placeholder="Title" value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="py-3">
            <label>ImageURL</label>
            <input type="text" disabled className="form-control" placeholder="ImageURL"
              value={thumbnailpath} />
          </div>
          <div className="py-3">
            <label>VideoURL</label>
            <input type="text" disabled className="form-control" placeholder="VideoURL"
              value={videopath} />
          </div>
          <div className="py-3">
            <label>Models</label>
            <Select
              isMulti
              name="colors"
              options={modelList}
              className="basic-multi-select modelselect"
              classNamePrefix="select"
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
