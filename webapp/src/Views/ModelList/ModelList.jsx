import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../Service/useFetch/useFetchForModel.jsx"

export default function ModelList() {
    const [offset, setOffset] = useState(0);
    const { isLoading, error, modelList, hasMore } = useFetch(offset);

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

    // const rowRender = (video) => {
    //     let modelList = ""
    //     video.model.forEach(myFunction);

    //     function myFunction(value, index, array) {
    //         modelList += value["name"] + " ";
    //     }
    //     return (
    //         <tr key={video._id}>
    //             {/* <th scope="row">{index+1}</th> */}
    //             <td>{video.channel.name}</td>
    //             <td>{video.filename}</td>
    //             <td>{modelList}</td>
    //             <td><Link to={`/video/${video._id}`}>View</Link></td>
    //         </tr>
    //     )
    // }
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
                                        <th scope="row">{index + 1}</th>
                                        <td>{model.name}</td>
                                        <td>{model.videoList.length}</td>
                                        <td><Link to={`/model/${model._id}`}>View</Link></td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={model._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{model.name}</td>
                                        <td>{model.videoList.length}</td>
                                        <td><Link to={`/model/${model._id}`}>View</Link></td>
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
