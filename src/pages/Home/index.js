import React, { useState } from 'react';
import { Tabs, Button } from 'antd'
import { Link } from "react-router-dom";
import Drawer from './../../components/Drawer'
import { AppleOutlined, AndroidOutlined, DingdingOutlined, IeOutlined, WeiboCircleOutlined, QqOutlined } from '@ant-design/icons';

import './index.css'
const { TabPane } = Tabs

const operations = <>
  <Link to='/computed'><Button type="primary">统计</Button></Link>
  <Link to='/login'><Button style={{marginLeft: '6px'}}>退出登陆</Button></Link>
</>

export default () => {
  const [isShow, setIsShow] = useState(false)
  const set = (flag) => {
    setIsShow(flag)
  }
  return (
    <div className='home'>
    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
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
    <Drawer isShow={isShow} set={set}></Drawer>
    </div>
  )
}