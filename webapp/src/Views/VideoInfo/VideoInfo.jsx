import { useEffect, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import VideoPlayer from "../../Layout/VideoPlayer/VideoPlayer.jsx"
import { ApiBaseUrl } from '../../config.js';
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";
import * as ReactBootstrap from "react-bootstrap";

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
    await fetch(`${ApiBaseUrl}/meta?id=${id}`).then(response =>
      response.json()).then((json) => {
        // console.log(json.videoData)
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
        <div style={{ "textAlign":"center"}}>
          {
            loading ? <ReactBootstrap.Spinner animation="border" /> :
              <VideoPlayer id={videoData["_id"]} />
          }
        </div>
        <div>
          {
            loading ? <ReactBootstrap.Spinner animation="border" /> :
              <>
                <h3>{videoData.filename}</h3>
                <h5><Link to={`/channel/${videoData.channel['_id']}`}>{videoData.channel.name}</Link></h5>
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
              </>
          }
        {/* </div> */}
      </div>
      <div>
        <h3 className="py-3">More Videos</h3>
        {
          loading ? <ReactBootstrap.Spinner animation="border" /> :
            <>
              <VideoMatrix videoList={moreVideos} />
            </>
        }
      </div>
    </div>
  );
}
