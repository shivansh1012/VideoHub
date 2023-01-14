import { useState, useRef, useCallback } from "react";
import VideoMatrix from '../../../Layout/VideoMatrix/Matrix/VideoMatrix.jsx';
import useFetchForVideoUpload from './useFetchForVideoUpload.jsx';

export default function VideoUploadSection(props) {
    const [VUOffset, setVUOffset] = useState(0);
    const { isVULoading, VUError, VUList, VUHasMore } = useFetchForVideoUpload(props.id, "Video", "video.uploads", VUOffset, props.limit);

    const observer = useRef();

    const lastVUElementRef = useCallback(
        (node) => {
            if (isVULoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && VUHasMore) {
                    setVUOffset((prev) => prev + props.limit);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isVULoading, VUHasMore, props.limit]
    );

    return (
        <>
            <VideoMatrix lastVideoElementRef={lastVUElementRef} videoList={VUList} />
            <div>{isVULoading && !VUError && <div className="spinner"></div>}</div>
            <div>{VUError && "Error..."}</div>
        </>
    )
}
