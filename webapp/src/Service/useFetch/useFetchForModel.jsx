import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";

function useFetch(offset) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [modelList, setModelList] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsLoading(true);
        setError(false);

        axios
            .get(`${ApiBaseUrl}/meta/list/model?limit=20&offset=${offset}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {

                setModelList((prev) => {
                    return [...new Set([...prev, ...res.data.modelList])];
                });
                setHasMore(res.data.modelList.length > 0);
                setIsLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError(err);
            });

        return () => cancel();
    }, [offset]);
    
        return { isLoading, error, modelList, hasMore };
    }

export default useFetch;