import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ApiBaseUrl } from "../../config";

function useFetch(offset) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [list, setList] = useState([]);

    const sendQuery = useCallback(async () => {
        try {
            await setLoading(true);
            await setError(false);
            const res = await axios.get(`${ApiBaseUrl}/meta/model/list?limit=15&offset=${offset}`);
            await setList((prev) => [...prev, ...res.data.modelList]);
            console.log(res.data.modelList)
            setLoading(false);
        } catch (err) {
            setError(err);
        }
    }, [offset]);

    useEffect(() => {
        sendQuery(offset);
    }, [sendQuery, offset]);

    return { loading, error, list };
}

export default useFetch;