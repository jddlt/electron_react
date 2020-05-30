import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Tooltip, Popconfirm, Modal, Form, Row, Col, Input, DatePicker, Radio, message } from 'antd'
// import { SmileOutlined } from '@ant-design/icons'
import { Link, Redirect } from "react-router-dom";
import { request, filterNoUseParams, Message } from './../../utils/index'
// import { AppleOutlined, AndroidOutlined, DingdingOutlined, IeOutlined, WeiboCircleOutlined, QqOutlined } from '@ant-design/icons';
import moment from 'moment'
import './index.css'
// const { TabPane } = Tabs

// const operations = <>
//   <Link to='/computed'><Button type="primary">统计</Button></Link>
//   <Link to='/login'><Button style={{marginLeft: '6px'}}>退出登陆</Button></Link>
// </>

const { Group } = Radio

export default () => {
  const [areaList, setAreaList] = useState([])
  const [list, setList] = useState([])
  const [box, setBox] = useState({})
  const [info, setInfo] = useState({})
  const { Option } = Select
  const [visible, setVisible] = useState(false)
  const [goDetail, setGoDetail] = useState(false)
  const [form] = Form.useForm()
  const [current, setCurrent] = useState({})
  const [areaId, setAreaId]= useState(null)
  const [buyInfo, setBuyInfo] = useState({sell: 0, noSell: 0})

  const getAreaList = async() => {
    const res = await request('/areaList', {})
    setAreaList(res.data.data)
    getMudiList(res.data.data[0].id)
    setAreaId(res.data.data[0].id)
  }

  const [ useInfo ] = useState()
  const [ print, setPrint ] = useState(false)

  useEffect(() => {
    if (print) {
      window.print()
      setPrint(false)
    }
  }, [print])

  const getMudiList =  async(id) => {
    setAreaId(id)
    const res = await request('/mudiList', { data: { id } })
    console.log(id)
    setList(res.data.data)
    setBuyInfo({
      sell: res.data.data.filter(item => item.status != 0).length,
      noSell: res.data.data.filter(item => item.status == 0).length
    })
    let maxCol = 0
    let maxRow = 0
    for (let i = 0; i < res.data.data.length; i++) {
      const item = res.data.data[i]
      if (Number(item.row) > maxRow) {maxRow = Number(item.row)}
      if (Number(item.columns) > maxCol) {maxCol = Number(item.columns)}
    }
    setBox({ width: (maxCol * 58 + 12) + 'px', height: (maxRow * 52 + 12) + 'px' })
    setInfo({ maxRow, maxCol })
  }

  const sureOk = async() => {
    const val = await form.validateFields()
    const res = await request('/updateMudi', {
      method: 'POST',
      data:  filterNoUseParams({
        ...val,
        status: current.status + 1,
        diedDay: val.diedDay && moment(val.diedDay).format('YYYY-MSM-DD'),
        buyDay: val.buyDay && moment(val.buyDay).format('YYYY-MM-DD HH:mm:ss'),
        useDay: val.useDay && moment(val.useDay).format('YYYY-MM-DD')
      }),
      query: { id: current.id }
    })
    setVisible(false)
    getMudiList(areaId)
    Message(res)
  }

  const handleOk = (item) => {
    setCurrent(item)
    
    if(item.status != '2') {
      setVisible(true)
    } else {
      setGoDetail(true)
    }
  }

  useEffect(() => { getAreaList() }, [])

  const title = (
    <Select placeholder={areaList[0] && areaList[0].area} bordered={false} onChange={e => getMudiList(e)}>
      {
        areaList.map(item => (
          <Option value={item.id} key={item.id}>{ item.area }</Option>
        ))
      }
    </Select>
  )
  const extre = (
    <div>
      <Button type="link" onClick={() => setPrint(true)}>打印</Button>
      <Link to='/area'><Button type="link">区域管理</Button></Link>
      <Link to='/computed'><Button type="link">墓地管理</Button></Link>
    </div>
  )

  return (
    <div className='home'>
      {
        print
        ? <>
          <div className='contain'>
              <div className='type'>
                <div className='type-item'><i className='iconfont i' style={{color: '#aaa'}}>&#xe63a;</i><span>未出售</span></div>
                <div className='type-item' style={{margin: '0 18px 0 30px'}}><i className='iconfont i' style={{color: 'red'}}>&#xe63a;</i><span>已出售未使用</span></div>
                <div className='type-item'><i className='iconfont i' style={{color: 'green'}}>&#xe63a;</i><span>已出售已使用</span></div>
              </div>
              <div className='select'>
                <div className='info'>
                  <div className='info-main'>{ (areaList.find(item => item.id === areaId) || {}).area } &nbsp; 已出售: <span style={{color: 'green'}}> {buyInfo.sell}</span> &nbsp; 未出售: <span style={{color: 'red'}}> {buyInfo.noSell}</span></div>
                </div>
                <div className='list-info' style={{...box}}>
                  {
                    list.map(item => (
                      <div className='list-item' key={item.id} style={{left: (((item.columns - 1 )* 58 + 12) + 'px'), bottom: (((item.row - 1 )* 52 + 12) + 'px')}}>
                        {
                          <Popconfirm 
                            title={
                              !item.status
                              ? '是否确认已出售?'
                              : item.status == 1
                                ? '是否确认已使用?'
                                : '使用中, 查看信息?'
                            }
                            okText={item.status == 2 ? "查看" : "确定" }
                            onConfirm={() => handleOk(item)}
                            cancelText="取消"
                          >
                            <Tooltip placement="bottom" title={item.row + '排' + item.columns + '列11' }>
                              <i className='iconfont i' style={{color: ['#aaa','red','green'][item.status]}} onClick={() => {}}>&#xe63a;</i>
                            </Tooltip>
                          </Popconfirm>
                        }
                      </div>
                    ))
                  }
                  <div className='x' style={{width: box.width}}>
                    {
                      new Array(info.maxCol).fill(null).map((_, index) => {
                        return <div key={index} style={{fontWeight: 'bold', fontSize: '20px', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px'}}>{ index + 1 }</div>
                      })
                    }
                  </div>
                  <div className='y' style={{height: box.height}}>
                    {
                      new Array(info.maxRow).fill(null).map((_, index) => {
                        return <div key={index} style={{fontWeight: 'bold', fontSize: '20px', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px'}}>{ info.maxRow - index }</div>
                      })
                    }
                  </div>
                </div>
              </div>
          </div>
        </>
        : <Card title={title} extra={extre}>
            <div className='contain'>
                <div className='type'>
                  <div className='type-item'><i className='iconfont i' style={{color: '#aaa'}}>&#xe63a;</i><span>未出售</span></div>
                  <div className='type-item' style={{margin: '0 18px 0 30px'}}><i className='iconfont i' style={{color: 'red'}}>&#xe63a;</i><span>已出售未使用</span></div>
                  <div className='type-item'><i className='iconfont i' style={{color: 'green'}}>&#xe63a;</i><span>已出售已使用</span></div>
                </div>
                <div className='select'>
                  <div className='info'>
                    <div className='info-main'>{ (areaList.find(item => item.id === areaId) || {}).area } &nbsp; 已出售: <span style={{color: 'green'}}> {buyInfo.sell}</span> &nbsp; 未出售: <span style={{color: 'red'}}> {buyInfo.noSell}</span></div>
                  </div>
                  <div className='list-info' style={{...box}}>
                    {
                      list.map(item => (
                        <div className='list-item' key={item.id} style={{left: (((item.columns - 1 )* 58 + 12) + 'px'), bottom: (((item.row - 1 )* 52 + 12) + 'px')}}>
                          {
                            <Popconfirm 
                              title={
                                !item.status
                                ? '是否确认已出售?'
                                : item.status == 1
                                  ? '是否确认已使用?'
                                  : '使用中, 查看信息?'
                              }
                              okText={item.status == 2 ? "查看" : "确定" }
                              onConfirm={() => handleOk(item)}
                              cancelText="取消"
                            >
                              <Tooltip placement="bottom" title={item.row + '排' + item.columns + '列'}>
                                <i className='iconfont i' style={{color: ['#aaa','red','green'][item.status]}} onClick={() => {}}>&#xe63a;</i>
                              </Tooltip>
                            </Popconfirm>
                          }
                        </div>
                      ))
                    }
                    <div className='x' style={{width: box.width}}>
                      {
                        new Array(info.maxCol).fill(null).map((_, index) => {
                          return <div key={index} style={{fontWeight: 'bold', fontSize: '20px', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px'}}>{ index + 1 }</div>
                        })
                      }
                    </div>
                    <div className='y' style={{height: box.height}}>
                      {
                        new Array(info.maxRow).fill(null).map((_, index) => {
                          return <div key={index} style={{fontWeight: 'bold', fontSize: '20px', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px'}}>{ info.maxRow - index }</div>
                        })
                      }
                    </div>
                  </div>
                </div>
            </div> 
        </Card>
      }
      <Modal
        title={current.status == 0 ? '编辑为已出售' : '编辑为已使用'}
        visible={visible}
        // width={600}
        maskClosable={false}
        cancelText='取消'
        onOk={sureOk}
        // confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                <Form.Item label='所在区域'>
                  { (areaList.find(item => item.id === current.areaId) || {}).area }
                </Form.Item>
                <Form.Item label='墓地位置'>
                  { current.row + '排' + current.columns + '列'}
                </Form.Item>
                <Form.Item label='墓地类型'>
                  { current.type === '0' ? '单' : '双' }
                </Form.Item>
                <Form.Item label='墓地价格'>
                  { current.basePrice + '元' }
                </Form.Item>
            {
              current.status == '0'
              ? <>
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
                </>
              : <>
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
                <Form.Item label="死亡日期" rules={[{ required: true, message: '死完日期不能为空' }]} name="diedDay">
                            <DatePicker placeholder='请输入死完日期' style={{width: '100%'}}></DatePicker>
                        </Form.Item>
                <Form.Item label="使用日期" rules={[{ required: true, message: '使用日期不能为空' }]} name="useDay">
                            <DatePicker placeholder='请输入使用日期' style={{width: '100%'}}></DatePicker>
                        </Form.Item>
            </>
            }
        </Form>
      </Modal>
      {/* <i className='iconfont'>&#xe63a;</i> */}
      { goDetail && <Redirect to={`/addMudi?id=${current.id}`} /> }
    </div>
  )
}











/* <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
      <TabPane tab={ <span> <AppleOutlined /> 全部 </span> } key="1" >
        <div className='container'>
          {
            new Array(20).fill(null).map((item, index) => {
              return <div className='item' key={index} onClick={() => set(true)}>{ [<DingdingOutlined />, <IeOutlined />, <WeiboCircleOutlined />, <QqOutlined />][index % 4] }</div>
            })
          }
        </div>
      </TabPane>
      <TabPane tab={ <span> <AndroidOutlined /> 未出售 </span> } key="2" >
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', color: 'rgb(125, 238, 253)', lineHeight: '200px'}}>未出售</div>
      </TabPane>
      <TabPane tab={ <span> <AndroidOutlined /> 已出售 </span> } key="3" >
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', color: 'rgb(125, 238, 253)', lineHeight: '200px'}}>已出售</div>
      </TabPane>
      <TabPane tab={ <span> <AndroidOutlined /> 未使用 </span> } key="4" >
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', color: 'rgb(125, 238, 253)', lineHeight: '200px'}}>未使用</div>
      </TabPane>
      <TabPane tab={ <span> <AndroidOutlined /> 已使用 </span> } key="5" >
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', color: 'rgb(125, 238, 253)', lineHeight: '200px'}}>已使用</div>
      </TabPane>
    </Tabs>
    <Drawer isShow={isShow} set={set}></Drawer> */