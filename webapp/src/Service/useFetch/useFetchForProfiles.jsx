import { useState, useEffect } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";

export default function useFetchForProfiles(offset, accountType) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [profileList, setProfileList] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        let cancel;

        setIsLoading(true);
        setError(false);

        axios
            .get(`${ApiBaseUrl}/meta/list/profiles?limit=20&offset=${offset}&accountType=${accountType}`, {
                cancelToken: new CancelToken((c) => (cancel = c))
            })
            .then((res) => {

                setProfileList((prev) => {
                    return [...new Set([...prev, ...res.data.profileList])];
                });
                setHasMore(res.data.profileList.length > 0);
                setIsLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError(err);
            });

        return () => cancel();
    }, [offset, accountType]);

    return { isLoading, error, profileList, hasMore };
}
