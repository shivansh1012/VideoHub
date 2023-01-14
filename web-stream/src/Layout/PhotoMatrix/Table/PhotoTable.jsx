import PhotoRow from "./PhotoRow";

export default function PhotoTable(props) {

    return (
        <div className="customcontainer" style={{ overflowX: "auto" }}>
            <table>
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Uploaded By</th>
                        <th>FileName</th>
                        <th>Featuring</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.photoList.map((photo, index) => {
                            if (props.photoList.length === index + 1) {
                                return (
                                    <tr key={photo._id} ref={props.lastPhotoElementRef}>
                                        {PhotoRow(photo, index)}
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={photo._id}>
                                        {PhotoRow(photo, index)}
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
