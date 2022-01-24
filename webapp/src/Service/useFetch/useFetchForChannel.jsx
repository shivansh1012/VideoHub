import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";

function useFetch(offset) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [channelList, setChannelList] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsLoading(true);
        setError(false);

        axios
            .get(`${ApiBaseUrl}/meta/list/channel?limit=20&offset=${offset}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {

                setChannelList((prev) => {
                    return [...new Set([...prev, ...res.data.channelList])];
                });
                setHasMore(res.data.channelList.length > 0);
                setIsLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError(err);
            });

        return () => cancel();
    }, [offset]);
    
        return { isLoading, error, channelList, hasMore };
    }

export default useFetch;