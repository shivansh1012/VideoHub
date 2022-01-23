import React from 'react'
import { Link, Navigate } from 'react-router-dom'

export default function NavBar(props) {
    return (
        <nav className="navbar sticky-top navbar-expand-sm navbar-light bg-white">
            <div className="container">
                <Link className="navbar-link my-3" style={{ "fontSize": "40px", "color": "black", textDecoration: "none"}} to="/">VideoHub</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="d-flex" style={{marginLeft:"auto"}} onSubmit={()=>{return <Navigate to="/search"/>}}>
                        <input className="form-control me-2" type="search" placeholder="Search Video" value={props.searchQuery} onChange={(e)=>props.setSearchQuery(e.target.value)}/>
                        <Link className="btn bg-white" to="/search">Search</Link>
                    </form>
                    {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0"> */}
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/list">List</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/settings">Settings</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
