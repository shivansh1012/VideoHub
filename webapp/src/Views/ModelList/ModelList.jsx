import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetchForModel from "../../Service/useFetch/useFetchForModel.jsx"

export default function ModelList() {
    const [offset, setOffset] = useState(0);
    const { isLoading, error, modelList, hasMore } = useFetchForModel(offset);

    const observer = useRef();

    const lastModelElementRef = useCallback(
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

    const returnRow = (channel, index) => {
        return (
            <>
                <th scope="row">{index + 1}</th>
                <td>{channel.name}</td>
                <td>{channel.videoList.length}</td>
                <td><Link to={`/model/${channel._id}`}>View</Link></td>
            </>
        )
    }

    return (
        <div className="container" style={{ "textAlign": "center" }}>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Videos</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        modelList.map((model, index) => {
                            if (modelList.length === index + 1) {
                                return (
                                    <tr key={model._id} ref={lastModelElementRef}>
                                        {returnRow(model, index)}
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={model._id}>
                                        {returnRow(model, index)}
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
