import { ApiBaseUrl } from '../../config.js';
import { useEffect, useState } from 'react';
import VideoMatrix from '../../Layout/VideoMatrix/Matrix/VideoMatrix.jsx';
import PhotoMatrix from '../../Layout/PhotoMatrix/Matrix/PhotoMatrix.jsx';

export default function Home() {
  const [randomVideoList, setRandomVideoList] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);


  const [randomPhotoList, setRandomPhotoList] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    const getRandomVideoList = async () => {
      await fetch(`${ApiBaseUrl}/meta/video/random?offset=8`).then(response =>
        response.json()).then((json) => {
          setRandomVideoList(json.randomVideolist);
        })
      setLoadingVideos(false);
    }

    const getRandomPhotoList = async () => {
      await fetch(`${ApiBaseUrl}/meta/photo/random?offset=8`).then(response =>
        response.json()).then((json) => {
          setRandomPhotoList(json.randomPhotolist);
        })
      setLoadingPhotos(false);
    }

    getRandomVideoList()
    getRandomPhotoList()
  }, [setRandomVideoList, setLoadingVideos, setRandomPhotoList, setLoadingPhotos])

  return (
    <div className="container">
      <div>

        <div className="pagetitle">
          <p>Random Videos</p>
        </div>
        <div>
          {
            loadingVideos ? <div className="simple-spinner"></div> :
              <VideoMatrix animation="animate-bottom" videoList={randomVideoList} />
          }
        </div>
      </div>
      <div>
        <div className="pagetitle">
          <p>Random Photos</p>
        </div>
        <div>
          {
            loadingPhotos ? <div className="simple-spinner"></div> :
              <PhotoMatrix photoList={randomPhotoList} />
          }
        </div>
      </div>
    </div>
  )
}
