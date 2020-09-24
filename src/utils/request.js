import axios from "axios";

const baseUrl = "http://230589bu77.51mypc.cn";
// const baseUrl = 'http://127.0.0.1:3030'

export default function request(url, { method, data = {}, query, ...rest }) {
  return axios({
    url: url.includes("http") ? url : baseUrl + url,
    method: method || "GET",
    data: method === "POST" ? data : {},
    params: method === "POST" ? query || {} : data,
    headers: {
      // "Accept-Encoding": 'deflate',
      // "content-encoding": 'gzip'
    },
    ...rest,
  });
}
