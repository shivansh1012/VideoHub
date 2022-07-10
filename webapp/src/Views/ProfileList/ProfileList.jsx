import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useFetchForProfiles from "../../Service/useFetch/useFetchForProfiles.jsx"

export default function ProfileList() {
    const [offset, setOffset] = useState(0);
    const [accountType, setAccountType] = useState(".")
    const { isLoading, error, profileList, hasMore, setProfileList } = useFetchForProfiles(offset, accountType);

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

    const handleAccountType = (e) => {
        setOffset(0)
        setAccountType(e.target.value)
        setProfileList([])
    }

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
            
            <div className="pagetitle">
                <p>Profile List</p>
            </div>
            <div className="sortselect">
                <select className="form-select w-50"
                    value={accountType}
                    onChange={handleAccountType}>
                    <option value=".">All</option>
                    <option value="model">Models</option>
                    <option value="channel">Channels</option>
                    <option value="user">Users</option>
                </select>
            </div>
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
                        profileList.map((model, index) => {
                            if (profileList.length === index + 1) {
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
            <div>{isLoading && ! error && <div className="spinner"></div>}</div>
            <div>{error && "Error..."}</div>
        </div>
    )
}
