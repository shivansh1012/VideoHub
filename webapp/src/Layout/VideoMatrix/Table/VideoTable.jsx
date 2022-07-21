import VideoRow from "./VideoRow"

export default function VideoTable(props) {
    return (
        <div className={`customcontainer ${props.animation}`} style={{ overflowX: "auto" }}>
            <table>
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Uploaded By</th>
                        <th>FileName</th>
                        <th>Featuring</th>
                        <th>Upload Date</th>
                        <th>Upload Time</th>
                        <th>Duration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.videoList.map((video, index) => {
                            if (props.videoList.length === index + 1) {
                                return (
                                    <tr key={video._id} ref={props.lastVideoElementRef}>
                                        {VideoRow(video, index)}
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={video._id}>
                                        {VideoRow(video, index)}
                                    </tr>
                                );
                            }
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
