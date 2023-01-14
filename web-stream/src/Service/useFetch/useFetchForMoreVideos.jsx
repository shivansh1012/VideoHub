import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";

export default function useFetchForMoreVideos(offset, id) {
    const [moreVideosLoading, setMoreVideosLoading] = useState(true);
    const [error, setError] = useState(false);
    const [moreVideos, setMoreVideos] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setMoreVideosLoading(true);
        setError(false);
        axios
            .get(`${ApiBaseUrl}/meta/video/more?id=${id}&limit=10&offset=${offset}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {
                setMoreVideos((prev) => {
                    return [...new Set([...prev, ...res.data.moreVideos])];
                });
                setHasMore(res.data.moreVideos.length > 0);
                setMoreVideosLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError(err);
            });

        return () => cancel();
    }, [offset, id]);

    return { moreVideosLoading, error, moreVideos, hasMore, setMoreVideos };
}
