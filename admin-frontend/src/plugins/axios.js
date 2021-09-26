import axios from 'axios'
import {APIURL} from '@/constants'

axios.interceptors.request.use((config) => {
    // Then, if we make any requests to an endpoint other than /login, we set the x-token request header
    if (config.url.includes(APIURL) && !config.url.includes('login')) {
        config.headers['x-token'] = localStorage.getItem('token')
        return config
    }
    return config
}, (error) => {
    return Promise.reject(error)
})