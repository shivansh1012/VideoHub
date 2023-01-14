import { useEffect, useCallback, useState, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ApiBaseUrl } from '../../config.js';
import axios from 'axios';

import "./View.css"

export default function View() {
  const { id } = useParams();

  const [photoData, setPhotoData] = useState([]);
  const [infoLoading, setInfoLoading] = useState(true);

  const getPhotoMetaData = useCallback(async () => {
    await fetch(`${ApiBaseUrl}/meta/photo?id=${id}`).then(response =>
      response.json()).then((json) => {
        setPhotoData(json.photoData)
      })
    setInfoLoading(false);
  }, [id])

  useEffect(() => {
    getPhotoMetaData()
    window.scrollTo(0, 0)
  }, [getPhotoMetaData])

  return (
    <div >
      <img className='imageviewport' src={`${ApiBaseUrl}/stream/photo?id=${id}`} alt={id} />
    </div>
  )
}
