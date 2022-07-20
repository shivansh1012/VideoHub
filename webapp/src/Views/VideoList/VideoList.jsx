import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetchForVideo from "../../Service/useFetch/useFetchForVideo.jsx"
import "./VideoList.style.css"

export default function VideoList() {
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState("_id")
    const { isLoading, error, videoList, hasMore, setVideoList } = useFetchForVideo(offset, sort);

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
        let uploader = "Unknown"
        if (video['uploader'] && video.uploader !== null) uploader = video.uploader.name
        return (
            <>
                <td>{index + 1}</td>
                <td>{uploader}</td>
                <td>{video.title}</td>
                <td>{video.features.map((features, i) => {
                    return <p key={i} style={{ margin: "0" }}>{features.name}</p>
                })}</td>
                <td>{(new Date(video.uploaddate).toDateString())}</td>
                <td>{(new Date(video.uploaddate).toLocaleTimeString())}</td>
                <td>{video.video.ext}</td>
                <td><Link to={`/video/${video._id}`}>View</Link></td>
            </>
        )
    }

    const handleSort = (e) => {
        console.log(e.target.value)
        setOffset(0)
        setSort(e.target.value)
        setVideoList([])
    }

    return (
        <div className="customcontainer" style={{ overflowX: "auto" }}>
            <div className="pagetitle">
                <p>Video List</p>
            </div>
            <div className="sortselect">
                <select className="form-select w-50"
                    value={sort}
                    onChange={handleSort}>
                    <option value="_id">NoSort</option>
                    <option value="uploaddate">Desc Upload Time</option>
                    <option value="-uploaddate">Recently Uploaded</option>
                </select>
            </div>
            <table>
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Uploaded By</th>
                        <th>FileName</th>
                        <th>Featuring</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Action</th>
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
            <div>{isLoading && !error && <div className="spinner"></div>}</div>
            <div>{error && "Error..."}</div>
        </div>
    )
}
