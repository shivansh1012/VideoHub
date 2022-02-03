import { useEffect, useState, useCallback } from 'react';
import VideoMatrix from '../../Layout/VideoMatrix/VideoMatrix';
import { ApiBaseUrl } from '../../config';
import * as ReactBootstrap from "react-bootstrap";

export default function SearchPage(props) {
    const [resultVideoList, setResultVideoList] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSearchResult = useCallback(async (e) => {
        if(props.searchQuery==="") {
            setResultVideoList([])
            setLoading(false);
            return
        }
        setLoading(true)
        await fetch(`${ApiBaseUrl}/meta/search?query=${props.searchQuery}`).then(response =>
            response.json()).then((json) => {
                // console.log(json.videoData)
                setResultVideoList(json.resultVideoList)
                setLoading(false);
            })
    }, [props.searchQuery])

    useEffect(getSearchResult, [getSearchResult]);

    return (
        <div className="container">
            <div className="py-5">
                <form className="input-group w-50" style={{ margin: "auto" }} onSubmit={(e) => getSearchResult(e)}>
                    <input type="text" className="form-control" placeholder="Search Video" value={props.searchQuery} onChange={(e) => props.setSearchQuery(e.target.value)} />
                    <button type="submit" className="btn bg-white border" onClick={() => getSearchResult()}>Search</button>
                </form>
            </div>
            <div>
                {
                    loading ? <ReactBootstrap.Spinner animation="border" /> :
                        <VideoMatrix videoList={resultVideoList} />
                }
            </div>
        </div>
    );
}
