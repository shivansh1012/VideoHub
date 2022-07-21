import { useState, useRef, useCallback } from "react";
import useFetchForVideo from "../../Service/useFetch/useFetchForVideo.jsx";
import VideoMatrixGrid from "../../Layout/VideoMatrix/VideoMatrixGrid.jsx";
import "./Home.css"
import VideoMatrix from "../../Layout/VideoMatrix/Matrix/VideoMatrix.jsx";

export default function Home() {
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

    const handleSort = (e) => {
        setOffset(0)
        setSort(e.target.value)
        setVideoList([])
    }

    return (
        <div className="container">
            {/* <div className="pagetitle">
                <p>Top Videos</p>
            </div> */}
            <div className="sortselect">
                <select className="form-select w-50"
                    value={sort}
                    onChange={handleSort}>
                    <option value="_id">NoSort</option>
                    <option value="uploaddate">Desc Upload Time</option>
                    <option value="-uploaddate">Recently Uploaded</option>
                </select>
            </div>
            <div className="animate-bottom">
                {/* <VideoMatrixGrid videoList={videoList} lastVideoElementRef={lastVideoElementRef} /> */}
                <VideoMatrix animation="animate-bottom" lastVideoElementRef={lastVideoElementRef} videoList={videoList} />
            </div>
            <div>{isLoading && !error && <div className="spinner"></div>}</div>
            <div>{error && "Error..."}</div>
        </div>
    )
}
