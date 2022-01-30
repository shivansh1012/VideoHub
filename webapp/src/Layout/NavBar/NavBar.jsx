import { Link, Navigate } from 'react-router-dom'
import "./NavBar.css"

export default function NavBar(props) {
    return (
        <nav className="navbar navbar-custom sticky-top navbar-expand-lg">
            <div className="container">
                <Link className="navbar-link my-3" style={{ "fontSize": "40px"}} to="/">VideoHub</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="d-flex" style={{marginLeft:"auto"}} onSubmit={()=>{return <Navigate to="/search"/>}}>
                        <input className="form-control me-2" type="search" placeholder="Search Video" value={props.searchQuery} onChange={(e)=>props.setSearchQuery(e.target.value)}/>
                        <Link className="btn" to="/search">Search</Link>
                    </form>
                    {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0"> */}
                    <ul className="navbar-nav ms-auto" style={{fontSize:"15px", textAlign:"center"}}>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/video/list">VideoList</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/model/list">ModelList</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/channel/list">ChannelList</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/settings">Settings</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/about">About</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
