import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../../config";

export default function useFetchForPhotoUpload(id, type, list, offset, limit) {
    const [isPULoading, setIsPULoading] = useState(true);
    const [PUError, setPUError] = useState(false);
    const [PUList, setPUList] = useState([]);
    const [PUHasMore, setPUHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsPULoading(true);
        setPUError(false);
        axios
        .get(`${ApiBaseUrl}/meta/profile/files?id=${id}&type=${type}&list=${list}&offset=${offset}&limit=${limit}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {
                // console.log(res)
                setPUList((prev) => {
                    return [...new Set([...prev, ...res.data.list])];
                });
                setPUHasMore(res.data.list.length > 0);
                setIsPULoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setPUError(err);
            });

        return () => cancel();
    }, [id, type, list, offset, limit]);

    return { isPULoading, PUError, PUList, PUHasMore, setPUList };
}
