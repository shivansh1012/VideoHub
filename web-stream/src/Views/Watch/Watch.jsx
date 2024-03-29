import { useEffect, useCallback, useState, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ApiBaseUrl } from '../../config.js';
import axios from 'axios';
import useFetchForMoreVideos from '../../Service/useFetch/useFetchForMoreVideos.jsx';
import VideoPlayer from "../../Layout/VideoPlayer/VideoPlayer.jsx"
import UserAuthContext from '../../UserComponents/UserAuthContext.js';
import "./Watch.css"
import VideoMatrix from '../../Layout/VideoMatrix/Matrix/VideoMatrix.jsx';

export default function Watch() {
    const { id } = useParams();
    const [offset, setOffset] = useState(0);
    const [videoData, setVideoData] = useState([]);
    const [likeStatus, setLikeStatus] = useState(undefined);
    const [watchlater, setWatchLater] = useState(undefined);
    const [playlist, setPlaylist] = useState([]);

    const [infoLoading, setInfoLoading] = useState(true);
    const [likeStatusLoading, setLikeStatusLoading] = useState(true);
    const [playlistLoading, setPlaylistLoading] = useState(true);

    const { moreVideosLoading, moreVideos, hasMore, setMoreVideos } = useFetchForMoreVideos(offset, id);
    const { userLoggedIn } = useContext(UserAuthContext)
    const navigate = useNavigate()
    const observer = useRef();

    const lastVideoElementRef = useCallback(
        (node) => {
            if (moreVideosLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setOffset((prev) => prev + 10);
                }
            });
            if (node) observer.current.observe(node);
        },
        [moreVideosLoading, hasMore]
    );

    const handleLike = async (actionType) => {
        if (!userLoggedIn) {
            navigate('/my/signin')
        }
        const payload = {
            videoid: id,
            action: "nothing",
            lastStatus: likeStatus
        }
        if (actionType === 'like') {
            if (likeStatus === undefined) {
                payload.action = "like"
            } else if (likeStatus === false) {
                payload.action = "disliketolike"
            } else {
                payload.action = "unlike"
            }
        } else if (actionType === 'dislike') {
            if (likeStatus === undefined) {
                payload.action = "dislike"
            } else if (likeStatus === true) {
                payload.action = "liketodislike"
            } else {
                payload.action = "undislike"
            }
        }
        setLikeStatusLoading(true)
        await axios.post(`${ApiBaseUrl}/profile/managelike`, payload).then(res => {
            setLikeStatus(res.data.likedStatus)
        })
        setLikeStatusLoading(false);
    }

    const handleWatchLater = async () => {
        if (!userLoggedIn) {
            navigate('/my/signin')
        }
        const payload = {
            videoid: id,
            action: "nothing"
        }
        if (watchlater === undefined || watchlater === false) {
            payload.action = "add"
        } else {
            payload.action = "remove"
        }
        setPlaylistLoading(true)
        await axios.post(`${ApiBaseUrl}/profile/managewatchlater`, payload).then(res => {
            setWatchLater(res.data.updatedstate)
        })
        setPlaylistLoading(false);
    }

    const handlePlaylistRequest = async (actionType, playlistid, laststatus) => {
        if (!userLoggedIn) {
            navigate('/my/signin')
        }
        const payload = {
            videoid: id,
            action: actionType,
            playlistid,
            newplaylistname: ""
        }
        if (actionType === "createandadd") {
            payload.newplaylistname = prompt("Enter playlistname")
        } else {
            if (laststatus === true) {
                payload.action = "remove"
            } else {
                payload.action = "add"
            }
        }
        setPlaylistLoading(true)
        await axios.post(`${ApiBaseUrl}/profile/updateplaylist`, payload).then(res => {
            setPlaylist(res.data.updatedplaylist)
        })
        setPlaylistLoading(false);
    }

    const getVideoInfo = () => {
        let uploader = "Unknown"
        let link = ""

        if (videoData.uploader != null) {
            uploader = videoData.uploader.name
            link = `/profile/${videoData.uploader._id}`
        }
        return (
            <>
                <h2 className="py-2">{videoData.title}</h2>
                {
                    (uploader) &&
                    <h4 className="profileName">
                        <Link to={link}>{uploader}</Link>
                    </h4>
                }
                <div className="infoandlike">
                    <div className="addinfo">
                        {
                            (videoData.features.length !== 0) &&
                            <div className="d-flex flex-wrap">
                                <p>Featuring: </p>
                                {
                                    videoData.features.map((feature, index) => {
                                        return (
                                            <p key={index}
                                                style={{ flex: "wrap", paddingInline: "3px", marginInline: "2px", border: "1px", borderRadius: "10px", backgroundColor: "pink" }}>
                                                <Link to={`/profile/${feature['_id']}`}>{feature.name}</Link>
                                                <br />
                                            </p>
                                        )
                                    })
                                }
                            </div>
                        }
                        <div className="d-flex flex-wrap">
                            <p>Tags: </p>
                            {
                                videoData.tags.map((tag, index) => {
                                    return <p key={index}
                                        style={{ paddingInline: "3px", marginInline: "2px", border: "1px", borderRadius: "10px", backgroundColor: "orange" }}>{tag}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className="like-dislike">
                        <div>
                            {
                                likeStatusLoading ? <div className="simple-spinner"></div> :
                                    <>
                                        <button className="btn shadow-none" onClick={() => handleLike('like')}>
                                            {
                                                likeStatus &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                                                </svg>
                                            }
                                            {
                                                (likeStatus === undefined || likeStatus === false) &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                                                </svg>
                                            }
                                            Like
                                        </button>
                                        <button className="btn shadow-none" onClick={() => handleLike('dislike')}>
                                            {
                                                (likeStatus === undefined || likeStatus === true) &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                                    <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" />
                                                </svg>
                                            }
                                            {
                                                likeStatus === false &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                                                    <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" />
                                                </svg>
                                            }
                                            Dislike
                                        </button>
                                    </>
                            }
                        </div>
                        <div>
                            {
                                playlistLoading ? <div className="simple-spinner"></div> :
                                    <>
                                        <button className="btn shadow-none" onClick={handleWatchLater}>
                                            {
                                                (watchlater === undefined || watchlater === false) &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>
                                            }
                                            {
                                                watchlater === true &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                                </svg>
                                            }
                                            Watch Later
                                        </button>
                                        {
                                            playlist.map((playlist, index) => {
                                                return (
                                                    <div className="form-check" key={playlist._id}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name={playlist.name}
                                                            value={playlist._id}
                                                            checked={playlist.contains}
                                                            onChange={() => handlePlaylistRequest("update", playlist._id, playlist.contains)}
                                                            id="flexCheckChecked"
                                                        />
                                                        <label className="form-check-label" htmlFor="flexCheckChecked">
                                                            {playlist.name}
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }
                                        <button className="btn shadow-none" onClick={() => handlePlaylistRequest("createandadd")}>
                                            Create playlist
                                        </button>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const getVideoMetaData = useCallback(async () => {
        await fetch(`${ApiBaseUrl}/meta/video?id=${id}`).then(response =>
            response.json()).then((json) => {
                setVideoData(json.videoData)
            })
        setInfoLoading(false);
    }, [id])

    const getUserStatus = useCallback(async () => {
        await axios.get(`${ApiBaseUrl}/profile/userstatus?videoid=${id}`).then(res => {
            console.log(res.data)
            if (res.data.authorized === undefined || res.data.authorized) {
                setLikeStatus(res.data.likedStatus)
                setWatchLater(res.data.watchlaterStatus)
                setPlaylist(res.data.playlist)
            }
        })
        setLikeStatusLoading(false);
        setPlaylistLoading(false);
    }, [id])

    useEffect(() => {
        setMoreVideos([])
        setOffset(0)
        getVideoMetaData()
        getUserStatus()
        window.scrollTo(0, 0)
    }, [getVideoMetaData, getUserStatus, setMoreVideos, setOffset])

    return (
        <div className="container">
            <div className="watch">
                {/* <div className="col-lg-12 col-xl-9"> */}
                <div className="videozone">
                    <div className="col-12 video">
                        {
                            infoLoading ? <div className="simple-spinner"></div> :
                                <VideoPlayer id={videoData["_id"]} />
                        }
                    </div>
                    <div className="videodetails">
                        {
                            infoLoading ? <div className="simple-spinner"></div> :
                                getVideoInfo()
                        }
                    </div>
                </div>
                {/* <div className="col-lg-12 col-xl-3 text-center"> */}
                <div className="morevideo">
                    <h3 className="py-3">More Videos</h3>
                    <div>
                        <VideoMatrix videoList={moreVideos} lastVideoElementRef={lastVideoElementRef}/>
                    </div>
                    <div>{moreVideosLoading && <div className="spinner"></div>}</div>
                </div>
            </div>
        </div>
    );
}
