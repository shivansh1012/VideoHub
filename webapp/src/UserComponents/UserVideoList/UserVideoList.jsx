import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";
import { Link } from "react-router-dom";

export default function UserVideoList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userVideoList, setUserVideoList] = useState([]);

  const getMyVideoList = () => {
    setIsLoading(true);
    setError(false);
    axios.get(`${ApiBaseUrl}/profile/myvideos`)
      .then((res) => {
        setUserVideoList(res.data.videoList);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }

  useEffect(() => {
    getMyVideoList()
  }, []);

  const returnRow = (video, index) => {
    let channelName = ""
    if (video.channel && video.channel != null) channelName = video.channel.name
    return (
      <>
        <td>{index + 1}</td>
        <td>{channelName}</td>
        <td>{video.title}</td>
        <td>{video.model.map((model, i) => {
          return <p key={i} style={{ margin: "0" }}>{model.name}</p>
        })}</td>
        <td><Link to={`/video/${video._id}`}>View</Link></td>
      </>
    )
  }
  return (
    <div className="customcontainer" style={{ overflowX: "auto" }}>
      <table>
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "55%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>Channel</th>
            <th>FileName</th>
            <th>Model</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            userVideoList.map((video, index) => {
              return (
                <tr key={video._id}>
                  {returnRow(video, index)}
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div>{isLoading && !error && <div className="spinner"></div>}</div>
      <div>{error && "Error..."}</div>
    </div>
  )
}

