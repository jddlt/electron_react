import React, { useState } from 'react';
import { Tabs, Button, Card } from 'antd'
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
  const [list, setIsShow] = useState([
    {
      // status: 
    }
  ])
  const set = (flag) => {
    setIsShow(flag)
  }
  return (
    <div className='home'>
      <Card title='东一区'>
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
                <div className='list-info'>
                  
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