import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Tooltip, Popconfirm } from 'antd'
// import { SmileOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import { request } from './../../utils/index'
// import { AppleOutlined, AndroidOutlined, DingdingOutlined, IeOutlined, WeiboCircleOutlined, QqOutlined } from '@ant-design/icons';

import './index.css'
// const { TabPane } = Tabs

// const operations = <>
//   <Link to='/computed'><Button type="primary">统计</Button></Link>
//   <Link to='/login'><Button style={{marginLeft: '6px'}}>退出登陆</Button></Link>
// </>

export default () => {
  const [areaList, setAreaList] = useState([])
  const [list, setList] = useState([])
  const [box, setBox] = useState({})
  const [info, setInfo] = useState({})
  // const [, setInfo] = useState({})
  const { Option } = Select


  const getAreaList = async() => {
    const res = await request('/areaList', {})
    setAreaList(res.data.data)
    getMudiList(res.data.data[0].id)
  }

  const getMudiList = async(id) => {
    const res = await request('/mudiList', { data: { id } })
    setList(res.data.data)
    let maxCol = 0
    let maxRow = 0
    for (let i = 0; i < res.data.data.length; i++) {
      const item = res.data.data[i]
      console.log(item.row, item.columns);
      
      if (Number(item.row) > maxRow) {maxRow = Number(item.row)}
      if (Number(item.columns) > maxCol) {maxCol = Number(item.columns)}
      console.log('111111',maxRow, maxCol);
    }
    setBox({ width: (maxCol * 58 + 12) + 'px', height: (maxRow * 52 + 12) + 'px' })
    setInfo({maxRow, maxCol})
  }

  const handleOk = () => {
    
  }


  useEffect(() => {getAreaList()}, [])

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
      <Link to='/area'><Button type="link">区域管理</Button></Link>
      <Link to='/computed'><Button type="link">墓地管理</Button></Link>
    </div>
  )

  return (
    <div className='home'>
      <Card title={title} extra={extre}>
          <div className='contain'>
              <div className='type'>
                <div className='type-item'><i className='iconfont i' style={{color: '#aaa'}}>&#xe63a;</i><span>未出售</span></div>
                <div className='type-item' style={{margin: '0 18px 0 30px'}}><i className='iconfont i' style={{color: 'red'}}>&#xe63a;</i><span>已出售未使用</span></div>
                <div className='type-item'><i className='iconfont i' style={{color: 'green'}}>&#xe63a;</i><span>已出售已使用</span></div>
              </div>
              <div className='select'>
                <div className='info'>
                  <div className='info-main'>东一区 &nbsp; 已出售: <span style={{color: 'green'}}> 12</span> &nbsp; 未出售: <span style={{color: 'red'}}> 12</span></div>
                </div>
                <div className='list-info' style={{...box}}>
                  {
                    list.map(item => (
                      <div className='list-item' style={{left: (((item.columns - 1 )* 58 + 12) + 'px'), bottom: (((item.row - 1 )* 52 + 12) + 'px')}}>
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
                  <div className='x' style={{width: parseInt(box.width) < 476 ? 476 + 'px' : box.width}}>
                    {
                      (info.maxCol >= 8 ? new Array(info.maxCol).fill(null) : new Array(8).fill(null)).map((_, index) => {
                        return <div style={{fontWeight: 'bold', fontSize: '20px', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px'}}>{ index + 1 }</div>
                      })
                    }
                  </div>
                  <div className='y' style={{height: parseInt(box.width) < 428 ? 428 + 'px' : box.height}}>
                    {
                      (info.maxRow >= 8 ?new Array(info.maxRow).fill(null) : new Array(8).fill(null)).map((_, index) => {
                        return <div style={{fontWeight: 'bold', fontSize: '20px', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px'}}>{ (info.maxCol >= 8 ? info.maxCol : 8) - index + 1 }</div>
                      })
                    }
                  </div>
                </div>
              </div>
          </div> 
      </Card>
      {/* <i className='iconfont'>&#xe63a;</i> */}
    
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