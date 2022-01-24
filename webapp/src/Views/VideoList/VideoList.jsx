import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../Service/useFetch/useFetchForVideo.jsx"

export default function VideoList() {
    const [offset, setOffset] = useState(0);
    const { isLoading, error, videoList, hasMore } = useFetch(offset);

    const observer = useRef();
    const lastVideoElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setOffset((prev) => prev + 20);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    // const rowRender = (video) => {
    //     let modelList = ""
    //     video.model.forEach(myFunction);

    //     function myFunction(value, index, array) {
    //         modelList += value["name"] + " ";
    //     }
    //     return (
    //         <tr key={video._id}>
    //             {/* <th scope="row">{index+1}</th> */}
    //             <td>{video.channel.name}</td>
    //             <td>{video.filename}</td>
    //             <td>{modelList}</td>
    //             <td><Link to={`/video/${video._id}`}>View</Link></td>
    //         </tr>
    //     )
    // }
    return (
        <div className="container" style={{ "textAlign": "center" }}>
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
                        videoList.map((video, i) => {
                            if (videoList.length === i + 1) {
                                return (
                                    <tr key={video._id} ref={lastVideoElementRef}>
                                        {/* <th scope="row">{index+1}</th> */}
                                        <td>{video.channel.name}</td>
                                        <td>{video.filename}</td>
                                        <td><Link to={`/video/${video._id}`}>View</Link></td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={video._id}>
                                        {/* <th scope="row">{index+1}</th> */}
                                        <td>{video.channel.name}</td>
                                        <td>{video.filename}</td>
                                        <td><Link to={`/video/${video._id}`}>View</Link></td>
                                    </tr>
                                );
                            }
                        })
                    }
                </tbody>
            </table>
            <div>{isLoading && "Loading..."}</div>
            <div>{error && "Error..."}</div>
        </div>
    )

    // return (
    //     <div style={{fontSize:"40px"}}>
    //     {
    //         videoList.map((video, i) => {
    //             if (videoList.length === i + 1) {
    //                 return (
    //                     <div key={i} ref={lastBookElementRef}>
    //                         {video.filename}
    //                     </div>
    //                 );
    //             } else {
    //                 return (
    //                     <div key={i}>
    //                         {video.filename}
    //                     </div>
    //                 );
    //             }
    //         })
    //     }
    //     <div>{isLoading && "Loading..."}</div>
    //     <div>{error && "Error..."}</div>
    //     </div>
    // )
}
