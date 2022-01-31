import { useContext, useState } from 'react'
import axios from 'axios'
import UserAuthContext from '../UserAuthContext.js'
import { ApiBaseUrl } from '../../config.js'
import { Link, useNavigate } from 'react-router-dom'
import './SignIn.css'

export default function SignIn() {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { getUserLoggedIn } = useContext(UserAuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = {
      email,
      password
    }
    await axios.post(`${ApiBaseUrl}/user/login`, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: function (status) {
        return status < 500;
      }
    })
      .then(async (res) => {
        if (res.status === 401)
          alert(res.data.message);
        else {
          await getUserLoggedIn();
          navigate('/');
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error")
      });
  };

  return (
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <h2>Sign In</h2>
        <div className="form-container">
          <label>Email</label>
          <input type="text" name="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" name="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="text-center">
            <button type="submit" className="btn btn-success me-2">Sign In</button>
          </div>
        </div>
      </form>
      <p className="signUp-cta"><Link to="/signup">Create an account</Link></p>
    </div>
  )
}
