import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
  const [model, setModel] = useState("")
  const [fps, setFps] = useState("")
  const [nframes, setNframes] = useState("")
  const [duration, setDuration] = useState("")
  const [dimension, setDimension] = useState([])

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

  return (
    <div className="customcontainer">
      <form className="videouploadform" id="videouploadform" encType="multipart/form-data" onSubmit={saveVideo}>
        <div className="videouploadcontainer">
          <div className="videouploadcontainercontainer">
            {isLoading && <div className="spinner"></div>}
            <input type="file" name="uploadedFile" className="videouploadinput" />
          </div>
          <img className="videouploadthumbnail" src={`${SourceBaseUrl}/static/${thumbnailpath}`} alt="haha" />
        </div>
        <button onClick={uploadFile}>Upload Video</button>
        {/* <div className="videouploadformcontainer"> */}
        <div className="col-12">
          <label>Name</label>
          <input type="text" name="name" className="form-control" placeholder="Name" value={title}
            onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="col-12">
          <label>ImageURL</label>
          <input type="text" name="img" disabled className="form-control" placeholder="ImageURL"
            value={thumbnailpath} />
        </div>
        <div className="col-12">
          <label>VideoURL</label>
          <input type="text" name="video" disabled className="form-control" placeholder="VideoURL"
            value={videopath} />
        </div>
        {/* <div className="col-12">
          <label>Description</label>
          <textarea type="text" name="description" className="form-control" placeholder="Description" 
          value={description} onChange={(e) => setDescription(e.target.value)} style={{ height: "30vh" }} />
        </div> */}
        <div className="col-12">
          <button type="submit" className="btn btn-dark">Save</button>
        </div>
        {/* </div> */}
      </form>
    </div>
  )
}
