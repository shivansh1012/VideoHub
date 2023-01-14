import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { UserAuthContextProvider } from './UserComponents/UserAuthContext.js'

ReactDOM.render(
  <UserAuthContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserAuthContextProvider>,
  document.getElementById('root')
)
