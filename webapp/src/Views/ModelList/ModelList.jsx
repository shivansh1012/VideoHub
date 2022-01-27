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
                <td>{index + 1}</td>
                <td>{channel.name}</td>
                <td>{channel.videoList.length}</td>
                <td><Link to={`/model/${channel._id}`}>View</Link></td>
            </>
        )
    }

    return (
        <div className="customcontainer" style={{ overflowX: "auto" }}>
            <table>
                <colgroup>
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "70%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Total Videos</th>
                        <th>Action</th>
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
