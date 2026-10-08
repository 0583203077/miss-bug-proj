const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const AUTH_URL = '/api/auth/'
const USER_URL = '/api/user/'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    query,
    remove,
    getById,
    getEmptyCredentials
}

function login({ username, password }) {
    return axios.post(AUTH_URL + 'login', { username, password })
        .then(res => res.data)
        .then(_setLoggedinUser)
}

function signup({ username, password, fullname }) {
    return axios.post(AUTH_URL + 'signup', { username, password, fullname })
        .then(res => res.data)
        .then(_setLoggedinUser)
}

function logout() {
    return axios.post(AUTH_URL + 'logout')
        .then(() => sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER))
}

function query() {
    return axios.get(USER_URL)
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(USER_URL + userId)
        .then(res => res.data)
}

function remove(userId) {
    return axios.delete(USER_URL + userId)
        .then(res => res.data)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _setLoggedinUser(user) {
    const { _id, fullname, isAdmin } = user
    const userToSave = { _id, fullname, isAdmin }
    
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}


function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}
