import React, { useState } from 'react';
import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import { browserHistory } from 'react-router'
import { Redirect } from "react-router-dom";
import './index.css'


export default () => {

  const [form, setForm] = useState({ name: '', pwd: '' })
  const [isLogin, setIsLogin] = useState(false)

  const login = () => {
    if (form.name === 'admin' && form.pwd === '123456') {
      setIsLogin(true)
    } else {
      message.error('账号或密码不正确')
      return
    }

  }
  return (
    <div className='login'>
      { isLogin && <Redirect to="/home" /> }
      <div className='title'>公墓管理</div>
      <div className='modle'>
        <Form>
          <Form.Item>
            <Input 
              defaultValue={form.name} 
              placeholder='账号' 
              prefix={<UserOutlined />} 
              style={{ width: '230px', borderRadius: '6px' }}
              onInput={e => setForm({ ...form, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type='password'
              defaultValue={form.pwd} 
              placeholder='密码' 
              prefix={<LockOutlined />}  
              style={{ width: '230px', borderRadius: '6px' }}
              onInput={e => setForm({ ...form, pwd: e.target.value })}
            />
          </Form.Item>
        </Form>
        <Button type='primary' style={{ width: '230px', borderRadius: '6px', marginTop: '20px' }} onClick={ login }>登陆</Button>
      </div>
    </div>
  )
}