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
      <header className="flex align-center space-between">
        {!user && <LoginSignup setUser={setUser} />}
        {user && (
          <div className="nav-bar-container flex space-between">
            <nav className="nav-bar">
              {/* <NavLink to="/">Home</NavLink> */}
              <NavLink to="/bug">Bugs</NavLink>
              {user && <Link to={`/user/${user._id}`}>Profile</Link>}
              {user && user.isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <NavLink to="/about">About</NavLink>
            </nav>
            <div>
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
