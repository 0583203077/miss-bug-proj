const { useState } = React

const {Link, NavLink, useNavigate } = ReactRouterDOM
import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignup.jsx'
import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedinUser())
  const navigate = useNavigate()

  function onLogout() {
    userService.logout().then(() => {
      setUser(null)
      navigate('/')
    })
  }

  return (
    <React.Fragment>
      <header className="app-header flex align-center space-between">
        <Link to="/" className="logo flex align-center">
          <img src="assets/img/miss-bug.png" alt="" />
          <h1>Miss Bug</h1>
        </Link>
        {!user && <LoginSignup setUser={setUser} />}
        {user && (
          <div className="nav-bar-container flex align-center space-between">
            <nav className="nav-bar">
              {/* <NavLink to="/">Home</NavLink> */}
              <NavLink to="/bug">Bugs</NavLink>
              {user && <NavLink to={`/user/${user._id}`}>Profile</NavLink>}
              {user && user.isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <NavLink to="/about">About</NavLink>
            </nav>
            <div className="user-area flex align-center">
              <p>Hello {user.fullname}</p>
              <button className="btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
      <UserMsg />
    </React.Fragment>
  )
}
