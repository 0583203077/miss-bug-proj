const { NavLink } = ReactRouterDOM
import { userService } from "../services/user.service.js"


export function AppHeader() {
    return <header className="app-header main-content single-row">
        <h1>Miss Bug</h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to={`/user/${userService.getLoggedinUser()._id}`}>
                Profile
            </NavLink>
            {userService.getLoggedinUser().isAdmin && (
    <NavLink to="/user">Users</NavLink>
)}
        </nav>
    </header>
}