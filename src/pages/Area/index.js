import React, { useState, useEffect } from 'react';
import { 
  Card,
  Form,
  Button,
  message,
  Input,
  Table,
  Modal
} from 'antd'
import { Link } from 'react-router-dom'
import { request } from './../../utils/index'
// import { exportExcel } from 'xlsx-oc'
import './index.css';


export default () => {
    const [show, setShow] = useState(false)
    const [list, setList] = useState([])

    const [form] = Form.useForm()

    const columns = [
      {
        title: '区域id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '区域名称',
        dataIndex: 'area',
        key: 'area'
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: h => (
          <>
            {/* <a href='javascript:;' onClick={() => message.error('删除成功')}>编辑</a>
            <Divider type="vertical" /> */}
            <a href='javascript:;' style={{ color: 'red' }} onClick={() => deleteArea(h)}>删除</a>
          </>
        )
      }
    ].map(item => ({...item, align: 'center'}))

    const getAreaList = async() => {
      const res = await request('/areaList', {})
      setList(res.data.data)
    }

    const deleteArea = async(id) => {
      const res = await request('/deleteArea', { params: { id } })
      message.success(res.data.msg)
      getAreaList()
    }

    useEffect(() => {
      getAreaList()
    }, [])
    
    const extre = (
        <>
            <Button onClick={() => setShow(true)} type="primary">添加</Button>
            <Link to='/home'><Button type='info' style={{ marginLeft: '10px' }}>返回</Button></Link>
        </>
    )
    const handleOk = async() => {
      const val = await form.validateFields()
      const res = await request('/addArea', { method: 'POST', data: { area: val.area } })
      getAreaList()
      setShow(false)
      message.success(res.data.msg)
    }
    const MyModal = () => (
        <Modal
          title={ `添加区域` }
          visible={ show }
          onOk={ handleOk }
          onCancel={ () => setShow(false) }
          cancelText="取消"
          okText='确定'
          width="350px"
        >
          <Form form={form}>
              <Form.Item label="区域名" rules={[{ required: true, message: '区域名称不能为空' }]} name="area">
                <Input placeholder='请输入区域名称'></Input>
              </Form.Item>
          </Form>
        </Modal>
    )
    return (
        <Card className='computed' title={<span style={{fontWeight: 'bold'}}>列表统计</span>} bordered={false} extra={ extre }>
            <Table columns={columns} dataSource={list} bordered pagination={false}/>
            <MyModal />
        </Card>
    )
}
