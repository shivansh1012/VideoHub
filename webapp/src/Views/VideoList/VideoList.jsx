import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetchForVideo from "../../Service/useFetch/useFetchForVideo.jsx"

export default function VideoList() {
    const [offset, setOffset] = useState(0);
    const { isLoading, error, videoList, hasMore } = useFetchForVideo(offset);

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

    const returnRow = (video, index) => {
        let modelList = ""
        video.model.forEach(myFunction);

        function myFunction(value, index, array) {
            modelList += value["name"] + " ";
        }
        return (
            <>
                <th scope="row">{index + 1}</th>
                <td>{video.channel.name}</td>
                <td>{video.filename}</td>
                <td>{modelList}</td>
                <td><Link to={`/video/${video._id}`}>View</Link></td>
            </>
        )
    }
    return (
        <div className="container" style={{ "textAlign": "center" }}>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Channel</th>
                        <th scope="col">FileName</th>
                        <th scope="col">Model</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        videoList.map((video, index) => {
                            if (videoList.length === index + 1) {
                                return (
                                    <tr key={video._id} ref={lastVideoElementRef}>
                                        {returnRow(video, index)}
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={video._id}>
                                        {returnRow(video, index)}
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
}
