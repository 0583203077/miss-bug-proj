const { Link, NavLink } = ReactRouterDOM
import { userService } from "../services/user.service.js"


export function AppHeader({ loggedinUser, setLoggedinUser }) {

    function onLogout() {
        userService.logout()
            .then(() => setLoggedinUser(null))
            .catch(err => {
                console.log(err)
                showErrorMsg(`Couldn't logout`)
            })
    }

    return <header className="app-header main-content single-row">
        <h1>Miss Bug</h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
            {
                !loggedinUser
                    ? <NavLink to="/auth" >Login</NavLink>
                    : <div className="user">
                        <Link to={`/user/${loggedinUser._id}`}>{loggedinUser.fullname}</Link>
                        {loggedinUser.isAdmin && (
                            <NavLink to="/user">Users</NavLink>
                        )}
                        <button onClick={onLogout}>logout</button>
                    </div>
            }


            {/* <NavLink to={`/user/${userService.getLoggedinUser()._id}`}>
                Profile
            </NavLink> */}

        </nav>
    </header>
}