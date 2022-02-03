import { useState } from 'react'
import axios from 'axios'
import { ApiBaseUrl } from '../../config.js'
import { Link, useNavigate } from 'react-router-dom'
import './SignUp.css'

export default function SignUp() {
  let navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const registerData = {
      name,
      email,
      password
    }
    axios.post(`${ApiBaseUrl}/profile/register`, registerData, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(async (res) => {
        alert(res.data.message);
        navigate('/profile/signin');
      })
      .catch((err) => {
        console.error(err);
        alert("Error")
      });
  };
  return (
    <div className="signUp-form">
      <form onSubmit={handleRegister}>
        <h2>Sign Up</h2>
        <div className="form-container">
          <label>Name</label>
          <input type="text" name="name" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Email</label>
          <input type="text" name="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" name="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="text-center">
            <button type="submit" className="btn btn-success me-2">Sign Up</button>
          </div>
        </div>
      </form>
      <p className="signIn-cta"><Link to="/profile/signin">Already have an account? Sign In</Link></p>
    </div>
  )
}
