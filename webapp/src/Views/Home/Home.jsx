import { useState, useRef, useCallback } from "react";
import useFetchForVideo from "../../Service/useFetch/useFetchForVideo.jsx";
import VideoMatrix from "../../Layout/VideoMatrix/VideoMatrix.jsx";

export default function Home() {
    const [offset, setOffset] = useState(0);
    const { isLoading, error, videoList, hasMore } = useFetchForVideo(offset);

    const observer = useRef();
    const lastVideoElementRef = useCallback(
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

    // const getVideoList = async () => {
    //     await fetch(`${ApiBaseUrl}/meta/list/video?limit=15&offset=${offset}`).then(response =>
    //         response.json()).then((json) => {
    //             // const newVideoListSet=[];
    //             // console.log(json)
    //             setVideoList((oldVideoList) => [...oldVideoList, ...json.videoList]);
    //             offset += 15;
    //         })
    // }

    // const handleScroll = (e) => {
    //     if (
    //         window.innerHeight + e.target.documentElement.scrollTop + 1 >=
    //         e.target.documentElement.scrollHeight
    //     ) {
    //         getVideoList()
    //     }
    // }

    // useEffect(() => {
    //     getVideoList();
    //     window.addEventListener("scroll", handleScroll)
    // }, [])

    return (
        <div className="p-5">
            <VideoMatrix videoList={videoList} lastVideoElementRef={lastVideoElementRef}/>
            <div>{isLoading && "Loading..."}</div>
            <div>{error && "Error..."}</div>
        </div>
    )
}
