import React, { useState, useEffect } from 'react';
import { 
  Card,
  Form,
  Input,
} from 'antd'
import { Link } from 'react-router-dom'
import request from './../../utils/request'
// import { exportExcel } from 'xlsx-oc'
import './index.css';


export default () => {
    const [show, setShow] = useState(false)
    const [list, setList] = useState([])

    const [form] = Form.useForm()

    return (
        <Card className='computed' title={<span style={{fontWeight: 'bold'}}>添加墓地</span>} bordered={false} extra={ extre }>
            <Form form={form}>
                <Form.Item label="墓位编号" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
                <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                    <Input placeholder='请输入区域名称'></Input>
                </Form.Item>
            </Form>
        </Card>
    )
}
