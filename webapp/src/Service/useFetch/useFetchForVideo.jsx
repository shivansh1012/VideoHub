import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";

export default function useFetchForVideo(offset, sort) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [videoList, setVideoList] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsLoading(true);
        setError(false);
        axios
            .get(`${ApiBaseUrl}/meta/video/list?limit=20&offset=${offset}&sort=${sort}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {
                // console.log(res)
                setVideoList((prev) => {
                    return [...new Set([...prev, ...res.data.videoList])];
                });
                setHasMore(res.data.videoList.length > 0);
                setIsLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError(err);
            });

        return () => cancel();
    }, [offset, sort]);

    return { isLoading, error, videoList, hasMore, setVideoList };
}
