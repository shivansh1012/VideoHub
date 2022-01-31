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
                <Link className="navbar-link my-3" style={{ "fontSize": "40px" }} to="/">VideoHub</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    More
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="d-flex" style={{ marginLeft: "auto" }} onSubmit={handleSearch}>
                        <input className="form-control me-2" type="search" placeholder="Search Video" value={props.searchQuery} onChange={(e) => props.setSearchQuery(e.target.value)} />
                        <Link className="btn" to="/search">Search</Link>
                    </form>
                    {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0"> */}
                    <ul className="navbar-nav ms-auto" style={{ fontSize: "15px", textAlign: "center" }}>
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
                        {(userLoggedIn === false || userLoggedIn === undefined) && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/settings">Settings</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/about">About</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/signin">SignIn</Link>
                                </li>
                            </>
                        )}
                        {(userLoggedIn === true) && (
                            <li className="nav-item dropdown">
                                <div className="dropdown-toggle nav-link" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}>Hello, {userName}</div>
                                <div className="custom-dropdown-menu dropdown-menu">
                                    <Link className="dropdown-item" to="/settings">Settings</Link>
                                    <Link className="dropdown-item" to="/about">About</Link>
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
