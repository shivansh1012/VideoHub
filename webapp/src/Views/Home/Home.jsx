import { useState, useRef, useCallback } from "react";
import useFetchForVideo from "../../Service/useFetch/useFetchForVideo.jsx";
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";

export default function Home() {
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

    return (
        <div className="py-3">
            <div className="animate-bottom">
                <VideoMatrix videoList={videoList} lastVideoElementRef={lastVideoElementRef} />
            </div>
            <div>{isLoading && ! error && <div className="spinner"></div>}</div>
            <div>{error && "Error..."}</div>
        </div>
    )
}
