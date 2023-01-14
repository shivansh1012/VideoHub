import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { ApiBaseUrl } from '../config.js'

const UserAuthContext = createContext()

function UserAuthContextProvider (props) {
  const [userLoggedIn, setUserLoggedIn] = useState(undefined)
  const [userID, setUserID] = useState(undefined)
  const [userName, setUserName] = useState(undefined)
  const [userEmail, setUserEmail] = useState(undefined)

  async function getUserLoggedIn () {
    const loggedInRes = await axios.get(`${ApiBaseUrl}/profile/verify`)
    setUserLoggedIn(loggedInRes.data.authorized)
    setUserID(loggedInRes.data.id)
    setUserName(loggedInRes.data.name)
    setUserEmail(loggedInRes.data.email)
  }

  useEffect(() => {
    getUserLoggedIn()
  }, [])

  return (
    <UserAuthContext.Provider value={{ userLoggedIn, userID, userName, userEmail, getUserLoggedIn }}>
      {props.children}
    </UserAuthContext.Provider>
  )
}

export default UserAuthContext
export { UserAuthContextProvider }
