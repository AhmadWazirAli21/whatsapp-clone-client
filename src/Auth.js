import axios from "axios";

const Auth = {
    login: user => {
        let token = user.token
        localStorage.setItem('token', JSON.stringify(token))
        axios.defaults.headers.common['Authorization'] = token
    },
    init: () => {
        let token = JSON.parse(localStorage.getItem('token'))
        axios.defaults.headers.common['Authorization'] = token !== null ? token : ''
    },
    auth: () => localStorage.getItem('token') !== null,
    guest: () => localStorage.getItem('token') === null,
    logout: () => {
        delete axios.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
    },
    getToken: () => {
        let token = JSON.parse(localStorage.getItem('token'))
        return token !== null ? token : ''
    }
}

export default Auth