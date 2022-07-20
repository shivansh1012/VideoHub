import { useState, useRef, useCallback } from "react";
import PhotoMatrix from "../../Layout/PhotoMatrix/Matrix/PhotoMatrix.jsx";
import PhotoTable from "../../Layout/PhotoMatrix/Table/PhotoTable.jsx";
import useFetchForPhoto from "../../Service/useFetch/useFetchForPhoto.jsx"
import "./PhotoList.css"

export default function PhotoList() {
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState("_id")
    const [view, setView] = useState(false)
    const { isLoading, error, photoList, hasMore, setPhotoList } = useFetchForPhoto(offset, sort);

    const observer = useRef();
    const lastPhotoElementRef = useCallback(
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
        console.log(e.target.value)
        setOffset(0)
        setSort(e.target.value)
        setPhotoList([])
    }

    const toggleView = (e) => {
        if (e.target.checked) {
            setView(true)
        } else {
            setView(false)
        }
    }

    return (
        <div className="container">
            <div>

                <div className="sortselect">
                    <select className="form-select w-50"
                        value={sort}
                        onChange={handleSort}>
                        <option value="_id">NoSort</option>
                        <option value="uploaddate">Desc Upload Time</option>
                        <option value="-uploaddate">Recently Uploaded</option>
                    </select>
                </div>
                <div className="view-slider">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 0 .5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-13 2A.5.5 0 0 1 .5 2h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-13 2A.5.5 0 0 1 .5 4h10a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-13 2A.5.5 0 0 1 .5 6h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-13 2A.5.5 0 0 1 .5 8h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-13 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-13 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-13 2a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5Zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Z" />
                        </svg>
                    </span>
                    <label className='toggle-view' htmlFor='checkbox'>
                        <input
                            type='checkbox'
                            id='checkbox'
                            onChange={toggleView}
                            defaultChecked={view}
                        />
                        <div className='slider round'></div>
                    </label>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                            <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                        </svg>
                    </span>
                </div>
            </div>
            <PhotoMatrix lastPhotoElementRef={lastPhotoElementRef} photoList={photoList} isLoading={isLoading} error={error} />
            {/* <PhotoTable lastPhotoElementRef={lastPhotoElementRef} photoList={photoList} isLoading={isLoading} error={error}/> */}
            <div>{isLoading && !error && <div className="spinner"></div>}</div>
            <div>{error && "Error..."}</div>
        </div>
    )
}
