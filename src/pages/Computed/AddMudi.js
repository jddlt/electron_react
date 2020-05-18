import React, { useState, useEffect } from 'react';
import { 
  Card,
  Form,
  Input,
  DatePicker,
  Select,
//   RadioGroup,
  Radio,
  Button,
  InputNumber,
  message
} from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Message, request, filterNoUseParams } from './../../utils/index'

// import { exportExcel } from 'xlsx-oc'
import './index.css';
const { Group } = Radio

export default () => {
    const [show, setShow] = useState(false)
    const [list, setList] = useState([])
    const [areaList, setAreaList] = useState([])
    const [form] = Form.useForm()

    const extre = <Link to='/computed'><Button>返回</Button></Link>

    const handleSubmit = async () => {
        // const val = await form.validateFields()
        const val = await form.getFieldsValue()
        const res = await request('/addMudi', { 
            method: 'POST', 
            data:  filterNoUseParams({
                ...val,
                diedDay: val.diedDay && moment().format('YYYY-MM-DD'),
                buyDay: val.buyDay && moment().format('YYYY-MM-DD HH:mm:ss'),
                useDay: val.useDay && moment().format('YYYY-MM-DD')
            })
        })
        Message(res)
    }
    const getAreaList = async() => {
        const res = await request('/areaList', {})
        setAreaList(res.data.data)
    }

    const handleChange = () => {
        setAreaList([...areaList])
    }

    useEffect(() => {getAreaList()}, [])
    return (
        
        <Card className='computed' title={<span style={{fontWeight: 'bold'}}>添加墓地</span>} bordered={false} extra={ extre }>
            <Form form={form} style={{width: '400px', transform: 'translateX(-50%)', marginLeft: '50%'}} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <Form.Item label="当前状态" rules={[{ required: true, message: '当前状态不能为空' }]} name="status">
                    <Select placeholder="请选择当前状态" onChange={handleChange}>
                        <Select.Option value='0'>未出售</Select.Option>
                        <Select.Option value='1'>已出售未使用</Select.Option>
                        <Select.Option value='2'>已出售已使用</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="墓位编号" required>
                    <Form.Item rules={[{ required: true, message: '排数不能为空' }]} name='row' style={{display: 'inline-block',width: '50%', marginBottom: 0}}>
                        <InputNumber 
                            style={{ width: '100%' }} 
                            formatter={value => `${value}排`}
                            parser={value => value.replace('排', '')}
                        />
                    </Form.Item>
                    <Form.Item rules={[{ required: true, message: '列数不能为空' }]} name='columns' style={{display: 'inline-block',width: '50%', marginBottom: 0}}>
                        <InputNumber 
                            style={{ width: '100%' }} 
                            formatter={value => `${value}列`}
                            parser={value => value.replace('列', '')}
                        />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="穴位类型" rules={[{ required: true, message: "穴位类型不能为空" }]} name="type">
                    <Group initialValue="0">
                        <Radio value='0'>单</Radio>
                        <Radio value='1'>双</Radio>
                    </Group>
                </Form.Item>
                <Form.Item label="所在区域" rules={[{ required: true, message: '所在区域不能为空' }]} name="areaId">
                    <Select placeholder="请选择所在区域">
                        {
                            areaList.map(item => (
                                <Select.Option value={item.id} key={item.id}>{ item.area }</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="基本价格" rules={[{ required: true, message: '基本价格不能为空' }]} name="basePrice">
                    <Input placeholder='请输入基本价格'></Input>
                </Form.Item>
                <Form.Item label="管理费用" rules={[{ required: true, message: '管理费用不能为空' }]} name="managePrice">
                    <Input placeholder='请输入管理费用'></Input>
                </Form.Item>
                <Form.Item label="其他费用" rules={[{ required: true, message: '其他费用不能为空' }]} name="otherPrice">
                    <Input placeholder='请输入其他费用'></Input>
                </Form.Item>
                <Form.Item label="合计费用" rules={[{ required: true, message: '合计费用不能为空' }]} name="totalPrice">
                    <Input placeholder='请输入合计费用'></Input>
                </Form.Item>
                {
                    form.getFieldValue('status') &&
                    form.getFieldValue('status') > 0 &&
                    <>
                        <Form.Item label="死者姓名" rules={[{ required: true, message: '死者姓名不能为空' }]} name="name">
                            <Input placeholder='请输入死者姓名'></Input>
                        </Form.Item>
                        <Form.Item label="性别" rules={[{ required: true, message: '性别不能为空' }]} name="sex">
                            <Group initialValue="0">
                                <Radio value='1'>男</Radio>
                                <Radio value='0'>女</Radio>
                            </Group>
                            {/* <Input placeholder='请输入性别'></Input> */}
                        </Form.Item>
                        <Form.Item label="身份证" rules={[{ required: true, message: '身份证不能为空' }]} name="card">
                            <Input placeholder='请输入身份证'></Input>
                        </Form.Item>
                        <Form.Item label="村居" rules={[{ required: true, message: '村居不能为空' }]} name="village">
                            <Input placeholder='请输入村居'></Input>
                        </Form.Item>
                        <Form.Item label="死完日期" rules={[{ required: true, message: '死完日期不能为空' }]} name="diedDay">
                            <DatePicker placeholder='请输入死完日期' style={{width: '100%'}}></DatePicker>
                        </Form.Item>
                        <Form.Item label="购买者" rules={[{ required: true, message: '购买者不能为空' }]} name="buyer">
                            <Input placeholder='请输入购买者'></Input>
                        </Form.Item>
                        <Form.Item label="联系电话" rules={[{ required: true, message: '联系电话不能为空' }]} name="phone">
                            <Input placeholder='请输入联系电话'></Input>
                        </Form.Item>
                        <Form.Item label="地址" rules={[{ required: true, message: '地址不能为空' }]} name="address">
                            <Input placeholder='请输入地址'></Input>
                        </Form.Item>
                        <Form.Item label="购买日期" rules={[{ required: true, message: '购买日期不能为空' }]} name="buyDay">
                            <DatePicker placeholder='请输入购买日期' showTime style={{width: '100%'}}></DatePicker>
                        </Form.Item>
                        <Form.Item label="销售经办人" rules={[{ required: true, message: '销售经办人不能为空' }]} name="manager">
                            <Input placeholder='请输入销售经办人'></Input>
                        </Form.Item>
                        <Form.Item label="使用日期" rules={[{ required: true, message: '使用日期不能为空' }]} name="useDay">
                            <DatePicker placeholder='请输入使用日期' style={{width: '100%'}}></DatePicker>
                        </Form.Item>
                    </>
                }
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button type='primary' onClick={ handleSubmit }>确定</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
