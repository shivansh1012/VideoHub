import { useState, useRef, useCallback } from "react";
import VideoMatrix from '../../../Layout/VideoMatrix/Matrix/VideoMatrix.jsx';
import useFetchForVideoFeatures from './useFetchForVideoFeatures.jsx';

export default function VideoFeaturesSection(props) {
    const [VFOffset, setVFOffset] = useState(0);
    const { isVFLoading, VFError, VFList, VFHasMore } = useFetchForVideoFeatures(props.id, "Video", "video.features", VFOffset, props.limit);

    const observer = useRef();

    const lastVFElementRef = useCallback(
        (node) => {
            if (isVFLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && VFHasMore) {
                    setVFOffset((prev) => prev + props.limit);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isVFLoading, VFHasMore, props.limit]
    );

    return (
        <>
            <VideoMatrix lastVideoElementRef={lastVFElementRef} videoList={VFList} />
            <div>{isVFLoading && !VFError && <div className="spinner"></div>}</div>
            <div>{VFError && "Error..."}</div>
        </>
    )
}
