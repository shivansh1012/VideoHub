import { SourceBaseUrl } from "../../config.js";

export default function PlaylistMatrixGrid(props) {
    const Cards = (playlist) => {
        return (
            <div className="card videocard">
                <div className="videocardthumbnail">
                    <div className="videocardthumbnailimgoverlay">
                        <img src={`${SourceBaseUrl}/static/${playlist.playlistpicURL}`}
                            className="videocardthumbnailimg" alt={playlist.name} />
                    </div>
                </div>

                <div className="card-body">
                    <p className="card-text videocardtitle" title={playlist.name}>
                        {/* <Link to={`/video/${video._id}`}>{video.title}</Link> */}
                        {playlist.name}
                    </p>
                    <p className="card-title videocardchannel" title={playlist.byUser.name}>{playlist.byUser.name}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="container">
            <div className="row g-3">
                {
                    Object.keys(props.playlist).map((playlist, i) => {
                        return (
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3" key={props.playlist[playlist]._id}>
                                {Cards(props.playlist[playlist])}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}
