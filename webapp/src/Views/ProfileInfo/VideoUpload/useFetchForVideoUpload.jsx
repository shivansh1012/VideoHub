import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../../config";

export default function useFetchForVideoUpload(id, type, list, offset, limit) {
    const [isVULoading, setIsVULoading] = useState(true);
    const [VUError, setVUError] = useState(false);
    const [VUList, setVUList] = useState([]);
    const [VUHasMore, setVUHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsVULoading(true);
        setVUError(false);
        axios
        .get(`${ApiBaseUrl}/meta/profile/files?id=${id}&type=${type}&list=${list}&offset=${offset}&limit=${limit}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {
                // console.log(res)
                setVUList((prev) => {
                    return [...new Set([...prev, ...res.data.list])];
                });
                setVUHasMore(res.data.list.length > 0);
                setIsVULoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                console.log(err)
                setVUError(err);
            });

        return () => cancel();
    }, [id, type, list, offset, limit]);

    return { isVULoading, VUError, VUList, VUHasMore, setVUList };
}
