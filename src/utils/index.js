import { message } from 'antd'
import Request from './request'


export function Message(res) {
  if (res.data.code === 200) {
    message.success(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
}

export function request(url, { method, data = {}, ...rest}) {
  return Request(url, { method, data, ...rest})
}

export function filterNoUseParams(params) {
  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }
  return params
}
