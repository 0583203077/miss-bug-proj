const { useState,useEffect } = React

import { userService } from "../services/user.service.js";

export function UserIndex() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(users => {
                setUsers(users)
                console.log(users)
            })
            .catch(err => {
                console.log('Cannot load users', err)
            })
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(prevUsers =>
                    prevUsers.filter(user => user._id !== userId)
                )
            })
            .catch(err => {
                console.log('Cannot remove user', err)
            })
    }

    return (
        <section>
            <h2>Users</h2>

            {users.map(user => (
                <div key={user._id}>
                    <span>{user.fullname}</span>
                    <button onClick={() => onRemoveUser(user._id)}>
                        Delete
                    </button>
                </div>
            ))}
        </section>
    )
}