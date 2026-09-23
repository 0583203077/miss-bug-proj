import { userService } from "../services/user.service.js";

export function UserIndex() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.getUsers()
            .then(users => {
                setUsers(users)
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
                    <span>{user.username}</span>
                    <button onClick={() => onRemoveUser(user._id)}>
                        Delete
                    </button>
                </div>
            ))}
        </section>
    )
}