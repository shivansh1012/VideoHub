import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetchForProfiles from "../../Service/useFetch/useFetchForProfiles.jsx"

export default function ChannelList() {
    const [offset, setOffset] = useState(0);
    const { isLoading, error, profileList, hasMore } = useFetchForProfiles(offset, 'channel');

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
                <td>{index + 1}</td>
                <td>{channel.name}</td>
                <td>{channel.videoList.length}</td>
                <td><Link to={`/channel/${channel._id}`}>View</Link></td>
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
                        profileList.map((channel, index) => {
                            if (profileList.length === index + 1) {
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
            <div>{isLoading && ! error && <div className="spinner"></div>}</div>
            <div>{error && "Error..."}</div>
        </div>
    )
}
