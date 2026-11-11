const { Link } = ReactRouterDOM
const { Fragment } = React

import { userService } from "../services/user.service.js";
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const loggedInUser = userService.getLoggedinUser()

    function isAllowed(bug) {
        if (!loggedInUser) return false
        if (loggedInUser.isAdmin ||
            bug.owner && loggedInUser._id === bug.owner._id) {
            return true
        }
        return false
    }

    if (!bugs) return <div className="loading">Loading...</div>
    if (!bugs.length) return <div className="empty-state">
        <img src="assets/img/miss-bug.png" alt="" />
        <p>No bugs to show</p>
    </div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <Link className="btn-link" to={`/bug/${bug._id}`}>Details</Link>
                    {isAllowed(bug)&&
                    <Fragment>
                        <button onClick={() => onEditBug(bug)}>Edit</button>
                        <button className="btn-danger" onClick={() => onRemoveBug(bug._id)}>x</button>
                    </Fragment>}


                </section>
            </li>
        ))}
    </ul >
}
