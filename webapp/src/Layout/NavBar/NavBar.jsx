import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'
import axios from 'axios'
import { ApiBaseUrl } from '../../config.js'
import UserAuthContext from '../../UserComponents/UserAuthContext.js'

export default function NavBar(props) {
    let navigate = useNavigate()
    const { userLoggedIn, getUserLoggedIn, userName } = useContext(UserAuthContext);

    const handleSearch = (e) => {
        e.preventDefault()
        navigate('/search')
    }

    const handleLogout = async () => {
        await axios.get(`${ApiBaseUrl}/profile/logout`);
        await getUserLoggedIn();
        navigate('/')
    }

    return (
        <nav className="navbar navbar-custom sticky-top navbar-expand-lg">
            <div className="container">
                {/* <Link className="navbar-link my-3" to="/">
                    <img className="logo" src={`${SourceBaseUrl}/static/defaults/VideoHubTV3.png`} alt="VideoHub" />
                </Link> */}
                <Link className="navbar-link my-3" style={{ "fontSize": "50px" }} to="/">Local<span className="logospan">host</span></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    More
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="d-flex" style={{ marginLeft: "auto" }} onSubmit={handleSearch}>
                        <input className="form-control me-2" type="search" placeholder="Search Video" value={props.searchQuery} onChange={(e) => props.setSearchQuery(e.target.value)} />
                        <Link className="btn" type="submit" to="/search">Search</Link>
                    </form>
                    {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0"> */}
                    <ul className="navbar-nav ms-auto" style={{ fontSize: "15px", textAlign: "center" }}>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/photo/list">Photos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/video/list">Videos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/profile/list">Profiles</Link>
                        </li>
                        {(userLoggedIn === false || userLoggedIn === undefined) && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/settings">Settings</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/about">About</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/profile/signin">SignIn</Link>
                                </li>
                            </>
                        )}
                        {(userLoggedIn === true) && (
                            <li className="nav-item dropdown">
                                <div className="dropdown-toggle nav-link" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}>Hello, {userName}</div>
                                <div className="custom-dropdown-menu dropdown-menu">
                                    <Link to="/my">
                                        <div className="dropdown-item">Profile</div>
                                    </Link>
                                    <Link to="/settings">
                                        <div className="dropdown-item">Settings</div>
                                    </Link>
                                    <Link to="/my/videos">
                                        <div className="dropdown-item">My Videos</div>
                                    </Link>
                                    <Link to="/my/upload/video">
                                        <div className="dropdown-item">Upload Video</div>
                                    </Link>
                                    <Link to="/my/upload/picture">
                                        <div className="dropdown-item">Upload Picture</div>
                                    </Link>
                                    <Link to="/about">
                                        <div className="dropdown-item">About</div></Link>
                                    <div className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
