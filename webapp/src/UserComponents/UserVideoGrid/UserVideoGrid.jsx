import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";
import VideoMatrixGrid from "../../Layout/VideoMatrix/VideoMatrixGrid";

export default function UserVideoGrid() {
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

  return (
    <div>
      <h3 className="py-3" style={{ textAlign: "center" }}>My Videos</h3>
      <div className="animate-bottom">
        <VideoMatrixGrid videoList={userVideoList} />
      </div>
      <div>{isLoading && !error && <div className="spinner"></div>}</div>
      <div>{error && "Error..."}</div>
    </div>
  )
}

