import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../../config";

export default function useFetchForVideoFeatures(id, type, list, offset, limit) {
    const [isVFLoading, setIsVFLoading] = useState(true);
    const [VFError, setVFError] = useState(false);
    const [VFList, setVFList] = useState([]);
    const [VFHasMore, setVFHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsVFLoading(true);
        setVFError(false);
        axios
        .get(`${ApiBaseUrl}/meta/profile/files?id=${id}&type=${type}&list=${list}&offset=${offset}&limit=${limit}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {
                // console.log(res)
                setVFList((prev) => {
                    return [...new Set([...prev, ...res.data.list])];
                });
                setVFHasMore(res.data.list.length > 0);
                setIsVFLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setVFError(err);
            });

        return () => cancel();
    }, [id, type, list, offset, limit]);

    return { isVFLoading, VFError, VFList, VFHasMore, setVFList };
}
