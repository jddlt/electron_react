import React from 'react';
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import './index.css';

export default () => {
  return (
    <div style={{textAlign: 'center'}}>
      <Link to='/'><Button style={{marginTop: '80px'}}>返回</Button></Link>
      <div className='box'>统计</div>
    </div>
  )
}