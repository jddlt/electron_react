import { message } from "antd"
import axios from 'axios'

const baseUrl = 'http://127.0.0.1:3030'


export default function request (url, { method, data = {}, params = {}, ...rest}) {
    return axios({
        url: (url.includes('http') ? url : baseUrl + url),
        method: method || 'GET',
        data,
        params,
        ...rest
    })
}