const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"
import { BugList } from '../cmps/BugList.jsx'


export function UserDetails() {

    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState([])
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        
        loadBugs()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(user=>{
                setUser(user)
                console.log(user,params.userId)
            })
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })

    }

    function loadBugs() {
        bugService.query({ owner: params.userId })
            .then(({bugs})=>
            setBugs(bugs))
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onBack() {
        navigate('/')
    }

    if (!user) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 4)}
            </pre>
            <BugList
                        bugs={bugs}
                         />
            <button onClick={onBack} >Back</button>
        </section>
    )
}
//onRemoveBug={onRemoveBug}
                        // onEditBug={onEditBug} 