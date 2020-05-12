import React from 'react'
import { Drawer } from 'antd'


export default (props) => {
  return (
    <Drawer
      title="墓穴信息"
      placement="right"
      closable={true}
      onClose={() => {console.log(1111); props.set && props.set(false)}}
      visible={props.isShow}
    >
      <p>环境优美...</p>
      <p>风景宜人...</p>
      <p>欢迎选择 -）...</p>
    </Drawer>
  )
}