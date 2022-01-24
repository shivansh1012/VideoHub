import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetchForChannel from "../../Service/useFetch/useFetchForChannel.jsx"

export default function ModelList() {
    const [offset, setOffset] = useState(0);
    const { isLoading, error, channelList, hasMore } = useFetchForChannel(offset);

    const observer = useRef();

    const lastChannelElementRef = useCallback(
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
                <td><Link to={`/channel/${channel._id}`}>View</Link></td>
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
                        channelList.map((channel, index) => {
                            if (channelList.length === index + 1) {
                                return (
                                    <tr key={channel._id} ref={lastChannelElementRef}>
                                        {returnRow(channel, index)}
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={channel._id}>
                                        {returnRow(channel, index)}
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
