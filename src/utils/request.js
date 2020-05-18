import axios from 'axios'

const baseUrl = 'http://127.0.0.1:3030'


export default function request (url, { method, data = {}, ...rest}) {
    return axios({
        url: (url.includes('http') ? url : baseUrl + url),
        method: method || 'GET',
        data: method === 'POST' ? data : {},
        params: method === 'POST' ? {} : data,
        ...rest
    })
}