import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetchForPhoto from "../../Service/useFetch/useFetchForPhoto.jsx"

export default function PhotoList() {
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState("_id")
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

    const returnRow = (photo, index) => {
        return (
            <>
                <td>{index + 1}</td>
                <td>{photo.title}</td>
                <td>{photo.model.map((model, i) => {
                    return <p key={i} style={{ margin: "0" }}>{model.name}</p>
                })}</td>
                <td>{(new Date(photo.uploaddate).toDateString())}</td>
                <td>{(new Date(photo.uploaddate).toLocaleTimeString())}</td>
                <td><Link to={`/photo/${photo._id}`}>View</Link></td>
            </>
        )
    }

    const handleSort = (e) => {
        console.log(e.target.value)
        setOffset(0)
        setSort(e.target.value)
        setPhotoList([])
    }

    return (
        <div className="customcontainer" style={{ overflowX: "auto" }}>
            <div className="pagetitle">
                <p>Photo List</p>
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
                    <col style={{ width: "45%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>FileName</th>
                        <th>Model</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        photoList.map((photo, index) => {
                            if (photoList.length === index + 1) {
                                return (
                                    <tr key={photo._id} ref={lastPhotoElementRef}>
                                        {returnRow(photo, index)}
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={photo._id}>
                                        {returnRow(photo, index)}
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
