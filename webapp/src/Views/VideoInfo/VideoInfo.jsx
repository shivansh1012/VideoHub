import { useEffect, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import VideoPlayer from "../../Layout/VideoPlayer/VideoPlayer.jsx"
import { ApiBaseUrl } from '../../config.js';
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";

export default function VideoInfo() {
  const [videoData, setVideoData] = useState([]);
  const [moreVideos, setMoreVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  const getVideoMetaData = useCallback(async () => {
    await fetch(`${ApiBaseUrl}/meta/video?id=${id}`).then(response =>
      response.json()).then((json) => {
        setVideoData(json.videoData);
        setMoreVideos(json.moreVideos)
      })
    setLoading(false);
  }, [id])

  useEffect(() => {
    getVideoMetaData()
    window.scrollTo(0, 0)
  }, [getVideoMetaData])

  return (
    <div className="container py-3">
      {/* <div className="d-flex flex-column"> */}
      <div style={{ "textAlign": "center", "display": "flex", "justifyContent": "center" }}>
        {
          loading ? <div className="simple-spinner"></div> :
            <VideoPlayer id={videoData["_id"]} />
        }
      </div>
      <div className="py-3">
        {
          loading ? <div className="simple-spinner"></div> :
            <div>
              <h3>{videoData.filename}</h3>
              {
                videoData.hasOwnProperty('channel') &&
                <h5>
                  <Link to={`/channel/${videoData.channel['_id']}`}>{videoData.channel.name}</Link>
                </h5>
              }
              <hr />
              <div className="d-flex flex-wrap">
                <p>Models: </p>
                {
                  videoData.model.map((model, index) => {
                    return (
                      <p key={index} style={{ paddingInline: "3px", marginInline: "2px", border: "1px", borderRadius: "10px", backgroundColor: "pink" }}>
                        <Link to={`/model/${model['_id']}`}>{model.name}</Link>
                        <br />
                      </p>
                    )
                  })
                }
              </div>
              <p>Duration: {fancyTimeFormat(videoData.duration)}</p>
              <div className="d-flex flex-wrap">
                <p>Tags: </p>
                {
                  videoData.tags.map((tag, index) => {
                    return <p key={index} style={{ paddingInline: "3px", marginInline: "2px", border: "1px", borderRadius: "10px", backgroundColor: "orange" }}>{tag}</p>
                  })
                }
              </div>
            </div>
        }
        {/* </div> */}
      </div>
      <div>
        <h3 className="py-3" style={{ "textAlign": "center" }}>More Videos</h3>
        {
          loading ? <div className="simple-spinner"></div> :
            <>
              <VideoMatrix videoList={moreVideos} />
            </>
        }
      </div>
    </div>
  );
}
