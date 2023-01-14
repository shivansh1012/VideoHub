import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../../config";

export default function useFetchForPhotoFeatures(id, type, list, offset, limit) {
    const [isPFLoading, setIsPFLoading] = useState(true);
    const [PFError, setPFError] = useState(false);
    const [PFList, setPFList] = useState([]);
    const [PFHasMore, setPFHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsPFLoading(true);
        setPFError(false);
        axios
            .get(`${ApiBaseUrl}/meta/profile/files?id=${id}&type=${type}&list=${list}&offset=${offset}&limit=${limit}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {
                // console.log(res)
                setPFList((prev) => {
                    return [...new Set([...prev, ...res.data.list])];
                });
                setPFHasMore(res.data.list.length > 0);
                setIsPFLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setPFError(err);
            });

        return () => cancel();
    }, [id, type, list, offset, limit]);

    return { isPFLoading, PFError, PFList, PFHasMore, setPFList };
}
