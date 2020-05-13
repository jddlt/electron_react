import React from 'react'
import { Drawer, Form, Button, Tag } from 'antd'


export default (props) => {
  return (
    <Drawer
      title=""
      placement="right"
      width='420'
      closable={true}
      onClose={() => { props.set && props.set(false) }}
      visible={props.isShow}
    >
      <Form style={{paddingLeft: '10px', paddingTop: '15px'}}>
        <Form.Item label="名称">
          <div>梅园一居</div>
        </Form.Item>
        <Form.Item label="地址">
          <div>上海市闵行区银都路3152弄梅园一居</div>
        </Form.Item>
        <Form.Item label="所在区域">
          <div>东一区</div>
        </Form.Item>
        <Form.Item label="家属电话">
          <div>18720276589</div>
        </Form.Item>
        <Form.Item label="出售日期">
          <div>2020-10-28 12:24:58</div>
        </Form.Item>
        <Form.Item label="状态">
          <Tag color='blue'>使用中</Tag>
        </Form.Item>
        <Form.Item>
          <Button type="primary">出售</Button>
          <Button style={{marginLeft: '8px'}}>使用</Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}