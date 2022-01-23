import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
// import axios from 'axios';
import { apiBaseURL } from '../../config.js';

export default function VideoList() {
    const [videoList, setVideoList] = useState([]);

    const getVideoList = async () => {
        // const response = await axios.get(`${apiBaseURL}/meta/list`);
        await fetch(`${apiBaseURL}/meta/list`).then(response => 
            response.json()).then((json) => {
            console.log(json.videoList)
            setVideoList(json.videoList);
        })
    }

    const rowRender = (video) => {
        let modelList = ""
        video.model.forEach(myFunction);

        function myFunction(value, index, array) {
            modelList += value["name"] + " ";
        }
        return (
            <tr key={video._id}>
                {/* <th scope="row">{index+1}</th> */}
                <td>{video.channel.name}</td>
                <td>{video.filename}</td>
                <td>{modelList}</td>
                <td><Link to={`/video/${video._id}`}>View</Link></td>
            </tr>
        ) 
    }

    useEffect(() => {
        getVideoList();
    }, [])
    return (
        <div className="container" style={{"textAlign":"center"}}>
            <table className="table">
                <thead>
                    <tr>
                        {/* <th scope="col">ID</th> */}
                        <th scope="col">Channel</th>
                        <th scope="col">FileName</th>
                        <th scope="col">Model</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        videoList.map((video, index) => {
                            return rowRender(video)
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
