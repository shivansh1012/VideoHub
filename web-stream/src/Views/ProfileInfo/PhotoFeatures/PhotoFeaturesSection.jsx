import { useState, useRef, useCallback } from "react";
import PhotoMatrix from '../../../Layout/PhotoMatrix/Matrix/PhotoMatrix.jsx';
import useFetchForPhotoFeatures from './useFetchForPhotoFeatures.jsx';

export default function PhotoFeaturesSection(props) {
    const [PFOffset, setPFOffset] = useState(0);
    const { isPFLoading, PFError, PFList, PFHasMore } = useFetchForPhotoFeatures(props.id, "Photo", "photo.features", PFOffset, props.limit);

    const observer = useRef();

    const lastPFElementRef = useCallback(
        (node) => {
            if (isPFLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && PFHasMore) {
                    setPFOffset((prev) => prev + props.limit);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isPFLoading, PFHasMore, props.limit]
    );

    return (
        <>
            <PhotoMatrix lastPhotoElementRef={lastPFElementRef} photoList={PFList} />
            <div>{isPFLoading && !PFError && <div className="spinner"></div>}</div>
            <div>{PFError && "Error..."}</div>
        </>
    )
}
