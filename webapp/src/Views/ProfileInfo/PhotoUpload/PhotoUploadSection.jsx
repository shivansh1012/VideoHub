import { useState, useRef, useCallback } from "react";
import PhotoMatrix from '../../../Layout/PhotoMatrix/Matrix/PhotoMatrix.jsx';
import useFetchForPhotoUpload from './useFetchForPhotoUpload.jsx';

export default function PhotoUploadSection(props) {
    const [PUOffset, setPUOffset] = useState(0);
    const { isPULoading, PUError, PUList, PUHasMore } = useFetchForPhotoUpload(props.id, "Photo", "photo.uploads", PUOffset, props.limit);

    const observer = useRef();

    const lastPUElementRef = useCallback(
        (node) => {
            if (isPULoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && PUHasMore) {
                    setPUOffset((prev) => prev + props.limit);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isPULoading, PUHasMore, props.limit]
    );

    return (
        <>
            <PhotoMatrix lastPhotoElementRef={lastPUElementRef} photoList={PUList} />
            <div>{isPULoading && !PUError && <div className="spinner"></div>}</div>
            <div>{PUError && "Error..."}</div>
        </>
    )
}
