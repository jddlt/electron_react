import React, { useState, useEffect } from 'react';
import { Card, Select, Button } from 'antd'
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
    setBox({ width: (maxRow * 58 + 12) + 'px', height: (maxCol * 52 + 12) + 'px' })
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
                      <div className='list-item' style={{left: (((item.row - 1 )* 58 + 12) + 'px'), top: (((item.columns - 1 )* 52 + 12) + 'px')}}>
                        {
                          <i className='iconfont i' style={{color: ['#aaa','red','green'][item.status]}}>&#xe63a;</i>
                        }
                      </div>
                    ))
                  }
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